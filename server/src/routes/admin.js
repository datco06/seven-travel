import { Router } from 'express';
import { body, validationResult, param } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import pool, { withTransaction } from '../utils/db.js';
import { requireRole } from '../middleware/auth.js';
import { handleErrors } from '../utils/responses.js';

const router = Router();

router.use(requireRole('admin'));

router.get(
  '/topups',
  handleErrors(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT tr.id, tr.user_id, tr.amount, tr.status, tr.created_at, tr.processed_at, u.name
       FROM topup_requests tr
       JOIN users u ON u.id = tr.user_id
       ORDER BY tr.created_at DESC`
    );
    res.json({
      topups: rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        customerName: row.name,
        amount: Number(row.amount),
        status: row.status,
        createdAt: row.created_at,
        processedAt: row.processed_at,
      })),
    });
  })
);

router.post(
  '/topups/:id/approve',
  [param('id').isUUID()],
  handleErrors(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const timestamp = new Date();

    const updated = await withTransaction(async (client) => {
      const { rows } = await client.query(
        'SELECT user_id, amount, status FROM topup_requests WHERE id = $1 FOR UPDATE',
        [id],
      );
      if (rows.length === 0) {
        throw { status: 404, message: 'Top-up request not found.' };
      }
      const request = rows[0];
      if (request.status !== 'pending') {
        throw { status: 400, message: 'Request already processed.' };
      }

      await client.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [request.amount, request.user_id]);
      await client.query('UPDATE topup_requests SET status = $1, processed_at = $2 WHERE id = $3', ['approved', timestamp, id]);
      await client.query('UPDATE transactions SET status = $1 WHERE id = $2', ['completed', id]);
      return { userId: request.user_id, amount: Number(request.amount) };
    });

    res.json({ message: 'Top-up approved.', ...updated, processedAt: timestamp.toISOString() });
  })
);

router.post(
  '/topups/:id/reject',
  [param('id').isUUID()],
  handleErrors(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const timestamp = new Date();

    const updated = await withTransaction(async (client) => {
      const { rows } = await client.query(
        'SELECT user_id, status FROM topup_requests WHERE id = $1 FOR UPDATE',
        [id],
      );
      if (rows.length === 0) {
        throw { status: 404, message: 'Top-up request not found.' };
      }
      const request = rows[0];
      if (request.status !== 'pending') {
        throw { status: 400, message: 'Request already processed.' };
      }

      await client.query('UPDATE topup_requests SET status = $1, processed_at = $2 WHERE id = $3', ['rejected', timestamp, id]);
      await client.query('UPDATE transactions SET status = $1 WHERE id = $2', ['rejected', id]);
      return { userId: request.user_id };
    });

    res.json({ message: 'Top-up rejected.', ...updated, processedAt: timestamp.toISOString() });
  })
);

router.get(
  '/bookings',
  handleErrors(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT b.id, b.user_id, u.name AS customer_name, p.name AS product_name, p.category, b.amount, b.created_at
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       JOIN products p ON p.id = b.product_id
       ORDER BY b.created_at DESC`
    );

    res.json({
      bookings: rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        customerName: row.customer_name,
        productName: row.product_name,
        category: row.category,
        amount: Number(row.amount),
        createdAt: row.created_at,
      })),
    });
  })
);

export default router;
