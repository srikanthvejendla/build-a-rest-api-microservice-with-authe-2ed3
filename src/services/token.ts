import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/prisma';
import { JwtPayload } from '../types';

const privateKeyPath: string = process.env.JWT_PRIVATE_KEY_PATH || './keys/jwtRS256.key';
const publicKeyPath: string = process.env.JWT_PUBLIC_KEY_PATH || './keys/jwtRS256.key.pub';
const privateKey: string = fs.readFileSync(path.resolve(privateKeyPath), 'utf8');
const publicKey: string = fs.readFileSync(path.resolve(publicKeyPath), 'utf8');

export function signAccessToken(user: { id: string; email: string }) {
  const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  return jwt.sign(
    { sub: user.id, email: user.email },
    privateKey,
    { algorithm: 'RS256', expiresIn: accessExpiresIn } as jwt.SignOptions
  );
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
}

export async function createRefreshToken(userId: string) {
  const token = uuidv4() + uuidv4();
  const expiresAt = new Date(Date.now() + parseRefreshExpiresMs());
  const refreshToken = await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
  return refreshToken.token;
}

export async function verifyRefreshToken(token: string) {
  const found = await prisma.refreshToken.findUnique({ where: { token } });
  if (!found || found.revoked || found.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }
  return found;
}

export async function revokeRefreshToken(token: string) {
  await prisma.refreshToken.updateMany({ where: { token }, data: { revoked: true } });
}

function parseRefreshExpiresMs(): number {
  // e.g. '7d' => ms
  const val = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  if (val.endsWith('d')) return parseInt(val) * 24 * 60 * 60 * 1000;
  if (val.endsWith('h')) return parseInt(val) * 60 * 60 * 1000;
  if (val.endsWith('m')) return parseInt(val) * 60 * 1000;
  return 7 * 24 * 60 * 60 * 1000; // default 7d
}
