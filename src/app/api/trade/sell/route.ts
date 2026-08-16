import { NextResponse } from 'next/server';
import { executeTrade } from '@/services/trading';
import { getWallet } from '@/services/wallet';
import { verifyToken } from '@/lib/jwt';

export async function POST(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const token = cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  const { token: tokenAddress, amount } = await req.json();
  const wallet = await getWallet(payload.userId);
  if (!wallet) return NextResponse.json({ error: 'No wallet' }, { status: 400 });
  try {
    const tx = await executeTrade(tokenAddress, amount, false, wallet.privateKey);
    return NextResponse.json({ txHash: tx.hash });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
