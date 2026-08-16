import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/bcrypt';
import { generateToken } from '@/lib/jwt';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = generateToken(user.id);
  const response = NextResponse.json({ token, user: { id: user.id, email: user.email } });
  response.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 604800 });
  return response;
}
