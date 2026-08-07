'use client';

import { ShieldCheck, Lock, Webhook, Activity, Server, FileCheck2 } from 'lucide-react';

export default function SecurityComplianceBar() {
  const items = [
    {
      icon: Lock,
      title: 'AES-256-GCM Vault',
      description: 'Merchant secrets encrypted at rest in Redis/Postgres',
      badge: 'Zero Plaintext Keys'
    },
    {
      icon: Webhook,
      title: 'HMAC SHA-256 Webhooks',
      description: 'Every callback signature verified with secret hash',
      badge: 'Anti-Tamper'
    },
    {
      icon: Activity,
      title: '99.99% Uptime SLA',
      description: 'High-availability multi-region token caching',
      badge: 'Auto Failover'
    },
    {
      icon: FileCheck2,
      title: 'PCI-DSS Tokenization',
      description: 'Customer PINs never touch merchant server memory',
      badge: 'Direct Tokenized'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Subtle background glow line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-lg text-pink-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-pink-950/60 text-pink-300 border border-pink-500/20">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
