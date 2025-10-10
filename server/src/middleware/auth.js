import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import pool from '../utils/db.js';

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { rows } = await pool.query('SELECT id, role, name, email, phone, balance FROM users WHERE id = $1', [payload.sub]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'User not found.' });
    }
    req.user = rows[0];
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    return next();
  };
}
