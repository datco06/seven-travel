import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../utils/db.js';
import { JWT_SECRET } from '../config.js';
import { authenticate } from '../middleware/auth.js';
import { handleErrors, mapUser } from '../utils/responses.js';

const router = Router();

const registerValidator = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required.'),
  body('phone').trim().isLength({ min: 6 }).withMessage('Phone is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
];

router.post(
  '/register',
  registerValidator,
  handleErrors(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const { rows: existing } = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const insertQuery = `
      INSERT INTO users (id, role, name, email, phone, password_hash)
      VALUES ($1, 'customer', $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await pool.query(insertQuery, [id, name, normalizedEmail, phone, hashed]);
    const user = mapUser(rows[0]);

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ token, user });
  })
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  handleErrors(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const userRow = rows[0];
    const valid = await bcrypt.compare(password, userRow.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = mapUser(userRow);
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  })
);

router.get(
  '/me',
  authenticate,
  handleErrors(async (req, res) => {
    res.json({ user: req.user });
  })
);

export default router;
