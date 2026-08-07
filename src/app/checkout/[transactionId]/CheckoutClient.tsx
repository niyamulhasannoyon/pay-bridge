'use client';

import { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface TransactionData {
  transactionId: string;
  merchantInvoiceNo: string;
  amount: number;
  currency: string;
  status: string;
  merchantName: string;
  callbackUrl: string;
  cancelUrl: string;
  bkashPaymentID?: string | null;
}

export default function CheckoutClient({ transaction }: { transaction: TransactionData }) {
  const [selectedProvider, setSelectedProvider] = useState<'BKASH' | 'NAGAD' | 'ROCKET'>('BKASH');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayNow = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/checkout/initiate?transactionId=${transaction.transactionId}&provider=${selectedProvider}`);
      const data = await res.json();

      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setError(data.error || `Failed to initiate ${selectedProvider} payment.`);
        setLoading(false);
      }
    } catch {
      setError('Network connection error. Please try again.');
      setLoading(false);
    }
  };

  const isCompleted = transaction.status === 'COMPLETED';

  return (
    <div className="w-full max-w-md z-10">
      {/* Top Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-400 mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Secured by <span className="text-white font-semibold">PayBridge</span> Gateway
        </div>
        <h1 className="text-xl font-bold text-slate-100">{transaction.merchantName}</h1>
        <p className="text-xs text-slate-400 mt-0.5">Invoice #{transaction.merchantInvoiceNo}</p>
      </div>

      {/* Main Glass Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Top Glow Bar depending on selected provider */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
            selectedProvider === 'NAGAD'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500'
              : selectedProvider === 'ROCKET'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
              : 'bg-gradient-to-r from-pink-500 to-rose-500'
          }`}
        />

        {/* Amount Section */}
        <div className="text-center pb-5 border-b border-slate-800/80">
          <span className="text-xs uppercase font-medium tracking-wider text-slate-400">Total Payable Amount</span>
          <div className="text-4xl font-extrabold text-white mt-1 flex items-baseline justify-center gap-1">
            <span className="text-pink-500">৳</span>
            <span>{transaction.amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</span>
            <span className="text-xs font-medium text-slate-400 uppercase">{transaction.currency}</span>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isCompleted ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">Payment Already Completed</h3>
            <p className="text-xs text-slate-400 mt-1">This invoice has been successfully processed.</p>
            <a
              href={transaction.callbackUrl}
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all"
            >
              Return to Merchant Website
            </a>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Select MFS Payment Wallet</span>
              <span className="text-[10px] text-pink-400 font-mono">Multi-Channel Gateway</span>
            </div>

            {/* Wallet Selection Options */}
            <div className="space-y-2.5">
              {/* bKash Option */}
              <div
                onClick={() => setSelectedProvider('BKASH')}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  selectedProvider === 'BKASH'
                    ? 'bg-slate-900 border-pink-500/80 ring-1 ring-pink-500/50 shadow-md'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#e2136e] flex items-center justify-center font-black text-white text-base shadow-sm">
                    bK
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">bKash Account</h4>
                    <p className="text-[11px] text-slate-400">bKash Tokenized Checkout</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedProvider === 'BKASH' ? 'border-pink-500' : 'border-slate-600'}`}>
                  {selectedProvider === 'BKASH' && <div className="w-2 h-2 rounded-full bg-pink-500" />}
                </div>
              </div>

              {/* Nagad Option */}
              <div
                onClick={() => setSelectedProvider('NAGAD')}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  selectedProvider === 'NAGAD'
                    ? 'bg-slate-900 border-orange-500/80 ring-1 ring-orange-500/50 shadow-md'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-600 flex items-center justify-center font-black text-white text-xs shadow-sm">
                    নগদ
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Nagad Direct Wallet</h4>
                    <p className="text-[11px] text-slate-400">Nagad Direct API v0.2</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedProvider === 'NAGAD' ? 'border-orange-500' : 'border-slate-600'}`}>
                  {selectedProvider === 'NAGAD' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                </div>
              </div>

              {/* Rocket Option */}
              <div
                onClick={() => setSelectedProvider('ROCKET')}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  selectedProvider === 'ROCKET'
                    ? 'bg-slate-900 border-purple-500/80 ring-1 ring-purple-500/50 shadow-md'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-700 flex items-center justify-center font-black text-white text-base shadow-sm">
                    R
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">DBBL Rocket Wallet</h4>
                    <p className="text-[11px] text-slate-400">Dutch-Bangla Bank Gateway</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedProvider === 'ROCKET' ? 'border-purple-500' : 'border-slate-600'}`}>
                  {selectedProvider === 'ROCKET' && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                </div>
              </div>
            </div>

            {/* Primary Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={loading}
              className={`w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 ${
                selectedProvider === 'NAGAD'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500'
                  : selectedProvider === 'ROCKET'
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600'
                  : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 glow-bkash'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to {selectedProvider} Gateway...</span>
                </div>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ৳ {transaction.amount.toFixed(2)} via {selectedProvider}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {/* Cancel link */}
            <div className="text-center pt-1">
              <a
                href={`${transaction.cancelUrl}?status=CANCELLED&transactionId=${transaction.transactionId}`}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Cancel and return to merchant store
              </a>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> AES-256 Encrypted
          </span>
          <span>Ref: {transaction.transactionId.slice(-10)}</span>
        </div>
      </div>
    </div>
  );
}
