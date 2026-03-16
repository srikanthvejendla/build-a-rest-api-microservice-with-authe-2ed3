import request from 'supertest';
import app from '../src/index';

describe('Rate Limiting', () => {
  it('enforces global rate limit', async () => {
    const promises = [];
    for (let i = 0; i < 105; i++) {
      promises.push(request(app).get('/users/me'));
    }
    const results = await Promise.all(promises);
    const limited = results.filter(r => r.status === 429);
    expect(limited.length).toBeGreaterThan(0);
  });
});
