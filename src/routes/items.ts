import express from 'express';
import { z } from 'zod';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { createItem, getItems, getItemById, updateItem, deleteItem } from '../services/item';

const router = express.Router();

const itemCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const itemUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

router.post('/', authenticateJWT, async (req: AuthRequest, res) => {
  const parsed = itemCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const item = await createItem(req.user!.id, parsed.data.name, parsed.data.description);
  return res.status(201).json(item);
});

router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  const items = await getItems(req.user!.id);
  return res.status(200).json(items);
});

router.get('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  const item = await getItemById(req.user!.id, req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  return res.status(200).json(item);
});

router.put('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  const parsed = itemUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const updated = await updateItem(req.user!.id, req.params.id, parsed.data);
  if (updated.count === 0) return res.status(404).json({ error: 'Item not found' });
  const item = await getItemById(req.user!.id, req.params.id);
  return res.status(200).json(item);
});

router.delete('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  const deleted = await deleteItem(req.user!.id, req.params.id);
  if (deleted.count === 0) return res.status(404).json({ error: 'Item not found' });
  return res.status(204).send();
});

export default router;
