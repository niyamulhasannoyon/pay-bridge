import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db/prisma';
import crypto from 'crypto';
import { dispatchWebhook } from '@/lib/webhooks/dispatcher';

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

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { webhookUrl: true, webhookSecret: true },
  });

  const logs = await prisma.webhookLog.findMany({
    where: { merchantId },
    orderBy: { createdAt: 'desc' },
    take: 30,
    include: {
      transaction: {
        select: { transactionId: true, merchantInvoiceNo: true, amount: true },
      },
    },
  });

  return NextResponse.json({
    success: true,
    webhookUrl: merchant?.webhookUrl || '',
    webhookSecret: merchant?.webhookSecret || '',
    logs,
  });
}

export async function POST(req: NextRequest) {
  const merchantId = await getMerchantIdFromSession(req);
  if (!merchantId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { webhookUrl, regenerateSecret } = await req.json();

  const updateData: { webhookUrl?: string; webhookSecret?: string } = {};
  if (webhookUrl !== undefined) updateData.webhookUrl = webhookUrl;
  if (regenerateSecret) updateData.webhookSecret = `whsec_${crypto.randomBytes(24).toString('hex')}`;

  const updatedMerchant = await prisma.merchant.update({
    where: { id: merchantId },
    data: updateData,
  });

  return NextResponse.json({
    success: true,
    webhookUrl: updatedMerchant.webhookUrl,
    webhookSecret: updatedMerchant.webhookSecret,
  });
}

/**
 * Webhook Test Simulator: Dispatch dummy test payload to merchant's endpoint
 */
export async function PUT(req: NextRequest) {
  const merchantId = await getMerchantIdFromSession(req);
  if (!merchantId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const dummyTrx = await prisma.transaction.findFirst({
    where: { merchantId },
    orderBy: { createdAt: 'desc' },
  });

  const transactionId = dummyTrx ? dummyTrx.transactionId : `TRX-SIM-TEST`;
  const result = await dispatchWebhook(merchantId, transactionId, 'payment.completed', {
    transactionId,
    merchantInvoiceNo: dummyTrx ? dummyTrx.merchantInvoiceNo : 'SIM-INV-001',
    amount: dummyTrx ? Number(dummyTrx.amount) : 100.00,
    currency: 'BDT',
    status: 'COMPLETED',
    bkashTrxID: 'BKASH_TEST_TRX_999',
    customerMobile: '01711223344',
  });

  return NextResponse.json({
    success: true,
    dispatchResult: result,
  });
}
