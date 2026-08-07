import { cookies } from 'next/headers';
import { verifyJwtToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db/prisma';
import Link from 'next/link';
import { DollarSign, ArrowUpRight, CheckCircle, ShieldAlert, KeyRound, Webhook, CreditCard } from 'lucide-react';

export const revalidate = 0;

export default async function DashboardPage() {
  const token = cookies().get('paybridge_session')?.value;
  const payload = await verifyJwtToken(token!);

  const isSuperAdmin = payload?.role === 'SUPER_ADMIN' || payload?.role === 'ADMIN';
  const whereClause = isSuperAdmin ? {} : { merchantId: payload?.merchantId || 'NONE' };

  const [totalCount, completedCount, volumeAggregate, recentTransactions] = await Promise.all([
    prisma.transaction.count({ where: whereClause }),
    prisma.transaction.count({ where: { ...whereClause, status: 'COMPLETED' } }),
    prisma.transaction.aggregate({
      where: { ...whereClause, status: 'COMPLETED' },
      _sum: { amount: true, feeAmount: true, netAmount: true },
    }),
    prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { merchant: { select: { businessName: true } } },
    }),
  ]);

  const totalVolume = Number(volumeAggregate._sum.amount || 0);
  const totalFees = Number(volumeAggregate._sum.feeAmount || 0);
  const netVolume = Number(volumeAggregate._sum.netAmount || 0);
  const successRate = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : '100.0';

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Merchant Gateway Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time bKash tokenized payment analytics and transaction logs.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/api-keys"
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-lg glow-bkash transition-all flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>API Credentials</span>
          </Link>
          <Link
            href="/dashboard/webhooks"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Webhook className="w-3.5 h-3.5 text-indigo-400" />
            <span>Webhooks</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Volume */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Volume</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            ৳ {totalVolume.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Processed bKash Sales
          </p>
        </div>

        {/* Card 2: Net Settlement */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Net Settled Amount</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            ৳ {netVolume.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">After SaaS platform fee deduction</p>
        </div>

        {/* Card 3: Fee Markup */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Markup Fee Collected</span>
            <div className="w-7 h-7 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <span className="font-bold text-xs">৳</span>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-pink-400 mt-2">
            ৳ {totalFees.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-pink-300 mt-1">Platform revenue markup</p>
        </div>

        {/* Card 4: Success Rate */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Success Rate</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {successRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{completedCount} of {totalCount} completed</p>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-pink-500" />
            Recent Payment Gateway Activity
          </h2>
          <Link href="/dashboard/transactions" className="text-xs text-pink-400 hover:underline">
            View All Transactions →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">PayBridge Ref</th>
                <th className="py-3 px-4">Merchant Invoice</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">bKash Trx ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No payment transactions recorded yet. Initiate a payment via API or Hosted Checkout.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-pink-400 font-semibold">{trx.transactionId}</td>
                    <td className="py-3 px-4 font-medium text-white">{trx.merchantInvoiceNo}</td>
                    <td className="py-3 px-4 font-bold text-white">৳ {Number(trx.amount).toFixed(2)}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{trx.bkashTrxID || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        trx.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        trx.status === 'INITIALIZED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        trx.status === 'REFUNDED' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{new Date(trx.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
