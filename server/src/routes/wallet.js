import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import pool, { withTransaction } from '../utils/db.js';
import { handleErrors } from '../utils/responses.js';

const router = Router();

router.post(
  '/topups',
  [body('amount').isInt({ gt: 0 }).withMessage('Amount must be greater than 0.')],
  handleErrors(async (req, res) => {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can request top-ups.' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount } = req.body;
    const id = uuidv4();
    const timestamp = new Date();

    await withTransaction(async (client) => {
      await client.query(
        `INSERT INTO topup_requests (id, user_id, amount, status, created_at)
         VALUES ($1, $2, $3, 'pending', $4)`
        , [id, req.user.id, amount, timestamp],
      );
      await client.query(
        `INSERT INTO transactions (id, user_id, type, status, amount, created_at)
         VALUES ($1, $2, 'topup', 'pending', $3, $4)`
        , [id, req.user.id, amount, timestamp],
      );
    });

    res.status(201).json({ id, amount, status: 'pending', createdAt: timestamp.toISOString() });
  })
);

router.get(
  '/transactions',
  handleErrors(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT id, type, status, amount, category, reference_id, created_at
       FROM transactions
       WHERE user_id = $1
       ORDER BY created_at DESC`
      , [req.user.id],
    );
    res.json({ transactions: rows.map((row) => ({
      id: row.id,
      type: row.type,
      status: row.status,
      category: row.category,
      referenceId: row.reference_id,
      amount: Number(row.amount),
      createdAt: row.created_at,
    })) });
  })
);

export default router;
