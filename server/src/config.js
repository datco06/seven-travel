import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 4000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
export const SOCIAL_REDIRECT_URL = process.env.SOCIAL_REDIRECT_URL;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

export const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
export const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
export const FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined. Please set it in your environment.');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined. Please set it in your environment.');
}

export function validateSocialConfig() {
  const googleConfigured = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_CALLBACK_URL;
  const facebookConfigured = FACEBOOK_CLIENT_ID && FACEBOOK_CLIENT_SECRET && FACEBOOK_CALLBACK_URL;
  return { googleConfigured, facebookConfigured };
}
