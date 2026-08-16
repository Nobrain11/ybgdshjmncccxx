import Redis from 'ioredis';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn('⚠️ REDIS_URL not set – Redis features disabled');
    return null;
  }
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL);
  }
  return redisClient;
}

export const redis = getRedisClient();
