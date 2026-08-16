import { Queue } from 'bullmq';
import { getRedisClient } from '@/lib/redis';

const redis = getRedisClient();

export const alertQueue = redis ? new Queue('alerts', { connection: redis }) : null;
export const orderQueue = redis ? new Queue('orders', { connection: redis }) : null;

export async function scheduleAlert(alertId: string) {
  if (!alertQueue) {
    console.warn('⚠️ Redis not available – alert scheduling skipped');
    return;
  }
  await alertQueue.add('check', { alertId }, { repeat: { every: 10000 } });
}
