import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/bcrypt';
import { generateToken } from '@/lib/jwt';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: 'Email already used' }, { status: 400 });
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash: hashed } });
  const token = generateToken(user.id);
  const response = NextResponse.json({ token, user: { id: user.id, email: user.email } });
  response.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 604800 });
  return response;
}
