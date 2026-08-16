import { Worker } from 'bullmq';
import { redis } from '@/lib/redis';
import { prisma } from '@/lib/prisma';
import { getTokenData } from '@/services/market';

const alertWorker = new Worker('alerts', async job => {
  const alert = await prisma.alert.findUnique({ where: { id: job.data.alertId } });
  if (!alert || !alert.active) return;
  try {
    const token = await getTokenData(alert.tokenAddress);
    const price = parseFloat(token.priceUsd);
    let triggered = false;
    if (alert.type === 'PRICE_ABOVE' && price >= alert.triggerValue) triggered = true;
    if (alert.type === 'PRICE_BELOW' && price <= alert.triggerValue) triggered = true;
    if (triggered) {
      await prisma.alert.update({
        where: { id: alert.id },
        data: { triggeredAt: new Date(), active: false },
      });
      // Optionally send email here
      console.log(`Alert triggered for user ${alert.userId}: ${alert.tokenAddress} at $${price}`);
    }
  } catch (e) {
    console.error('Alert check error:', e);
  }
}, { connection: redis });

export default alertWorker;
