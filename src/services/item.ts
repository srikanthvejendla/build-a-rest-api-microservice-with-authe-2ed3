import prisma from '../lib/prisma';

export async function createItem(ownerId: string, name: string, description?: string) {
  return prisma.item.create({
    data: { name, description, ownerId },
  });
}

export async function getItems(ownerId: string) {
  return prisma.item.findMany({ where: { ownerId } });
}

export async function getItemById(ownerId: string, id: string) {
  return prisma.item.findFirst({ where: { id, ownerId } });
}

export async function updateItem(ownerId: string, id: string, data: { name?: string; description?: string }) {
  return prisma.item.updateMany({
    where: { id, ownerId },
    data,
  });
}

export async function deleteItem(ownerId: string, id: string) {
  return prisma.item.deleteMany({ where: { id, ownerId } });
}
