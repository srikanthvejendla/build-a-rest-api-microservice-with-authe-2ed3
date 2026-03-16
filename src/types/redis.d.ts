import { RedisClientType } from 'redis';
declare global {
  var redis: RedisClientType | undefined;
}
