import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('paybridge_session')?.value;

  if (!token) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  const payload = await verifyJwtToken(token);
  if (!payload) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { merchant: true },
  });

  if (!user) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    merchant: user.merchant,
  });
}
