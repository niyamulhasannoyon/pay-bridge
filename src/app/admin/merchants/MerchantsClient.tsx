'use client';

import { useState, useEffect } from 'react';
import { UserSessionPayload } from '@/lib/auth/jwt';
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Percent,
  CreditCard,
  Building2,
  ExternalLink,
  User,
} from 'lucide-react';

export default function MerchantsClient({ user }: { user: UserSessionPayload }) {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/merchants');
      const data = await res.json();
      if (data.success) {
        setMerchants(data.merchants);
      }
    } catch (err) {
      console.error('Failed to load merchants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch =
      m.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeCount = merchants.filter((m) => m.status === 'ACTIVE').length;
  const pendingCount = merchants.filter((m) => m.status === 'PENDING').length;
  const totalTrx = merchants.reduce((acc, m) => acc + (m._count?.transactions || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-900/30 bg-gradient-to-r from-slate-900/90 via-[#0d1222] to-indigo-950/30 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>Sub-Merchants Management Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Sub-Merchants Directory
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              PayBridge প্ল্যাটফর্মে নিবন্ধিত সকল সাব-মার্চেন্ট অ্যাকাউন্ট, তাদের ফি কনফিগারেশন, স্ট্যাটাস এবং লেনদেনের পরিসংখ্যান দেখুন।
            </p>
          </div>

          <button
            onClick={fetchMerchants}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 shadow-md flex items-center gap-2 transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-pink-400' : ''}`} />
            <span>Refresh Directory</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Merchants</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{merchants.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Registered in platform</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Merchants</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">{activeCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Fully operational</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-400 font-mono">{pendingCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Awaiting approval</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Transactions</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{totalTrx}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Across all merchants</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search by merchant name, slug, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {['ALL', 'ACTIVE', 'PENDING', 'SUSPENDED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Merchants Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Business & Slug</th>
                <th className="p-4">Owner Email & Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Fee Config</th>
                <th className="p-4">Transactions</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMerchants.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">
                    <div className="flex items-center gap-3">
                      {m.user?.avatarUrl ? (
                        <img
                          src={m.user.avatarUrl}
                          alt={m.businessName}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full border border-pink-500/40 object-cover shadow-sm"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs border border-pink-500/30">
                          {m.businessName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-extrabold text-white block leading-tight">{m.businessName}</span>
                        <span className="text-[11px] text-pink-400 font-mono">slug: {m.slug}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="block text-slate-200 font-medium">{m.user?.email || 'N/A'}</span>
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-extrabold bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase">
                        {m.user?.role || 'MERCHANT'}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${
                        m.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : m.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>

                  <td className="p-4 font-mono">
                    <span className="text-white font-bold">{m.feePercentage}%</span>
                    <span className="text-slate-400 text-[11px]"> + ৳{m.fixedFee}</span>
                  </td>

                  <td className="p-4 font-mono font-extrabold text-white text-sm">
                    {m._count?.transactions || 0}
                  </td>

                  <td className="p-4 text-slate-400 font-mono text-[11px]">
                    {new Date(m.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}

              {filteredMerchants.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 text-xs">
                    No sub-merchants found matching your filter criteria.
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
