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
  if (!event.body) return {};
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
    const {
      items = [],
      total_amount: totalAmount,
      currency = 'VND',
      guest_count: guestCount = 1,
      notes = '',
      start_date: startDate = null,
      end_date: endDate = null,
    } = payload;

    if (!Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Booking items required' }) };
    }

    const bookingCode = `BK${Date.now()}`;
    const adminClient = createSupabaseAdminClient();

    const {
      data: booking,
      error: bookingError,
    } = await adminClient
      .from('bookings')
      .insert({
        user_id: user.id,
        booking_code: bookingCode,
        total_amount: totalAmount ?? 0,
        currency,
        guest_count: guestCount,
        notes,
      })
      .select()
      .single();

    if (bookingError) {
      throw bookingError;
    }

    const itemsPayload = items.map((item) => ({
      booking_id: booking.id,
      product_type: item.product_type,
      product_id: item.product_id,
      title: item.title,
      start_date: item.start_date ?? startDate,
      end_date: item.end_date ?? endDate,
      quantity: item.quantity ?? 1,
      unit_price: item.unit_price ?? 0,
      currency: item.currency ?? currency,
      metadata: item.metadata ?? {},
    }));

    const invalidItem = itemsPayload.find(
      (item) => !item.product_type || !item.product_id || !item.title
    );
    if (invalidItem) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Each booking item must include product_type, product_id and title',
        }),
      };
    }

    const { error: itemsError } = await adminClient.from('booking_items').insert(itemsPayload);
    if (itemsError) {
      throw itemsError;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ booking, items: itemsPayload }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

