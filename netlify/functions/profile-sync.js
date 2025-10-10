import { createClient } from '@supabase/supabase-js';

const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'SUPABASE_ANON_KEY'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    // eslint-disable-next-line no-console
    console.warn(`Environment variable ${key} is not defined. Netlify function may fail.`);
  }
});

const createSupabaseAdminClient = () =>
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

const createSupabaseUserClient = (token) =>
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
    auth: { persistSession: false, autoRefreshToken: false },
  });

const parsePayload = (event) => {
  if (!event.body) {
    throw new Error('Body is required.');
  }
  try {
    return JSON.parse(event.body);
  } catch (error) {
    throw new Error('Payload is not valid JSON.');
  }
};

export default async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const token = event.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Missing bearer token' }) };
    }

    const userClient = createSupabaseUserClient(token);
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: userError?.message ?? 'Unauthorized' }),
      };
    }

    const payload = parsePayload(event);
    const profileId = payload.id ?? user.id;
    if (profileId !== user.id) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };
    }

    const data = {
      id: profileId,
      full_name: payload.full_name ?? user.user_metadata?.full_name ?? '',
      phone_number: payload.phone_number ?? user.user_metadata?.phone ?? null,
      role: payload.role ?? 'customer',
      language: payload.language ?? 'vi',
      timezone: payload.timezone ?? 'Asia/Ho_Chi_Minh',
      avatar_url: payload.avatar_url ?? user.user_metadata?.avatar_url ?? null,
      updated_at: new Date().toISOString(),
    };

    const adminClient = createSupabaseAdminClient();
    const { data: profile, error: upsertError } = await adminClient
      .from('profiles')
      .upsert(data, { onConflict: 'id' })
      .select()
      .single();

    if (upsertError) {
      throw upsertError;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ profile }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

