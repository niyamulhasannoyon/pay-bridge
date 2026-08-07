'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Zap,
  ShieldCheck,
  Webhook,
  Code2,
  UserCheck,
  Check,
  Copy,
  ArrowRight,
  Sparkles,
  Lock,
  Server,
  ArrowLeft,
  User,
} from 'lucide-react';
import { UserSessionPayload } from '@/lib/auth/jwt';

export default function DocsPublicClient({ user }: { user: UserSessionPayload | null }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'auth' | 'api' | 'webhooks' | 'admin'>('overview');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const curlExample = `curl -X POST https://paybridge-official.vercel.app/api/v1/payments/create \\
  -H "Authorization: Bearer YOUR_MERCHANT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchantInvoiceNo": "INV-2026-001",
    "amount": 1250.00,
    "currency": "BDT",
    "intent": "sale",
    "customerMobile": "01700000000",
    "callbackUrl": "https://yourdomain.com/payment/callback",
    "cancelUrl": "https://yourdomain.com/payment/cancel"
  }'`;

  const jsExample = `const response = await fetch('https://paybridge-official.vercel.app/api/v1/payments/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_MERCHANT_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    merchantInvoiceNo: 'INV-889911',
    amount: 500.00,
    callbackUrl: 'https://yourdomain.com/bkash/callback'
  })
});

const data = await response.json();
if (data.success) {
  // Redirect Customer to PayBridge Checkout UI
  window.location.href = data.checkoutUrl;
}`;

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 relative font-sans overflow-x-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20 relative border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-xl glow-bkash">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white block leading-none">PayBridge</span>
            <span className="text-[10px] text-pink-400 font-mono">Public Documentation</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          {user ? (
            <Link
              href={user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? '/admin' : '/dashboard'}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-pink-400 text-xs font-bold border border-pink-500/30 flex items-center gap-2"
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} referrerPolicy="no-referrer" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 text-white text-xs font-bold shadow-lg glow-bkash"
              >
                Register Account
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8 relative z-10">
        {/* Banner */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-[#0f172a] to-pink-950/30 relative overflow-hidden shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PayBridge Official Documentation (বাংলা)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            bKash Payment Gateway Integration Guide
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            PayBridge প্ল্যাটফর্মের সম্পূর্ণ সার্বজনীন কারিগরি নির্দেশিকা। যেকানো সাব-মার্চেন্ট, ডেভলপার বা ভিজিটর এখান থেকে bKash Tokenized Checkout API ইন্টিগ্রেশন, ওয়েবহুক ভ্যালিডেশন এবং সিকিউরিটি আর্কিটেকচারের বিস্তারিত জানতে পারবেন।
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: '১. সিস্টেম আর্কিটেকচার', icon: BookOpen },
            { id: 'auth', label: '২. অথেন্টিকেশন ও প্রোফাইল', icon: UserCheck },
            { id: 'api', label: '৩. API পেমেন্ট ইন্টিগ্রেশন', icon: Code2 },
            { id: 'webhooks', label: '৪. ওয়েবহুক ও HMAC সিগনেচার', icon: Webhook },
            { id: 'admin', label: '৫. অ্যাডমিন ক্র্যাডেন্সিয়াল Vault', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white shadow-lg glow-bkash'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Areas */}
        <div className="space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-pink-400" />
                  <span>PayBridge SaaS আর্কিটেকচার কীভাবে কাজ করে?</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  PayBridge হলো একটি Enterprise Multi-Tenant bKash Gateway Wrapper। সাধারণত সরাসরি bKash Tokenized API যুক্ত করার সময় bKash `id_token` রিফ্রেশ করা, AES এনক্রিপশন হ্যান্ডেল করা এবং HMAC সিগনেচার হিসাব করা বেশ জটিল। PayBridge সেই সকল জটিলতা সম্পূর্ণ স্বয়ংক্রিয়ভাবে সম্পন্ন করে সাব-মার্চেন্টদের একটি সরল REST API প্রদান করে।
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs mb-3">
                      01
                    </div>
                    <h3 className="text-sm font-bold text-white">Multi-Tenant Isolation</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      প্রতিটি সাব-মার্চেন্টের নিজস্ব সুরক্ষিত API Key, Webhook Endpoint এবং স্বয়ংসম্পূর্ণ এনালিটিক্স আলাদা থাকে।
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs mb-3">
                      02
                    </div>
                    <h3 className="text-sm font-bold text-white">AES-256-GCM Encryption</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      bKash পাসওয়ার্ড ও App Secret ডাটাবেসে প্লেইন টেক্সট রাখা হয় না; এগুলো AES-256-GCM ব্যাংক-গ্রেড এনক্রিপশনে সুরক্ষিত থাকে।
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
                      03
                    </div>
                    <h3 className="text-sm font-bold text-white">HMAC SHA256 Webhooks</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      পেমেন্ট সফল হওয়ার পরপরই গ্রাহকের সার্ভারে ডিজিটাল সিগনেচারসহ রিয়েলটাইম ইভেন্ট নোটিফিকেশন পাঠানো হয়।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUTH */}
          {activeTab === 'auth' && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-emerald-400" />
                <span>Google OAuth 2.0 ও প্রোফাইল এভাটার সাপোর্ট</span>
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  PayBridge প্ল্যাটফর্মে দ্রুত ও সুরক্ষিতভাবে সাইন ইন করার জন্য **Continue with Google** সুবিধা সংযোজিত রয়েছে।
                </p>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-pink-400 text-sm">১. রিয়েলটাইম Gmail প্রোফাইল পিকচার (Google Avatar)</h3>
                  <p className="text-xs text-slate-400">
                    Google API থেকে স্বয়ংক্রিয়ভাবে ব্যবহারকারীর প্রোফাইল ছবি (`avatarUrl`) সংগ্রহ করা হয় এবং ড্যাশবোর্ড সাইডবার ও ইউজার প্যানেলে সরাসরি লাইভ প্রদর্শন করা হয়।
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-indigo-400 text-sm">২. অ্যাডমিন ইমেইল অটো-রোল অ্যাসাইনমেন্ট</h3>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="font-mono text-pink-300 font-bold">niyamulhasanbd@gmail.com</span>
                      <span className="px-2.5 py-1 rounded-md font-extrabold bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px]">
                        SUPER_ADMIN
                      </span>
                    </li>
                    <li className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="font-mono text-indigo-300 font-bold">niyamulhasan1089@gmail.com</span>
                      <span className="px-2.5 py-1 rounded-md font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px]">
                        ADMIN
                      </span>
                    </li>
                    <li className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="font-mono text-slate-400">অন্যান্য যেকোনো জিমেইল / ইমেইল</span>
                      <span className="px-2.5 py-1 rounded-md font-extrabold bg-slate-800 text-slate-300 text-[10px]">
                        MERCHANT (Default)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: API */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-indigo-400" />
                  <span>Real-World REST API Reference</span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-300">
                  আপনার যেকোনো ই-কমার্স বা সার্ভিস প্ল্যাটফর্ম থেকে bKash পেমেন্ট চার্জ করতে `API Credentials` থেকে সংগৃহীত `Authorization Bearer Key` ব্যবহার করে সার্ভিস পেমেন্ট রিকোয়েস্ট পাঠান:
                </p>

                <div className="p-3.5 rounded-xl bg-slate-900 font-mono text-xs text-pink-300 border border-slate-800 flex items-center justify-between">
                  <span>POST https://paybridge-official.vercel.app/api/v1/payments/create</span>
                  <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded font-bold">Bearer Auth</span>
                </div>

                {/* cURL Example */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono font-bold">cURL Command Example</span>
                    <button
                      onClick={() => copyToClipboard(curlExample, 1)}
                      className="flex items-center gap-1 text-pink-400 hover:text-pink-300 text-xs font-bold"
                    >
                      {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                    {curlExample}
                  </pre>
                </div>

                {/* JavaScript Example */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono font-bold">JavaScript Node.js / Browser Example</span>
                    <button
                      onClick={() => copyToClipboard(jsExample, 2)}
                      className="flex items-center gap-1 text-pink-400 hover:text-pink-300 text-xs font-bold"
                    >
                      {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 2 ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                    {jsExample}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WEBHOOKS */}
          {activeTab === 'webhooks' && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Webhook className="w-6 h-6 text-pink-400" />
                <span>ওয়েবহুক ও HMAC-SHA256 সিগনেচার ভ্যালিডেশন</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                পেমেন্ট সম্পন্ন হলে PayBridge ব্যাকএন্ড থেকে সরাসরি আপনার রেজিস্টার্ড `webhookUrl`-এ ডিজিটাল সাইনড HTTP POST রিকোয়েস্ট পৌঁছায়। সিগনেচার যাচাই করার লাইভ কোড নিচে দেওয়া হলো:
              </p>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <h3 className="font-bold text-white text-sm">Node.js Express Webhook Handler Code</h3>
                <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
{`const crypto = require('crypto');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/paybridge-webhook', (req, res) => {
  const receivedSignature = req.headers['x-paybridge-signature'];
  const webhookSecret = process.env.PAYBRIDGE_WEBHOOK_SECRET; // Your Webhook Secret

  // Re-calculate HMAC SHA-256 Signature
  const calculatedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (receivedSignature !== calculatedSignature) {
    return res.status(401).json({ error: 'Signature verification failed' });
  }

  // Handle Event
  const { event, transactionId, amount, status } = req.body;
  if (event === 'payment.completed') {
    // Process order in your app
    console.log(\`Order Paid Successfully! TRX: \${transactionId}, Amount: \${amount}\`);
  }

  res.status(200).json({ success: true });
});`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: ADMIN VAULT */}
          {activeTab === 'admin' && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-rose-400" />
                <span>অ্যাডমিন ও সুপার অ্যাডমিন ক্র্যাডেন্সিয়াল Vault</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                প্ল্যাটফর্ম সিকিউরিটির জন্য bKash App Key, App Secret, Username এবং Password পরম নিরাপত্তায় এনক্রিপ্ট করে সংরক্ষণ করা হয়।
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h3 className="font-bold text-pink-400 text-sm">bKash Credentials Vault</h3>
                  <p className="text-slate-400 leading-relaxed">
                    সিস্টেম ডিফল্ট `App Key`, `App Secret`, `Username`, `Password` ইনপুট দিলে ব্যাকএন্ডে ইউনিক IV ও Auth Tag তৈরি হয়ে AES-256-GCM এনক্রিপশনের মাধ্যমে ডাটাবেসে সেভ হয়।
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h3 className="font-bold text-indigo-400 text-sm">Environment Mode (Sandbox & Live)</h3>
                  <p className="text-slate-400 leading-relaxed">
                    অ্যাডমিন চাইলে মুহূর্তে টেস্ট মোড (SANDBOX) ও আসল মোড (LIVE)-এর মধ্যে bKash অ্যাকাউন্ট সুইচ করতে পারেন।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-pink-500" />
          <span>PayBridge © {new Date().getFullYear()} - bKash Tokenized Checkout SaaS Engine</span>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-slate-300">Home</Link>
          <Link href="/login" className="hover:text-slate-300">Sign In</Link>
          <Link href="/register" className="hover:text-slate-300">Register Merchant</Link>
        </div>
      </footer>
    </div>
  );
}
