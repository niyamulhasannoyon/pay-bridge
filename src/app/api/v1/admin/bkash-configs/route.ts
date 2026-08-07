import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db/prisma';
import { encrypt } from '@/lib/security/crypto';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('paybridge_session')?.value;
  if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const payload = await verifyJwtToken(token);
  if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN')) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  const configs = await prisma.bkashConfig.findMany({
    orderBy: { createdAt: 'desc' },
    include: { merchant: { select: { businessName: true } } },
  });

  // Strip sensitive encrypted keys from view, return metadata
  const safeConfigs = configs.map((c) => ({
    id: c.id,
    mode: c.mode,
    isSystemDefault: c.isSystemDefault,
    appKey: c.appKey,
    merchantName: c.merchant?.businessName || 'System Default Account',
    isActive: c.isActive,
    createdAt: c.createdAt,
  }));

  return NextResponse.json({ success: true, configs: safeConfigs });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('paybridge_session')?.value;
  if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const payload = await verifyJwtToken(token);
  if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN')) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  const { appKey, appSecret, username, password, mode, isSystemDefault, merchantId } = await req.json();

  if (!appKey || !appSecret || !username || !password) {
    return NextResponse.json({ success: false, error: 'All bKash credentials fields are required.' }, { status: 400 });
  }

  // Encrypt secrets with AES-256-GCM
  const encSecret = encrypt(appSecret);
  const encUser = encrypt(username);
  const encPass = encrypt(password);

  const configMode = mode === 'LIVE' ? 'LIVE' : 'SANDBOX';

  // If system default, deactivate previous default for that mode
  if (isSystemDefault) {
    await prisma.bkashConfig.updateMany({
      where: { isSystemDefault: true, mode: configMode },
      data: { isActive: false },
    });
  }

  const newConfig = await prisma.bkashConfig.create({
    data: {
      merchantId: merchantId || null,
      mode: configMode,
      isSystemDefault: Boolean(isSystemDefault),
      appKey,
      appSecretEncrypted: encSecret.encrypted,
      usernameEncrypted: encUser.encrypted,
      passwordEncrypted: encPass.encrypted,
      iv: encSecret.iv,
      tag: encSecret.tag,
      isActive: true,
    },
  });

  return NextResponse.json({
    success: true,
    id: newConfig.id,
    appKey: newConfig.appKey,
    mode: newConfig.mode,
    isSystemDefault: newConfig.isSystemDefault,
  });
}
