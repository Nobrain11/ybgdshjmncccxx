import { Worker } from 'bullmq';
import { redis } from '@/lib/redis';
import { prisma } from '@/lib/prisma';
import { getTokenData } from '@/services/market';
import { getWallet } from '@/services/wallet';
import { executeTrade } from '@/services/trading';

const orderWorker = new Worker('orders', async job => {
  const order = await prisma.order.findUnique({ where: { id: job.data.orderId } });
  if (!order || order.status !== 'OPEN') return;
  try {
    const tokenData = await getTokenData(order.tokenAddress);
    const currentPrice = parseFloat(tokenData.priceUsd);
    let shouldExecute = false;
    if (order.type === 'LIMIT_BUY' && currentPrice <= order.price) shouldExecute = true;
    if (order.type === 'LIMIT_SELL' && currentPrice >= order.price) shouldExecute = true;
    if (shouldExecute) {
      const wallet = await getWallet(order.userId);
      if (!wallet) throw new Error('Wallet not found');
      const isBuy = order.side === 'BUY';
      const amount = order.amount.toString();
      const tx = await executeTrade(order.tokenAddress, amount, isBuy, wallet.privateKey);
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FILLED', executedAt: new Date(), filledAmount: order.amount },
      });
      console.log(`Order ${order.id} executed: ${tx.hash}`);
    }
  } catch (e) {
    console.error('Order execution error:', e);
  }
}, { connection: redis });

export default orderWorker;
