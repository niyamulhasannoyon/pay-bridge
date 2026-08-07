'use client';

import { ShieldCheck, CreditCard, Building2, Smartphone, CheckCircle } from 'lucide-react';

export default function BrandLogosBar() {
  const brands = [
    {
      name: 'bKash',
      badge: 'Tokenized PG API',
      color: 'from-pink-500/20 to-rose-500/10',
      borderColor: 'border-pink-500/40 hover:border-pink-500',
      textColor: 'text-pink-400',
      accentBg: 'bg-pink-600',
      symbol: 'bK',
      description: 'Automated Token Renewal & Caching'
    },
    {
      name: 'Nagad',
      badge: 'Merchant Pay',
      color: 'from-orange-500/20 to-amber-500/10',
      borderColor: 'border-orange-500/40 hover:border-orange-500',
      textColor: 'text-orange-400',
      accentBg: 'bg-orange-600',
      symbol: 'NG',
      description: 'Direct Mobile Wallet Integration'
    },
    {
      name: 'Rocket',
      badge: 'DBBL MFS',
      color: 'from-purple-500/20 to-indigo-500/10',
      borderColor: 'border-purple-500/40 hover:border-purple-500',
      textColor: 'text-purple-400',
      accentBg: 'bg-purple-600',
      symbol: 'RK',
      description: 'Dutch-Bangla Rocket Gateway'
    },
    {
      name: 'Upay',
      badge: 'UCB MFS',
      color: 'from-yellow-500/20 to-amber-500/10',
      borderColor: 'border-yellow-500/40 hover:border-yellow-500',
      textColor: 'text-yellow-400',
      accentBg: 'bg-yellow-600',
      symbol: 'UP',
      description: 'UCB Upay Multi-tenant Wrapper'
    },
    {
      name: 'Cellfin',
      badge: 'Islami Bank',
      color: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/40 hover:border-emerald-500',
      textColor: 'text-emerald-400',
      accentBg: 'bg-emerald-600',
      symbol: 'CF',
      description: 'IBBL Cellfin & QR Gateway'
    },
    {
      name: 'Cards & Banks',
      badge: 'Visa / Mastercard',
      color: 'from-blue-500/20 to-cyan-500/10',
      borderColor: 'border-blue-500/40 hover:border-blue-500',
      textColor: 'text-blue-400',
      accentBg: 'bg-blue-600',
      symbol: '💳',
      description: 'City Bank, EBL & Card Gateways'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
      <div className="text-center space-y-2 mb-8">
        <span className="text-xs font-bold font-mono tracking-wider uppercase text-pink-400">
          Supported Bangladesh Gateways
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Unified Payments for All Major MFS & Banks
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          One REST API integration gives your app native access to every leading mobile wallet and banking gateway in Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className={`p-4 rounded-2xl bg-gradient-to-b ${brand.color} border ${brand.borderColor} glass-card-hover flex flex-col justify-between space-y-3 cursor-pointer group`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl ${brand.accentBg} text-white font-extrabold text-xs flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                {brand.symbol}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/60 ${brand.textColor} border border-slate-800`}>
                {brand.badge}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                {brand.name}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                {brand.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1 text-[10px] text-slate-500">
              <CheckCircle className={`w-3 h-3 ${brand.textColor}`} />
              <span>Production Ready</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
