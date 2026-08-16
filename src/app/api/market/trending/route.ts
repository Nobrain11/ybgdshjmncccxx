import { NextResponse } from 'next/server';
import { getTrending } from '@/services/market';

export async function GET() {
  try {
    const tokens = await getTrending();
    return NextResponse.json(tokens);
  } catch (error) {
    console.error('[v0] Trending market request failed:', error);
    return NextResponse.json({ error: 'Unable to load market data' }, { status: 502 });
  }
}
