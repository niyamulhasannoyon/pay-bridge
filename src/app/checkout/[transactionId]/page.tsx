import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import CheckoutClient from './CheckoutClient';

export const revalidate = 0;

interface CheckoutPageProps {
  params: {
    transactionId: string;
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const transaction = await prisma.transaction.findUnique({
    where: { transactionId: params.transactionId },
    include: {
      merchant: {
        select: {
          businessName: true,
          slug: true,
        },
      },
    },
  });

  if (!transaction) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      <CheckoutClient 
        transaction={{
          transactionId: transaction.transactionId,
          merchantInvoiceNo: transaction.merchantInvoiceNo,
          amount: Number(transaction.amount),
          currency: transaction.currency,
          status: transaction.status,
          merchantName: transaction.merchant.businessName,
          callbackUrl: transaction.callbackUrl,
          cancelUrl: transaction.cancelUrl || transaction.callbackUrl,
          bkashPaymentID: transaction.bkashPaymentID,
        }}
      />
    </div>
  );
}
