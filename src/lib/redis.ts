import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = createClient({ url: redisUrl });

redis.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Redis Client Error', err);
});

redis.connect();

export default redis;
