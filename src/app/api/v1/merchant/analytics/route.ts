import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('paybridge_session')?.value;
  if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  
  const payload = await verifyJwtToken(token);
  if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const isSuperAdmin = payload.role === 'SUPER_ADMIN' || payload.role === 'ADMIN';
  const merchantId = payload.merchantId;

  const whereClause = isSuperAdmin ? {} : { merchantId: merchantId || 'NONE' };

  const [totalCount, completedCount, volumeAggregate, transactions] = await Promise.all([
    prisma.transaction.count({ where: whereClause }),
    prisma.transaction.count({ where: { ...whereClause, status: 'COMPLETED' } }),
    prisma.transaction.aggregate({
      where: { ...whereClause, status: 'COMPLETED' },
      _sum: {
        amount: true,
        feeAmount: true,
        netAmount: true,
      },
    }),
    prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 25,
      include: {
        merchant: { select: { businessName: true } },
      },
    }),
  ]);

  const totalVolume = Number(volumeAggregate._sum.amount || 0);
  const totalFees = Number(volumeAggregate._sum.feeAmount || 0);
  const totalNet = Number(volumeAggregate._sum.netAmount || 0);
  const successRate = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : '100.0';

  return NextResponse.json({
    success: true,
    stats: {
      totalVolume,
      totalFees,
      totalNet,
      totalCount,
      completedCount,
      successRate: Number(successRate),
    },
    transactions,
  });
}
