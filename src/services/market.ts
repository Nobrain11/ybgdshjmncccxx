import { redis } from '@/lib/redis';
import { prisma } from '@/lib/prisma';

const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex';

export async function getTokenData(address: string) {
  let cached = null;
  if (redis) {
    cached = await redis.get(`token:${address}`);
    if (cached) return JSON.parse(cached);
  }

  const res = await fetch(`${DEXSCREENER_API}/tokens/${address}`);
  if (!res.ok) throw new Error('Token not found');
  const data = await res.json();
  const pair = data.pairs?.find((p: any) => p.chainId === 'robinhood');
  if (!pair) throw new Error('No Robinhood pair found');

  if (redis) {
    await redis.setex(`token:${address}`, 15, JSON.stringify(pair));
  }

  await prisma.tokenCache.upsert({
    where: { address },
    update: { data: pair, updatedAt: new Date() },
    create: { address, data: pair },
  });

  return pair;
}

export async function searchTokens(query: string) {
  const res = await fetch(`${DEXSCREENER_API}/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.pairs?.filter((p: any) => p.chainId === 'robinhood') || [];
}

export async function getTrending() {
  const res = await fetch(`${DEXSCREENER_API}/search?q=ETH`);
  const data = await res.json();
  const pairs = data.pairs?.filter((p: any) => p.chainId === 'robinhood') || [];
  return pairs.slice(0, 20);
}
