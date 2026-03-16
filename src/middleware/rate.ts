import { Request, Response, NextFunction } from 'express';
import redis from '../lib/redis';

const globalLimit = parseInt(process.env.RATE_LIMIT_GLOBAL || '100', 10);
const globalWindow = parseInt(process.env.RATE_LIMIT_GLOBAL_WINDOW || '900', 10); // 15 min
const userLimit = parseInt(process.env.RATE_LIMIT_USER || '1000', 10);
const userWindow = parseInt(process.env.RATE_LIMIT_USER_WINDOW || '3600', 10); // 1 hour

export async function globalRateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip;
  const key = `rate:ip:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, globalWindow);
  if (count > globalLimit) {
    return res.status(429).json({ error: 'Too many requests (global)' });
  }
  next();
}

export async function userRateLimit(req: Request, res: Response, next: NextFunction) {
  // Only apply if authenticated
  // @ts-ignore
  const userId = req.user?.id;
  if (!userId) return next();
  const key = `rate:user:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, userWindow);
  if (count > userLimit) {
    return res.status(429).json({ error: 'Too many requests (user)' });
  }
  next();
}
