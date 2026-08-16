import { NextResponse } from 'next/server';
import { createWallet } from '@/services/wallet';
import { verifyToken } from '@/lib/jwt';

export async function POST(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const token = cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  try {
    const { address } = await createWallet(payload.userId);
    return NextResponse.json({ address });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
