import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { executeBkashPayment, getBkashCredentials } from '@/lib/bkash/bkash-service';
import { executeNagadPayment } from '@/lib/nagad/nagad-service';
import { executeRocketPayment } from '@/lib/rocket/rocket-service';
import { dispatchWebhook } from '@/lib/webhooks/dispatcher';
import { PaymentProvider } from '@prisma/client';

export async function GET(req: NextRequest) {
  return handleCallback(req);
}

export async function POST(req: NextRequest) {
  return handleCallback(req);
}

async function handleCallback(req: NextRequest) {
  const url = new URL(req.url);
  const transactionId = url.searchParams.get('trx');
  const paymentID = url.searchParams.get('paymentID');
  const statusParam = url.searchParams.get('status');
  const providerParam = (url.searchParams.get('provider') || 'BKASH').toUpperCase() as PaymentProvider;

  if (!transactionId && !paymentID) {
    return NextResponse.json({ error: 'Missing transaction identifiers' }, { status: 400 });
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      OR: [
        { transactionId: transactionId || undefined },
        { bkashPaymentID: paymentID || undefined },
      ],
    },
    include: { merchant: true },
  });

  if (!transaction) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  const finalPaymentID = paymentID || transaction.bkashPaymentID;
  const merchantCallbackUrl = transaction.callbackUrl;

  // Handle cancelled or failed states
  if (statusParam === 'cancel' || statusParam === 'failure') {
    const updatedStatus = statusParam === 'cancel' ? 'CANCELLED' : 'FAILED';
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: updatedStatus, failureReason: `User ${statusParam}ed checkout.` },
    });

    dispatchWebhook(transaction.merchantId, transaction.transactionId, updatedStatus === 'CANCELLED' ? 'payment.cancelled' : 'payment.failed', {
      transactionId: transaction.transactionId,
      merchantInvoiceNo: transaction.merchantInvoiceNo,
      amount: Number(transaction.amount),
      currency: transaction.currency,
      status: updatedStatus,
      metadata: transaction.metadata,
    }).catch(console.error);

    const redirectUrl = new URL(merchantCallbackUrl);
    redirectUrl.searchParams.set('status', updatedStatus);
    redirectUrl.searchParams.set('transactionId', transaction.transactionId);
    redirectUrl.searchParams.set('merchantInvoiceNo', transaction.merchantInvoiceNo);

    return NextResponse.redirect(redirectUrl.toString());
  }

  // Execute payment with respective MFS API
  try {
    let trxID = '';
    let customerMobile = '';

    if (providerParam === 'NAGAD') {
      const nagadRes = await executeNagadPayment(finalPaymentID!);
      trxID = nagadRes.trxID;
      customerMobile = nagadRes.customerMobile;
    } else if (providerParam === 'ROCKET') {
      const rocketRes = await executeRocketPayment(finalPaymentID!);
      trxID = rocketRes.trxID;
      customerMobile = rocketRes.customerMobile;
    } else {
      const bkashCreds = await getBkashCredentials(transaction.merchantId, transaction.mode);
      const bkashRes = await executeBkashPayment(bkashCreds, finalPaymentID!);
      trxID = bkashRes.trxID;
      customerMobile = bkashRes.customerMsisdn;
    }

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'COMPLETED',
        provider: providerParam,
        bkashTrxID: trxID,
        providerTrxID: trxID,
        customerMobile,
      },
    });

    // Dispatch Webhook to Sub-Merchant
    dispatchWebhook(transaction.merchantId, transaction.transactionId, 'payment.completed', {
      transactionId: transaction.transactionId,
      merchantInvoiceNo: transaction.merchantInvoiceNo,
      amount: Number(transaction.amount),
      currency: transaction.currency,
      status: 'COMPLETED',
      bkashTrxID: trxID,
      customerMobile,
      metadata: transaction.metadata,
    }).catch(console.error);

    const redirectUrl = new URL(merchantCallbackUrl);
    redirectUrl.searchParams.set('status', 'COMPLETED');
    redirectUrl.searchParams.set('provider', providerParam);
    redirectUrl.searchParams.set('transactionId', transaction.transactionId);
    redirectUrl.searchParams.set('merchantInvoiceNo', transaction.merchantInvoiceNo);
    redirectUrl.searchParams.set('trxID', trxID);
    redirectUrl.searchParams.set('amount', transaction.amount.toString());

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error: any) {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'FAILED', failureReason: error.message },
    });

    const redirectUrl = new URL(merchantCallbackUrl);
    redirectUrl.searchParams.set('status', 'FAILED');
    redirectUrl.searchParams.set('transactionId', transaction.transactionId);

    return NextResponse.redirect(redirectUrl.toString());
  }
}
