import express from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { findUserById } from '../services/user';

const router = express.Router();

router.get('/me', authenticateJWT, async (req: AuthRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const user = await findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.status(200).json({ id: user.id, email: user.email, createdAt: user.createdAt });
});

export default router;
