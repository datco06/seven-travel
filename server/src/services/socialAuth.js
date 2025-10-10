import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import pool from '../utils/db.js';

function generateRandomPassword() {
  return crypto.randomBytes(32).toString('hex');
}

export async function findUserByProvider(provider, providerId) {
  const { rows } = await pool.query(
    `SELECT u.id, u.role, u.name, u.email, u.phone, u.balance, u.created_at
     FROM user_providers up
     JOIN users u ON u.id = up.user_id
     WHERE up.provider = $1 AND up.provider_id = $2`,
    [provider, providerId],
  );
  return rows[0] ?? null;
}

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, role, name, email, phone, balance, created_at FROM users WHERE email = $1',
    [email],
  );
  return rows[0] ?? null;
}

export async function linkProviderToUser(userId, provider, providerId) {
  await pool.query(
    'INSERT INTO user_providers (id, user_id, provider, provider_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
    [uuidv4(), userId, provider, providerId],
  );
}

export async function createUserFromProfile({ provider, providerId, name, email, phone }) {
  const randomPassword = generateRandomPassword();
  const hashed = await bcrypt.hash(randomPassword, 10);
  const userId = uuidv4();
  const phoneValue = phone ?? '';

  const { rows } = await pool.query(
    `INSERT INTO users (id, role, name, email, phone, password_hash)
     VALUES ($1, 'customer', $2, $3, $4, $5)
     RETURNING id, role, name, email, phone, balance, created_at`,
    [userId, name || 'Travel Tour Guest', email, phoneValue, hashed],
  );

  await linkProviderToUser(userId, provider, providerId);
  return rows[0];
}
