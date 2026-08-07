import { NextRequest, NextResponse } from 'next/server';
import { authenticateMerchantApiRequest } from '@/lib/auth/merchant-auth';
import { getBkashCredentials, refundBkashPayment } from '@/lib/bkash/bkash-service';
import { prisma } from '@/lib/db/prisma';
import { dispatchWebhook } from '@/lib/webhooks/dispatcher';

export async function POST(req: NextRequest) {
  try {
    const merchantCtx = await authenticateMerchantApiRequest(req);
    const body = await req.json();

    const { transactionId, amount, reason } = body;

    if (!transactionId || !amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false, error: 'transactionId and valid amount are required.' }, { status: 400 });
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        transactionId,
        merchantId: merchantCtx.merchantId,
      },
    });

    if (!transaction) {
      return NextResponse.json({ success: false, error: 'Transaction not found.' }, { status: 404 });
    }

    if (transaction.status !== 'COMPLETED') {
      return NextResponse.json({ success: false, error: `Cannot refund transaction in state: ${transaction.status}` }, { status: 400 });
    }

    if (!transaction.bkashPaymentID || !transaction.bkashTrxID) {
      return NextResponse.json({ success: false, error: 'Missing bKash Payment details for refund.' }, { status: 400 });
    }

    const refundAmount = Number(amount);
    if (refundAmount > Number(transaction.amount)) {
      return NextResponse.json({ success: false, error: 'Refund amount cannot exceed original transaction amount.' }, { status: 400 });
    }

    const bkashCreds = await getBkashCredentials(merchantCtx.merchantId, merchantCtx.mode);

    const refundResult = await refundBkashPayment(bkashCreds, {
      paymentID: transaction.bkashPaymentID,
      trxID: transaction.bkashTrxID,
      amount: refundAmount.toFixed(2),
      reason: reason || 'Merchant refund request',
    });

    const refundRecord = await prisma.refund.create({
      data: {
        merchantId: merchantCtx.merchantId,
        transactionId: transaction.id,
        bkashRefundTrxID: refundResult.refundTrxID,
        amount: refundAmount,
        reason: reason || 'Merchant requested refund',
        status: 'COMPLETED',
      },
    });

    const newStatus = refundAmount === Number(transaction.amount) ? 'REFUNDED' : 'PARTIALLY_REFUNDED';

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: newStatus },
    });

    // Notify Sub-merchant webhook
    dispatchWebhook(transaction.merchantId, transaction.transactionId, 'refund.processed', {
      transactionId: transaction.transactionId,
      merchantInvoiceNo: transaction.merchantInvoiceNo,
      amount: refundAmount,
      currency: transaction.currency,
      status: newStatus,
      bkashTrxID: transaction.bkashTrxID,
      metadata: transaction.metadata,
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      refundId: refundRecord.id,
      transactionId: transaction.transactionId,
      bkashRefundTrxID: refundResult.refundTrxID,
      refundAmount,
      status: newStatus,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Refund processing failed.' }, { status: 400 });
  }
}
