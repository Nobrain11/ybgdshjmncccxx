import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

function getUserId(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const token = cookie.split('; ').find((row) => row.startsWith('token='))?.split('=')[1];
  return token ? verifyToken(token)?.userId : null;
}

export async function POST(req: Request) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const address = typeof body?.address === 'string' ? body.address.trim() : '';
  const chainId = typeof body?.chainId === 'string' ? body.chainId : null;
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
  }

  const existing = await prisma.wallet.findUnique({ where: { address } });
  if (existing && existing.userId !== userId) {
    return NextResponse.json({ error: 'Wallet is already linked to another account' }, { status: 409 });
  }
  const wallet = existing
    ? await prisma.wallet.update({ where: { id: existing.id }, data: { isDefault: true, encryptedKey: null } })
    : await prisma.wallet.create({ data: { userId, address, isDefault: true, encryptedKey: null } });

  await prisma.wallet.updateMany({
    where: { userId, id: { not: wallet.id } },
    data: { isDefault: false },
  });

  return NextResponse.json({ address: wallet.address, chainId, connected: true });
}

export async function DELETE(req: Request) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.wallet.updateMany({ where: { userId }, data: { isDefault: false } });
  return NextResponse.json({ connected: false });
}
