import { NextResponse } from 'next/server';
import { searchTokens } from '@/services/market';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  if (!q) return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  try {
    const results = await searchTokens(q);
    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
