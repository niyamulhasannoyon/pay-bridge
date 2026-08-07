import { NextRequest, NextResponse } from 'next/server';
import { authenticateMerchantApiRequest } from '@/lib/auth/merchant-auth';
import { createBkashPayment, getBkashCredentials } from '@/lib/bkash/bkash-service';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const merchantCtx = await authenticateMerchantApiRequest(req);
    const body = await req.json();

    const { amount, merchantInvoiceNumber, callbackUrl, cancelUrl, intent, metadata, payerReference } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid transaction amount.' }, { status: 400 });
    }

    if (!merchantInvoiceNumber || !callbackUrl) {
      return NextResponse.json({ success: false, error: 'merchantInvoiceNumber and callbackUrl are required.' }, { status: 400 });
    }

    const numAmount = Number(amount);
    const feeAmount = (numAmount * merchantCtx.feePercentage) / 100 + merchantCtx.fixedFee;
    const netAmount = Math.max(0, numAmount - feeAmount);

    const transactionId = `TRX-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // bKash internal callback URL points to PayBridge callback endpoint
    const internalCallbackUrl = `${baseUrl}/api/v1/callbacks/bkash?trx=${transactionId}`;

    const bkashCreds = await getBkashCredentials(merchantCtx.merchantId, merchantCtx.mode);

    const bkashResponse = await createBkashPayment(bkashCreds, {
      amount: numAmount.toFixed(2),
      merchantInvoiceNumber,
      callbackURL: internalCallbackUrl,
      intent: intent || 'sale',
      payerReference,
    });

    const transaction = await prisma.transaction.create({
      data: {
        transactionId,
        merchantId: merchantCtx.merchantId,
        merchantInvoiceNo: merchantInvoiceNumber,
        bkashPaymentID: bkashResponse.paymentID,
        amount: numAmount,
        currency: 'BDT',
        feeAmount,
        netAmount,
        status: 'INITIALIZED',
        mode: merchantCtx.mode,
        intent: intent || 'sale',
        payerReference,
        callbackUrl,
        cancelUrl,
        metadata: metadata || {},
      },
    });

    const hostedCheckoutUrl = `${baseUrl}/checkout/${transaction.transactionId}`;

    return NextResponse.json({
      success: true,
      transactionId: transaction.transactionId,
      merchantInvoiceNo: transaction.merchantInvoiceNo,
      amount: Number(transaction.amount),
      currency: transaction.currency,
      feeAmount,
      netAmount,
      status: transaction.status,
      mode: transaction.mode,
      paymentUrl: hostedCheckoutUrl,
      bkashUrl: bkashResponse.bkashURL,
      bkashPaymentID: bkashResponse.paymentID,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Payment Creation Failed' }, { status: 400 });
  }
}
