import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import pool, { withTransaction } from '../utils/db.js';
import { handleErrors } from '../utils/responses.js';

const router = Router();

router.post(
  '/bookings',
  [
    body('productId').isUUID().withMessage('Valid productId is required.'),
    body('category').isIn(['tour', 'transport', 'stay']).withMessage('Invalid category.'),
  ],
  handleErrors(async (req, res) => {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can book services.' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, category } = req.body;
    const { rows: productRows } = await pool.query(
      'SELECT id, name, price FROM products WHERE id = $1 AND category = $2',
      [productId, category],
    );
    if (productRows.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const product = productRows[0];

    const bookingId = uuidv4();
    const timestamp = new Date();

    await withTransaction(async (client) => {
      const { rows: userRows } = await client.query('SELECT balance FROM users WHERE id = $1 FOR UPDATE', [req.user.id]);
      const balance = Number(userRows[0].balance);
      if (balance < product.price) {
        throw new Error('INSUFFICIENT_FUNDS');
      }

      await client.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [product.price, req.user.id]);
      await client.query(
        `INSERT INTO bookings (id, user_id, product_id, amount, created_at)
         VALUES ($1, $2, $3, $4, $5)`
        , [bookingId, req.user.id, product.id, product.price, timestamp],
      );
      await client.query(
        `INSERT INTO transactions (id, user_id, type, status, category, reference_id, amount, created_at)
         VALUES ($1, $2, 'payment', 'completed', $3, $4, $5, $6)`
        , [bookingId, req.user.id, category, product.id, product.price, timestamp],
      );
    }).catch((error) => {
      if (error.message === 'INSUFFICIENT_FUNDS') {
        throw { status: 400, message: 'Insufficient balance. Please top up your wallet.' };
      }
      throw error;
    });

    res.status(201).json({
      id: bookingId,
      productId: product.id,
      amount: Number(product.price),
      createdAt: timestamp.toISOString(),
    });
  })
);

router.get(
  '/bookings',
  handleErrors(async (req, res) => {
    const baseQuery = `
      SELECT b.id, b.product_id, b.amount, b.created_at, p.name, p.category
      FROM bookings b
      JOIN products p ON p.id = b.product_id
    `;

    const params = [];
    let whereClause = '';

    if (req.user.role === 'customer') {
      whereClause = 'WHERE b.user_id = $1';
      params.push(req.user.id);
    }

    const orderClause = ' ORDER BY b.created_at DESC';
    const { rows } = await pool.query(baseQuery + whereClause + orderClause, params);
    res.json({
      bookings: rows.map((row) => ({
        id: row.id,
        productId: row.product_id,
        productName: row.name,
        category: row.category,
        amount: Number(row.amount),
        createdAt: row.created_at,
      })),
    });
  })
);

export default router;
