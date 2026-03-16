import request from 'supertest';
import app from '../src/index';
import prisma from '../src/lib/prisma';

describe('User API', () => {
  const email = `userapi${Date.now()}@test.com`;
  const password = 'TestPassword123!';
  let accessToken: string;

  beforeAll(async () => {
    await request(app).post('/auth/register').send({ email, password });
    const login = await request(app).post('/auth/login').send({ email, password });
    accessToken = login.body.accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  });

  it('gets current user info', async () => {
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', email);
    expect(res.body).toHaveProperty('createdAt');
  });
});
