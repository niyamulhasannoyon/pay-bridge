import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { createBkashPayment, getBkashCredentials } from '@/lib/bkash/bkash-service';
import { createNagadPayment } from '@/lib/nagad/nagad-service';
import { createRocketPayment } from '@/lib/rocket/rocket-service';
import { PaymentProvider } from '@prisma/client';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const transactionId = url.searchParams.get('transactionId');
  const providerParam = (url.searchParams.get('provider') || 'BKASH').toUpperCase() as PaymentProvider;

  if (!transactionId) {
    return NextResponse.json({ success: false, error: 'transactionId is required' }, { status: 400 });
  }

  const transaction = await prisma.transaction.findUnique({
    where: { transactionId },
  });

  if (!transaction) {
    return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
  }

  if (transaction.status === 'COMPLETED') {
    return NextResponse.json({ success: false, error: 'Transaction already completed' }, { status: 400 });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const internalCallbackUrl = `${baseUrl}/api/v1/callbacks/bkash?trx=${transaction.transactionId}&provider=${providerParam}`;

    let redirectUrl = '';
    let paymentID = '';

    if (providerParam === 'NAGAD') {
      const nagadRes = await createNagadPayment({
        amount: Number(transaction.amount).toFixed(2),
        merchantInvoiceNumber: transaction.merchantInvoiceNo,
        callbackURL: internalCallbackUrl,
      });
      redirectUrl = nagadRes.redirectUrl;
      paymentID = nagadRes.paymentID;
    } else if (providerParam === 'ROCKET') {
      const rocketRes = await createRocketPayment({
        amount: Number(transaction.amount).toFixed(2),
        merchantInvoiceNumber: transaction.merchantInvoiceNo,
        callbackURL: internalCallbackUrl,
      });
      redirectUrl = rocketRes.redirectUrl;
      paymentID = rocketRes.paymentID;
    } else {
      // bKash Default
      const bkashCreds = await getBkashCredentials(transaction.merchantId, transaction.mode);
      const bkashResponse = await createBkashPayment(bkashCreds, {
        amount: Number(transaction.amount).toFixed(2),
        merchantInvoiceNumber: transaction.merchantInvoiceNo,
        callbackURL: internalCallbackUrl,
        intent: transaction.intent,
        payerReference: transaction.payerReference || undefined,
      });
      redirectUrl = bkashResponse.bkashURL;
      paymentID = bkashResponse.paymentID;
    }

    // Update payment details in DB
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        provider: providerParam,
        bkashPaymentID: paymentID,
      },
    });

    return NextResponse.json({
      success: true,
      provider: providerParam,
      paymentUrl: redirectUrl,
      paymentID,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
