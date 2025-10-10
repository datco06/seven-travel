export function handleErrors(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(error);
      if (error && typeof error.status === 'number') {
        res.status(error.status).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Unexpected server error.' });
    }
  };
}

export function mapUser(row) {
  return {
    id: row.id,
    role: row.role,
    name: row.name,
    email: row.email,
    phone: row.phone,
    balance: Number(row.balance),
    createdAt: row.created_at,
  };
}
