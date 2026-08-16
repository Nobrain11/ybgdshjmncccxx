import { getRedisClient } from '@/lib/redis';

const redis = getRedisClient();

if (redis) {
  import('./alertProcessor');
  import('./orderProcessor');
  console.log('🚀 Workers started');
} else {
  console.log('⚠️ Redis not available – workers not started');
}
