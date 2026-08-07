'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  CreditCard,
  BookOpen,
  LogOut,
  Zap,
  ArrowLeftRight,
  ShieldAlert,
} from 'lucide-react';
import { UserSessionPayload } from '@/lib/auth/jwt';

export default function AdminSidebar({ user }: { user: UserSessionPayload }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Admin Analytics', href: '/admin', icon: LayoutDashboard },
    { label: 'bKash System Configs', href: '/admin/bkash-configs', icon: ShieldCheck },
    { label: 'Merchants Directory', href: '/admin/merchants', icon: Users },
    { label: 'All Transactions Log', href: '/dashboard/transactions', icon: CreditCard },
    { label: 'Documentation (বাংলা)', href: '/dashboard/docs', icon: BookOpen },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#090b14] border-r border-rose-900/30 flex flex-col justify-between shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-rose-900/20 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg glow-bkash">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-none">PayBridge</span>
              <span className="text-[10px] text-rose-400 font-mono font-bold uppercase tracking-wider">
                {user.role} Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Admin Navigation */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
            Admin Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-600/20 to-indigo-600/20 text-rose-400 border border-rose-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Portal Switch */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        {/* Portal Switch Button */}
        <Link
          href="/dashboard"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-pink-400" />
          <span>Switch to Merchant Dashboard</span>
        </Link>

        {/* User Info */}
        <div className="flex items-center gap-3 px-1 pt-1">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full border-2 border-rose-500/50 object-cover shrink-0 shadow-md"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 border border-rose-500/30">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          )}
          <div className="truncate flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
              {user.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-950 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 text-xs font-medium border border-slate-800 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
