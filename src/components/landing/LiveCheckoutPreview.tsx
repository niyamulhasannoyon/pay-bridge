'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, Lock, RefreshCw, Zap, Webhook, ChevronRight } from 'lucide-react';

export default function LiveCheckoutPreview() {
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [step, setStep] = useState<'select' | 'pin' | 'success'>('pin');
  const [pin, setPin] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 900);
  };

  const handleReset = () => {
    setStep('select');
    setPin('1234');
  };

  return (
    <div className="relative w-full max-w-md mx-auto group">
      {/* Background Ambient Glow */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 opacity-30 blur-xl group-hover:opacity-50 transition duration-500"></div>

      {/* Main Glass Widget Box */}
      <div className="relative rounded-3xl bg-[#0d1322]/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl overflow-hidden text-slate-100">
        
        {/* Header Bar */}
        <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-pink-600/20 border border-pink-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-pink-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>PayBridge Checkout</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">LIVE DEMO</span>
              </div>
              <p className="text-[10px] text-slate-400">Merchant: Dhaka Tech Store</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Total Amount</span>
            <span className="text-sm font-extrabold text-white font-mono">৳ 1,250.00</span>
          </div>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-3 text-[11px] font-semibold text-center border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setStep('select')}
            className={`py-2 border-b-2 transition-all ${
              step === 'select'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            1. Gateway
          </button>
          <button
            onClick={() => setStep('pin')}
            className={`py-2 border-b-2 transition-all ${
              step === 'pin'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            2. PIN Auth
          </button>
          <button
            onClick={() => setStep('success')}
            className={`py-2 border-b-2 transition-all ${
              step === 'success'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            3. Webhook Response
          </button>
        </div>

        {/* Dynamic Step Content */}
        <div className="p-5 min-h-[290px] flex flex-col justify-between">
          
          {/* STEP 1: Select Payment Gateway */}
          {step === 'select' && (
            <div className="space-y-3 animate-fadeIn">
              <p className="text-xs text-slate-400 font-medium">Select payment channel:</p>
              
              <div className="grid grid-cols-2 gap-2.5">
                {/* bKash */}
                <button
                  onClick={() => { setSelectedMethod('bkash'); setStep('pin'); }}
                  className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
                    selectedMethod === 'bkash'
                      ? 'bg-pink-950/40 border-pink-500 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-400">bKash</span>
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  </div>
                  <span className="text-[10px] text-slate-400">Tokenized Direct API</span>
                </button>

                {/* Nagad */}
                <button
                  onClick={() => { setSelectedMethod('nagad'); setStep('pin'); }}
                  className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
                    selectedMethod === 'nagad'
                      ? 'bg-orange-950/40 border-orange-500 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">Nagad</span>
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  </div>
                  <span className="text-[10px] text-slate-400">Instant Merchant Pay</span>
                </button>

                {/* Rocket */}
                <button
                  onClick={() => { setSelectedMethod('rocket'); setStep('pin'); }}
                  className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
                    selectedMethod === 'rocket'
                      ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400">Rocket</span>
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  </div>
                  <span className="text-[10px] text-slate-400">DBBL MFS Gateway</span>
                </button>

                {/* Bank Card */}
                <button
                  onClick={() => { setSelectedMethod('bank'); setStep('pin'); }}
                  className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
                    selectedMethod === 'bank'
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">Cards / Bank</span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  </div>
                  <span className="text-[10px] text-slate-400">Visa / Mastercard / EBL</span>
                </button>
              </div>

              <button
                onClick={() => setStep('pin')}
                className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Proceed to Payment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Simulated bKash/Nagad PIN Modal */}
          {step === 'pin' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Selected Brand Banner */}
              <div className="p-3 rounded-xl bg-pink-950/40 border border-pink-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold text-[10px] flex items-center justify-center">
                    bK
                  </div>
                  <div>
                    <span className="text-xs font-bold text-pink-300 capitalize">{selectedMethod} Tokenized Payment</span>
                    <span className="text-[10px] text-slate-400 block font-mono">TrxRef: PB-2026-984012</span>
                  </div>
                </div>
                <Lock className="w-4 h-4 text-pink-400" />
              </div>

              {/* Account Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">bKash Account Number</label>
                <input
                  type="text"
                  readOnly
                  value="01712-890455"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 outline-none"
                />
              </div>

              {/* PIN Input */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-[11px] font-semibold text-slate-300">Enter 4-Digit PIN</label>
                  <span className="text-[10px] text-pink-400 font-mono">Encrypted Session</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-pink-500/50 text-xs font-mono text-center tracking-widest text-white outline-none focus:border-pink-500"
                  />
                  <div className="absolute right-3 top-2.5 text-[10px] text-slate-500">AES-256</div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg glow-bkash transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Payment Agreement...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Pay ৳ 1,250.00</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: Instant Success & Webhook Payload Output */}
          {step === 'success' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-emerald-300">Payment Successfully Completed!</h4>
                <p className="text-[10px] text-slate-400 font-mono">trxID: Trx99A81B2026 | Amount: ৳ 1,250.00</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Webhook className="w-3 h-3 text-pink-400" />
                    <span>Merchant Signed Webhook Payload</span>
                  </span>
                  <span className="text-emerald-400 font-bold">200 OK</span>
                </div>
                
                {/* Code JSON Response Card */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 leading-tight overflow-x-auto">
                  <pre className="text-pink-300">{`{
  "event": "payment.completed",
  "status": "COMPLETED",
  "trxID": "Trx99A81B2026",
  "amount": "1250.00",
  "merchantInvoiceNo": "INV-882194",
  "signature": "hmac_sha256_e9a18f..."
}`}</pre>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-pink-400" />
                <span>Test Another Transaction</span>
              </button>
            </div>
          )}

          {/* Security Footer Note */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>TLS 1.3 Encrypted</span>
            </span>
            <span className="font-mono text-pink-400">Response &lt; 240ms</span>
          </div>

        </div>
      </div>
    </div>
  );
}
