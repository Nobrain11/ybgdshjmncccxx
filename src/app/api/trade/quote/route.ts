import { NextResponse } from 'next/server';
import { getQuote } from '@/services/trading';

export async function POST(req: Request) {
  const { token, amount } = await req.json();
  try {
    const quote = await getQuote(token, amount, true);
    return NextResponse.json(quote);
  } catch (e) {
    return NextResponse.json({ error: 'Quote failed' }, { status: 500 });
  }
}
