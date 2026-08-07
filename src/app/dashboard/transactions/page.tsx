import TransactionsClient from './TransactionsClient';

export const revalidate = 0;

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Payment Transactions & Refund Manager</h1>
        <p className="text-xs text-slate-400 mt-1">Search, audit, and issue manual bKash refunds for processed customer orders.</p>
      </div>

      <TransactionsClient />
    </div>
  );
}
