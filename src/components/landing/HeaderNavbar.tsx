'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, BookOpen, Globe, ArrowRight, Activity, UserCheck } from 'lucide-react';

export default function HeaderNavbar() {
  const [lang, setLang] = useState<'EN' | 'BN'>('EN');

  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between z-30 relative">
      {/* Brand & Live Status */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-xl glow-bkash group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white block leading-none">PayBridge</span>
            <span className="text-[10px] text-pink-400 font-mono tracking-wider uppercase">Enterprise MFS SaaS</span>
          </div>
        </Link>

        {/* Live System Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>All Payment Gateways Operational</span>
        </div>
      </div>

      {/* Navigation Right Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Sleek Language Switcher */}
        <button
          onClick={() => setLang(lang === 'EN' ? 'BN' : 'EN')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          title="Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-pink-400" />
          <span>{lang === 'EN' ? 'EN' : 'বাংলা'}</span>
          <span className="text-[10px] text-slate-500">|</span>
          <span className="text-[10px] text-slate-400 font-normal">{lang === 'EN' ? 'বাংলা' : 'EN'}</span>
        </button>

        {/* Docs Link */}
        <Link
          href="/docs"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-900"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>Docs</span>
        </Link>

        {/* Portal Sign In Link */}
        <Link
          href="/login"
          className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-900 flex items-center gap-1.5"
        >
          <UserCheck className="w-3.5 h-3.5 text-pink-400" />
          <span>Merchant Portal</span>
        </Link>

        {/* Primary Header CTA */}
        <Link
          href="/register"
          className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg glow-bkash transition-all flex items-center gap-1.5"
        >
          <span>Get API Key</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}
