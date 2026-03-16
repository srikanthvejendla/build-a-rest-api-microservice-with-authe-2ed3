import request from 'supertest';
import app from '../src/index';
import prisma from '../src/lib/prisma';

describe('Item API', () => {
  const email = `itemuser${Date.now()}@test.com`;
  const password = 'TestPassword123!';
  let accessToken: string;
  let itemId: string;

  beforeAll(async () => {
    await request(app).post('/auth/register').send({ email, password });
    const login = await request(app).post('/auth/login').send({ email, password });
    accessToken = login.body.accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  });

  it('creates an item', async () => {
    const res = await request(app)
      .post('/items')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Test Item', description: 'A test item' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    itemId = res.body.id;
  });

  it('lists items', async () => {
    const res = await request(app)
      .get('/items')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('gets an item by id', async () => {
    const res = await request(app)
      .get(`/items/${itemId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', itemId);
  });

  it('updates an item', async () => {
    const res = await request(app)
      .put(`/items/${itemId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Updated Item' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Item');
  });

  it('deletes an item', async () => {
    const res = await request(app)
      .delete(`/items/${itemId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(204);
  });
});
