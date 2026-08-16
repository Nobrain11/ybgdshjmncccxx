import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

function getUserId(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const token = cookie.split('; ').find((row) => row.startsWith('token='))?.split('=')[1];
  return token ? verifyToken(token)?.userId : null;
}

export async function GET(req: Request) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const orders = await prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 12 });
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.tokenAddress || !body?.side || !body?.amount) {
    return NextResponse.json({ error: 'Missing execution details' }, { status: 400 });
  }
  const order = await prisma.order.create({
    data: {
      userId,
      tokenAddress: body.tokenAddress,
      type: 'MARKET',
      side: body.side === 'SELL' ? 'SELL' : 'BUY',
      price: Number(body.price || 0),
      amount: Number(body.amount),
      status: body.status || 'OPEN',
    },
  });
  return NextResponse.json({ order }, { status: 201 });
}
