import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { scheduleAlert } from '@/services/alertEngine';

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const token = cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  const alerts = await prisma.alert.findMany({ where: { userId: payload.userId } });
  return NextResponse.json(alerts);
}

export async function POST(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const token = cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  const { tokenAddress, type, triggerValue } = await req.json();
  const alert = await prisma.alert.create({
    data: {
      userId: payload.userId,
      tokenAddress,
      type,
      triggerValue,
    },
  });
  await scheduleAlert(alert.id);
  return NextResponse.json(alert);
}
