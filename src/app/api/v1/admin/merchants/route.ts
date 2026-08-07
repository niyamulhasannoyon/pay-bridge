import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('paybridge_session')?.value;
  if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const payload = await verifyJwtToken(token);
  if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN')) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  const merchants = await prisma.merchant.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          role: true,
        },
      },
      _count: {
        select: {
          transactions: true,
          apiKeys: true,
        },
      },
    },
  });

  return NextResponse.json({ success: true, merchants });
}
