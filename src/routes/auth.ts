import express from 'express';
import { z } from 'zod';
import { createUser, findUserByEmail, verifyPassword } from '../services/user';
import { signAccessToken, createRefreshToken, verifyRefreshToken, revokeRefreshToken } from '../services/token';

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const { email, password } = parsed.data;
  const existing = await findUserByEmail(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const user = await createUser(email, password);
  return res.status(201).json(user);
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const { email, password } = parsed.data;
  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const accessToken = signAccessToken({ id: user.id, email: user.email });
  const refreshToken = await createRefreshToken(user.id);
  return res.status(200).json({ accessToken, refreshToken });
});

router.post('/refresh', async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  try {
    const token = await verifyRefreshToken(parsed.data.refreshToken);
    const user = await findUserByEmail(token.userId);
    if (!user) return res.status(401).json({ error: 'Invalid refresh token' });
    const accessToken = signAccessToken({ id: user.id, email: user.email });
    return res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  await revokeRefreshToken(parsed.data.refreshToken);
  return res.status(204).send();
});

export default router;
