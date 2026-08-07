'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Zap, ArrowRight, Calculator, ShieldCheck, Sparkles } from 'lucide-react';

export default function PricingSection() {
  const [monthlyVolume, setMonthlyVolume] = useState(250000); // Default 2.5 Lakh BDT

  // Standard fee is 1.5%
  const feePercentage = 1.5;
  const estimatedFee = Math.round((monthlyVolume * feePercentage) / 100);

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative z-10">
      <div className="text-center space-y-2 mb-12">
        <span className="text-xs font-bold font-mono tracking-wider uppercase text-pink-400">
          Simple Transparent Pricing
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          No Setup Fee. No Monthly Maintenance.
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Pay only when you process transactions. Simple flat rates with no hidden charges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Interactive Fee Calculator */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-slate-800 glass-panel flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Monthly Volume Fee Calculator</h3>
              </div>
              <span className="text-xs font-mono text-pink-400 bg-pink-950/60 px-2.5 py-1 rounded-lg border border-pink-500/30">
                Rate: 1.5% Per Transaction
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Drag the slider to estimate your monthly transaction costs based on expected sales.
            </p>

            {/* Slider */}
            <div className="space-y-3 pt-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Estimated Monthly Volume</span>
                <span className="text-lg font-black text-white">{formatBDT(monthlyVolume)}</span>
              </div>
              
              <input
                type="range"
                min={50000}
                max={5000000}
                step={50000}
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>৳ 50,000</span>
                <span>৳ 25 Lakh</span>
                <span>৳ 50 Lakh+</span>
              </div>
            </div>
          </div>

          {/* Fee Calculation Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 gap-4 text-center">
            <div className="border-r border-slate-800 pr-2">
              <span className="text-[11px] text-slate-400 block">Total Transaction Fee</span>
              <span className="text-xl font-extrabold text-pink-400 font-mono">{formatBDT(estimatedFee)}</span>
            </div>
            <div className="pl-2">
              <span className="text-[11px] text-slate-400 block">Net Payout to Bank</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">{formatBDT(monthlyVolume - estimatedFee)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Instant Automated Payouts</span>
            </span>
            <span className="text-pink-400 font-semibold">Zero Hidden Surcharges</span>
          </div>
        </div>

        {/* Right Column: Pricing Tier Card */}
        <div className="lg:col-span-5 relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-pink-950/30 via-slate-950 to-indigo-950/20 border border-pink-500/40 glass-panel flex flex-col justify-between space-y-6 shadow-2xl">
          
          <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 to-indigo-600 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Most Popular</span>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-white">Standard Merchant Plan</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white font-mono">1.5%</span>
              <span className="text-xs text-slate-400">/ successful transaction</span>
            </div>
            <p className="text-xs text-slate-400">
              Ideal for e-commerce, SaaS, online courses, and digital service providers in Bangladesh.
            </p>
          </div>

          {/* Included Features Checklist */}
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>bKash, Nagad, Rocket & Bank Gateways</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>৳ 0 Monthly Maintenance & Setup Fees</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>Unlimited HMAC SHA-256 Webhook Callbacks</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>Automatic bKash Token Renewal & Caching</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>Sub-Merchant Multi-Tenant Dashboard</span>
            </li>
          </ul>

          <Link
            href="/register"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xl glow-bkash transition-all flex items-center justify-center gap-2"
          >
            <span>Start Integrating Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
