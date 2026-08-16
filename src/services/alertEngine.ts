import { Queue } from 'bullmq';
import { redis } from '@/lib/redis';

export const alertQueue = new Queue('alerts', { connection: redis });
export const orderQueue = new Queue('orders', { connection: redis });

export async function scheduleAlert(alertId: string) {
  await alertQueue.add('check', { alertId }, { repeat: { every: 10000 } });
}
