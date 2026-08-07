import { NextRequest, NextResponse } from 'next/server';
import { authenticateMerchantApiRequest } from '@/lib/auth/merchant-auth';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const merchantCtx = await authenticateMerchantApiRequest(req);
    const url = new URL(req.url);
    const transactionId = url.searchParams.get('transactionId');
    const merchantInvoiceNo = url.searchParams.get('merchantInvoiceNo');

    if (!transactionId && !merchantInvoiceNo) {
      return NextResponse.json({ success: false, error: 'Provide transactionId or merchantInvoiceNo query param.' }, { status: 400 });
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        merchantId: merchantCtx.merchantId,
        OR: [
          { transactionId: transactionId || undefined },
          { merchantInvoiceNo: merchantInvoiceNo || undefined },
        ],
      },
    });

    if (!transaction) {
      return NextResponse.json({ success: false, error: 'Transaction not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      transactionId: transaction.transactionId,
      merchantInvoiceNo: transaction.merchantInvoiceNo,
      bkashPaymentID: transaction.bkashPaymentID,
      bkashTrxID: transaction.bkashTrxID,
      amount: Number(transaction.amount),
      currency: transaction.currency,
      feeAmount: Number(transaction.feeAmount),
      netAmount: Number(transaction.netAmount),
      status: transaction.status,
      customerMobile: transaction.customerMobile,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}
