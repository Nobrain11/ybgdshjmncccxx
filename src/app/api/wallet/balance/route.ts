import { NextResponse } from 'next/server';
import { getWallet, getBalance } from '@/services/wallet';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const token = cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  const wallet = await getWallet(payload.userId);
  if (!wallet) return NextResponse.json({ error: 'No wallet' }, { status: 400 });
  const balance = await getBalance(wallet.address);
  return NextResponse.json({ eth: balance });
}
