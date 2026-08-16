import { NextResponse } from 'next/server';
import { getTrending } from '@/services/market';

export async function GET() {
  try {
    const tokens = await getTrending();
    return NextResponse.json(tokens);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch trending' }, { status: 500 });
  }
}
