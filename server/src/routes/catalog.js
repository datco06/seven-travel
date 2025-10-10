import { Router } from 'express';
import pool from '../utils/db.js';
import { handleErrors } from '../utils/responses.js';

const router = Router();

router.get(
  '/:category',
  handleErrors(async (req, res) => {
    const { category } = req.params;
    if (!['tour', 'transport', 'stay'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category.' });
    }

    const { rows } = await pool.query(
      `SELECT id, name, price, description, duration
       FROM products
       WHERE category = $1
       ORDER BY created_at DESC`,
      [category],
    );

    res.json({
      items: rows.map((row) => ({
        id: row.id,
        name: row.name,
        price: Number(row.price),
        description: row.description,
        duration: row.duration,
      })),
    });
  })
);

export default router;
