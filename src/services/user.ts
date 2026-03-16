import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

const SALT_ROUNDS = 12;

export async function createUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
