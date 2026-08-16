import { NextResponse } from 'next/server';
import { scanContract } from '@/services/scanner';

export async function POST(req: Request) {
  const { address } = await req.json();
  try {
    const result = await scanContract(address);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
