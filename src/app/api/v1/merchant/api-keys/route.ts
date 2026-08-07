import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db/prisma';
import { generateApiKeyPair } from '@/lib/security/crypto';

async function getMerchantIdFromSession(req: NextRequest) {
  const token = req.cookies.get('paybridge_session')?.value;
  if (!token) return null;
  const payload = await verifyJwtToken(token);
  return payload?.merchantId || null;
}

export async function GET(req: NextRequest) {
  const merchantId = await getMerchantIdFromSession(req);
  if (!merchantId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const keys = await prisma.apiKey.findMany({
    where: { merchantId },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      mode: true,
      isRevoked: true,
      lastUsedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, keys });
}

export async function POST(req: NextRequest) {
  const merchantId = await getMerchantIdFromSession(req);
  if (!merchantId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { name, mode } = await req.json();

  if (!name) {
    return NextResponse.json({ success: false, error: 'Key name is required' }, { status: 400 });
  }

  const keyMode = mode === 'LIVE' ? 'LIVE' : 'SANDBOX';
  const keyPair = generateApiKeyPair(keyMode);

  const newKey = await prisma.apiKey.create({
    data: {
      merchantId,
      name,
      keyPrefix: keyPair.keyPrefix,
      keyHash: keyPair.keyHash,
      mode: keyMode,
    },
  });

  return NextResponse.json({
    success: true,
    key: {
      id: newKey.id,
      name: newKey.name,
      keyPrefix: newKey.keyPrefix,
      mode: newKey.mode,
      createdAt: newKey.createdAt,
    },
    rawApiKey: keyPair.rawKey, // Returned ONLY ONCE
  });
}

export async function DELETE(req: NextRequest) {
  const merchantId = await getMerchantIdFromSession(req);
  if (!merchantId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const keyId = url.searchParams.get('id');

  if (!keyId) {
    return NextResponse.json({ success: false, error: 'Key ID required' }, { status: 400 });
  }

  await prisma.apiKey.updateMany({
    where: { id: keyId, merchantId },
    data: { isRevoked: true },
  });

  return NextResponse.json({ success: true, message: 'Key revoked successfully' });
}
