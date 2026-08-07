import { NextRequest } from 'next/server';
import { prisma } from '../db/prisma';
import { hashApiKey } from '../security/crypto';

export interface ValidatedMerchantContext {
  merchantId: string;
  businessName: string;
  slug: string;
  feePercentage: number;
  fixedFee: number;
  mode: 'SANDBOX' | 'LIVE';
  webhookSecret: string;
}

/**
 * Validate merchant API key sent in x-api-key header or Authorization Bearer header
 */
export async function authenticateMerchantApiRequest(req: NextRequest): Promise<ValidatedMerchantContext> {
  const apiKeyHeader = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '').trim();

  if (!apiKeyHeader) {
    throw new Error('API Key missing. Provide x-api-key header.');
  }

  const keyHash = hashApiKey(apiKeyHeader);

  const keyRecord = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: { merchant: true },
  });

  if (!keyRecord || keyRecord.isRevoked) {
    throw new Error('Invalid or revoked API Key.');
  }

  if (keyRecord.merchant.status === 'SUSPENDED') {
    throw new Error('Merchant account is suspended. Contact support.');
  }

  // Asynchronously update last used timestamp
  prisma.apiKey.update({
    where: { id: keyRecord.id },
    data: { lastUsedAt: new Date() },
  }).catch(() => {});

  return {
    merchantId: keyRecord.merchant.id,
    businessName: keyRecord.merchant.businessName,
    slug: keyRecord.merchant.slug,
    feePercentage: Number(keyRecord.merchant.feePercentage),
    fixedFee: Number(keyRecord.merchant.fixedFee),
    mode: keyRecord.mode,
    webhookSecret: keyRecord.merchant.webhookSecret,
  };
}
