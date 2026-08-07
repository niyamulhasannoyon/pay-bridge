'use client';

import { useState } from 'react';
import { Code2, Copy, Check, Terminal, FileCode, CheckCircle2 } from 'lucide-react';

export default function TabbedCodeSwitcher() {
  const [activeTab, setActiveTab] = useState<'curl' | 'nodejs' | 'php' | 'python'>('php');
  const [copied, setCopied] = useState(false);

  const snippets = {
    curl: `curl -X POST https://paybridge-official.vercel.app/api/v1/payments/create \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1250.00,
    "merchantInvoiceNo": "INV-2026-98214",
    "paymentGateway": "BKASH",
    "callbackUrl": "https://your-store.com/api/payment/callback"
  }'`,

    nodejs: `// Node.js / Next.js / Express Integration
import axios from 'axios';

const response = await axios.post(
  'https://paybridge-official.vercel.app/api/v1/payments/create',
  {
    amount: 1250.00,
    merchantInvoiceNo: 'INV-2026-98214',
    paymentGateway: 'BKASH',
    callbackUrl: 'https://your-store.com/api/payment/callback'
  },
  {
    headers: {
      'Authorization': \`Bearer \${process.env.PAYBRIDGE_API_KEY}\`,
      'Content-Type': 'application/json'
    }
  }
);

// Redirect Customer to Hosted bKash Checkout
window.location.href = response.data.checkoutUrl;`,

    php: `<?php
// Laravel Controller / WordPress PHP Integration
use Illuminate\\Support\\Facades\\Http;

$response = Http::withToken(config('services.paybridge.api_key'))
    ->post('https://paybridge-official.vercel.app/api/v1/payments/create', [
        'amount'            => 1250.00,
        'merchantInvoiceNo' => 'INV-2026-98214',
        'paymentGateway'    => 'BKASH',
        'callbackUrl'       => route('payment.callback'),
    ]);

if ($response->successful()) {
    $checkoutUrl = $response->json('checkoutUrl');
    return redirect()->away($checkoutUrl);
}`,

    python: `# Python / Django / FastAPI Integration
import requests
import os

url = "https://paybridge-official.vercel.app/api/v1/payments/create"
headers = {
    "Authorization": f"Bearer {os.getenv('PAYBRIDGE_API_KEY')}",
    "Content-Type": "application/json"
}
payload = {
    "amount": 1250.00,
    "merchantInvoiceNo": "INV-2026-98214",
    "paymentGateway": "BKASH",
    "callbackUrl": "https://your-store.com/api/payment/callback"
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

# Redirect Customer to data['checkoutUrl']`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 relative z-10">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs font-mono text-indigo-300">
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Developer-First Integration</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Integrate Payments in Less Than 5 Minutes
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Copy production-ready code snippets for Laravel, Node.js, Python, or raw cURL requests.
        </p>
      </div>

      {/* macOS Editor Frame */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden glass-panel">
        
        {/* Editor Title Bar with macOS Dots & Tabs */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: macOS Dots & File Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
            </div>
            <span className="text-xs font-mono text-slate-400 border-l border-slate-800 pl-3 hidden sm:inline">
              POST /api/v1/payments/create
            </span>
          </div>

          {/* Center/Right: Language Tabs */}
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('php')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'php'
                  ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PHP (Laravel)
            </button>
            <button
              onClick={() => setActiveTab('nodejs')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'nodejs'
                  ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Node.js
            </button>
            <button
              onClick={() => setActiveTab('curl')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'curl'
                  ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setActiveTab('python')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'python'
                  ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Python
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors border border-slate-700 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-pink-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content Container */}
        <div className="p-5 overflow-x-auto bg-[#070b14] font-mono text-xs text-slate-200 leading-relaxed">
          <pre>{snippets[activeTab]}</pre>
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-2.5 bg-slate-900/50 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Automatic Redis Token Renewal & HMAC Webhook Dispatch</span>
          </div>
          <span className="text-pink-400 font-mono hidden sm:inline">SDK v1.4.0</span>
        </div>
      </div>
    </section>
  );
}
