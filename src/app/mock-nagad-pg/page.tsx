'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, ShieldCheck } from 'lucide-react';

function MockNagadForm() {
  const searchParams = useSearchParams();
  const paymentID = searchParams.get('paymentID') || 'NAGAD_MOCK_1001';
  const callbackURL = searchParams.get('callbackURL') || '/api/v1/callbacks/bkash';

  const [walletNumber, setWalletNumber] = useState('01811223344');
  const [pin, setPin] = useState('1234');
  const [loading, setLoading] = useState(false);

  const handleConfirmPayment = () => {
    setLoading(true);

    setTimeout(() => {
      const url = new URL(callbackURL, window.location.origin);
      url.searchParams.set('paymentID', paymentID);
      url.searchParams.set('provider', 'NAGAD');
      url.searchParams.set('status', 'success');
      window.location.href = url.toString();
    }, 1200);
  };

  const handleCancelPayment = () => {
    const url = new URL(callbackURL, window.location.origin);
    url.searchParams.set('paymentID', paymentID);
    url.searchParams.set('provider', 'NAGAD');
    url.searchParams.set('status', 'cancel');
    window.location.href = url.toString();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="bg-orange-50 p-3 rounded-lg text-xs text-orange-950 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
        <span>Simulated Nagad Payment ID: <strong className="font-mono">{paymentID.slice(-10)}</strong></span>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Your Nagad Mobile Account</label>
        <input
          type="text"
          value={walletNumber}
          onChange={(e) => setWalletNumber(e.target.value)}
          placeholder="e.g. 01800000000"
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Enter 4-Digit Nagad PIN</label>
        <div className="relative">
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-widest"
          />
          <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Use test PIN: 1234</p>
      </div>

      <div className="pt-2 space-y-2">
        <button
          onClick={handleConfirmPayment}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing Nagad Payment...</span>
            </div>
          ) : (
            'CONFIRM NAGAD PAYMENT'
          )}
        </button>

        <button
          onClick={handleCancelPayment}
          disabled={loading}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
        >
          CANCEL TRANSACTION
        </button>
      </div>
    </div>
  );
}

export default function MockNagadPaymentPage() {
  return (
    <div className="min-h-screen bg-[#ea580c] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-orange-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-5 text-center relative">
          <div className="w-12 h-12 bg-white text-orange-600 rounded-full font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-inner">
            নগদ
          </div>
          <h2 className="text-lg font-bold">Nagad Direct Gateway</h2>
          <p className="text-xs text-orange-100 font-mono mt-0.5">Sandbox Environment Test Mode</p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Nagad Portal...</div>}>
          <MockNagadForm />
        </Suspense>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3 text-slate-400" /> Nagad RSA-2048 Secure Gateway
        </div>
      </div>
    </div>
  );
}
