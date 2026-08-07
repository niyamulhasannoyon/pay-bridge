'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, KeyRound, Webhook, CreditCard, Shield, LogOut, ExternalLink, Zap } from 'lucide-react';
import { UserSessionPayload } from '@/lib/auth/jwt';

export default function DashboardSidebar({ user }: { user: UserSessionPayload }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'API Credentials', href: '/dashboard/api-keys', icon: KeyRound },
    { label: 'Webhooks & Test', href: '/dashboard/webhooks', icon: Webhook },
    { label: 'Transactions Log', href: '/dashboard/transactions', icon: CreditCard },
  ];

  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
    navItems.push({ label: 'bKash Configs', href: '/admin/bkash-configs', icon: Shield });
  }

  return (
    <aside className="w-full md:w-64 bg-[#0d1322] border-r border-slate-800 flex flex-col justify-between shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-none">PayBridge</span>
              <span className="text-[10px] text-pink-400 font-mono">bKash SaaS Gateway</span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-600/20 to-indigo-600/20 text-pink-400 border border-pink-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="truncate">
            <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase">
            {user.role}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 text-xs font-medium border border-slate-800 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
