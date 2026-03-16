import request from 'supertest';
import app from '../src/index';
import prisma from '../src/lib/prisma';

describe('Auth API', () => {
  const email = `user${Date.now()}@test.com`;
  const password = 'TestPassword123!';
  let refreshToken: string;
  let accessToken: string;

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  });

  it('registers a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email, password });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', email);
  });

  it('logs in the user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('refreshes the JWT', async () => {
    const res = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('logs out (revokes refresh token)', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .send({ refreshToken });
    expect(res.status).toBe(204);
  });
});
