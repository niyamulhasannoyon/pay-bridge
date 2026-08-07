'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserSessionPayload } from '@/lib/auth/jwt';
import {
  ShieldAlert,
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface AnalyticsData {
  totalVolume: number;
  totalFee: number;
  totalTransactions: number;
  completedTransactions: number;
  successRate: number;
  dailyStats: any[];
}

export default function AdminDashboardClient({ user }: { user: UserSessionPayload }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAnalytics, resMerchants, resConfigs] = await Promise.all([
        fetch('/api/v1/merchant/analytics').then((r) => r.json()),
        fetch('/api/v1/admin/merchants').then((r) => r.json()),
        fetch('/api/v1/admin/bkash-configs').then((r) => r.json()),
      ]);

      if (resAnalytics.success) setAnalytics(resAnalytics.analytics);
      if (resMerchants.success) setMerchants(resMerchants.merchants);
      if (resConfigs.success) setConfigs(resConfigs.configs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="glass-panel p-8 rounded-3xl border border-rose-900/30 bg-gradient-to-r from-rose-950/40 via-[#0d111e] to-indigo-950/30 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Dedicated {user.role} Control Panel</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              PayBridge Platform Administration
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              প্ল্যাটফর্মের সকল সাব-মার্চেন্ট, মাস্টার bKash API কনফিগারেশন, মোট পেমেন্ট ভলিউম এবং সিস্টেম হেলথ রিয়েলটাইমে পর্যবেক্ষণ করুন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 shadow-md flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-pink-400' : ''}`} />
              <span>Refresh Analytics</span>
            </button>
            <Link
              href="/admin/bkash-configs"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg glow-bkash flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>bKash Vault Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Quick Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Platform Volume</span>
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">
            ৳{analytics?.totalVolume ? analytics.totalVolume.toLocaleString('en-BD', { minimumFractionDigits: 2 }) : '0.00'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Across all sub-merchants</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Markup Fee</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">
            ৳{analytics?.totalFee ? analytics.totalFee.toLocaleString('en-BD', { minimumFractionDigits: 2 }) : '0.00'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Total Revenue Earned</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Merchants</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{merchants.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Active Sub-Merchant Accounts</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Transactions</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{analytics?.totalTransactions || 0}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Success Rate: {analytics?.successRate ? `${analytics.successRate}%` : '100%'}
          </span>
        </div>
      </div>

      {/* System bKash Vault Status Widget */}
      <div className="glass-panel p-6 rounded-2xl border border-rose-900/30 bg-slate-900/80 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">System bKash Vault Status</h2>
              <p className="text-[11px] text-slate-400">Master bKash App Key, Secret and AES-256-GCM Encryption Vault Status</p>
            </div>
          </div>
          <Link
            href="/admin/bkash-configs"
            className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
          >
            <span>Manage Configurations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {configs.map((cfg) => (
            <div
              key={cfg.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono">{cfg.appKey}</span>
                  {cfg.isSystemDefault && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      SYSTEM DEFAULT
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Merchant Owner: <span className="text-slate-200">{cfg.merchantName}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cfg.mode === 'LIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {cfg.mode}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          ))}

          {configs.length === 0 && (
            <div className="col-span-2 p-4 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center text-xs text-slate-400">
              No bKash Vault configurations created yet. Click "Manage Configurations" to add master bKash keys.
            </div>
          )}
        </div>
      </div>

      {/* Sub-Merchants Directory Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Sub-Merchants Directory</span>
            </h2>
            <p className="text-xs text-slate-400">প্ল্যাটফর্মে নিবন্ধিত সকল মার্চেন্ট একাউন্ট ও তাদের পারফরম্যান্স</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Merchant / Business</th>
                <th className="p-3.5">Email & Role</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Fee Rate</th>
                <th className="p-3.5">Transactions</th>
                <th className="p-3.5">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {merchants.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-white">
                    <div className="flex items-center gap-2.5">
                      {m.user?.avatarUrl ? (
                        <img src={m.user.avatarUrl} alt={m.businessName} className="w-7 h-7 rounded-full border border-slate-700 object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                          {m.businessName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span>{m.businessName}</span>
                        <span className="block text-[10px] text-slate-500 font-mono">{m.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="block text-slate-200">{m.user?.email}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase">
                      {m.user?.role}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">
                    {m.feePercentage}% + ৳{m.fixedFee}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-white">
                    {m._count?.transactions || 0}
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}

              {merchants.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                    No merchants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
