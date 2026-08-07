'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Search, RefreshCw, AlertCircle, CheckCircle2, RotateCcw, Filter, FileText } from 'lucide-react';

interface TransactionItem {
  id: string;
  transactionId: string;
  merchantInvoiceNo: string;
  bkashPaymentID: string | null;
  bkashTrxID: string | null;
  amount: number;
  currency: string;
  feeAmount: number;
  netAmount: number;
  status: string;
  mode: string;
  customerMobile: string | null;
  createdAt: string;
}

export default function TransactionsClient() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  
  // Refund modal state
  const [refundModalTx, setRefundModalTx] = useState<TransactionItem | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refunding, setRefunding] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);
  const [refundSuccess, setRefundSuccess] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/merchant/analytics');
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.merchantInvoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.bkashTrxID && tx.bkashTrxID.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'ALL' || tx.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenRefund = (tx: TransactionItem) => {
    setRefundModalTx(tx);
    setRefundAmount(tx.amount.toString());
    setRefundReason('Customer return request');
    setRefundError(null);
    setRefundSuccess(null);
  };

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundModalTx) return;

    setRefunding(true);
    setRefundError(null);
    setRefundSuccess(null);

    // Need API Key header or active session for refund endpoint
    // In dashboard, we can pass authorization header or use endpoint
    try {
      // Fetch merchant's active sandbox or live API key for internal dashboard refund
      const keysRes = await fetch('/api/v1/merchant/api-keys');
      const keysData = await keysRes.json();
      
      let apiKeySecret = '';
      if (keysData.keys && keysData.keys.length > 0) {
        // If keys exist, we can use session-based refund endpoint or API key
      }

      // Execute refund call
      const res = await fetch('/api/v1/payments/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'SESSION_INTERNAL', // Auth handled via cookies or API key
        },
        body: JSON.stringify({
          transactionId: refundModalTx.transactionId,
          amount: Number(refundAmount),
          reason: refundReason,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setRefundSuccess(`Refund of ৳ ${data.refundAmount} processed! bKash Refund Trx ID: ${data.bkashRefundTrxID}`);
        fetchTransactions();
      } else {
        setRefundError(data.error || 'Refund failed.');
      }
    } catch (err: any) {
      setRefundError(err.message || 'Refund error');
    } finally {
      setRefunding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search Ref, Invoice #, or bKash Trx ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500 flex-1 md:flex-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="INITIALIZED">INITIALIZED</option>
            <option value="FAILED">FAILED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>

          <button
            onClick={fetchTransactions}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">PayBridge Ref</th>
                <th className="py-3 px-4">Merchant Invoice</th>
                <th className="py-3 px-4">Gross Amount</th>
                <th className="py-3 px-4">Net Amount</th>
                <th className="py-3 px-4">bKash Trx ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">Loading transactions...</td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">No transactions match your search filter.</td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-pink-400">{tx.transactionId}</td>
                    <td className="py-3.5 px-4 font-medium text-white">{tx.merchantInvoiceNo}</td>
                    <td className="py-3.5 px-4 font-bold text-white">৳ {Number(tx.amount).toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-300">৳ {Number(tx.netAmount).toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{tx.bkashTrxID || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        tx.status === 'INITIALIZED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        tx.status === 'REFUNDED' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition-colors"
                      >
                        Inspect
                      </button>

                      {tx.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleOpenRefund(tx)}
                          className="px-2.5 py-1 rounded bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-pink-500" /> Transaction Audit Details
              </h3>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-300">
              <div>
                <span className="text-[11px] text-slate-500 block">PayBridge Reference</span>
                <span className="font-mono font-bold text-pink-400">{selectedTx.transactionId}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Merchant Invoice No</span>
                <span className="font-bold text-white">{selectedTx.merchantInvoiceNo}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">bKash Payment ID</span>
                <span className="font-mono text-slate-300">{selectedTx.bkashPaymentID || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">bKash Trx ID</span>
                <span className="font-mono text-slate-300">{selectedTx.bkashTrxID || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Gross Amount</span>
                <span className="font-bold text-white">৳ {Number(selectedTx.amount).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">SaaS Fee Amount</span>
                <span className="font-medium text-pink-400">৳ {Number(selectedTx.feeAmount).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Customer bKash Wallet</span>
                <span className="font-mono text-slate-300">{selectedTx.customerMobile || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Environment Mode</span>
                <span className="font-bold text-amber-400">{selectedTx.mode}</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Refund Modal */}
      {refundModalTx && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-indigo-400" />
              Issue bKash Refund
            </h3>

            <form onSubmit={handleProcessRefund} className="space-y-4">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                <p className="text-slate-400">PayBridge Ref: <span className="font-mono text-pink-400 font-bold">{refundModalTx.transactionId}</span></p>
                <p className="text-slate-400">Original Amount: <span className="text-white font-bold">৳ {Number(refundModalTx.amount).toFixed(2)}</span></p>
              </div>

              {refundError && (
                <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{refundError}</span>
                </div>
              )}

              {refundSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{refundSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Refund Amount (BDT)</label>
                <input
                  type="number"
                  step="0.01"
                  max={refundModalTx.amount}
                  required
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Refund</label>
                <input
                  type="text"
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRefundModalTx(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={refunding}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {refunding ? 'Processing Refund...' : 'Confirm Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
