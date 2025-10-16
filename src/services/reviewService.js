import { supabase } from '../lib/supabaseClient.js';

const TABLE_NAME = 'reviews';

function normaliseString(value) {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export async function fetchReviewsForProduct({ productType, productId, limit = 50 }) {
  if (!productType || !productId) {
    return [];
  }

  const query = supabase
    .from(TABLE_NAME)
    .select('id, user_id, product_type, product_id, rating, comment, author_name, created_at')
    .eq('product_type', productType)
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(limit);

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message || 'Unable to load reviews from Supabase.');
  }
  return data ?? [];
}

export async function createReviewRecord({
  productType,
  productId,
  rating,
  comment,
  authorName,
  userId,
}) {
  if (!productType || !productId) {
    throw new Error('Missing product identifiers.');
  }

  const payload = {
    product_type: productType,
    product_id: productId,
    rating,
    comment,
  };

  const normalizedAuthor = normaliseString(authorName);
  if (normalizedAuthor) {
    payload.author_name = normalizedAuthor;
  }

  payload.user_id = userId ?? null;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(payload)
    .select('id, user_id, product_type, product_id, rating, comment, author_name, created_at')
    .single();

  if (error) {
    throw new Error(error.message || 'Không thể lưu đánh giá. Vui lòng thử lại.');
  }

  return data;
}
