'use client';

import { useState } from 'react';
import { UserSessionPayload } from '@/lib/auth/jwt';
import {
  BookOpen,
  Zap,
  KeyRound,
  ShieldCheck,
  Webhook,
  Code2,
  UserCheck,
  Server,
  CreditCard,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function DocsClient({ user }: { user: UserSessionPayload }) {
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
  // Redirect Customer to PayBridge Checkout Page
  window.location.href = data.checkoutUrl;
}`;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-[#0f172a] to-pink-950/20 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PayBridge SaaS System Documentation (বাংলা)</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              PayBridge bKash Payment Gateway
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              PayBridge প্ল্যাটফর্মের সম্পূর্ণ কারিগরি নির্দেশিকা, API রেফারেন্স, সিকিউরিটি আর্কিটেকচার এবং অ্যাডমিন কন্ট্রোল সিস্টেমের বিস্তারিত ডকুমেন্টেশন।
            </p>
          </div>

          {/* Logged in User Profile Pill */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/80 flex items-center gap-3.5 shrink-0 shadow-lg">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-12 h-12 rounded-full border-2 border-pink-500/60 object-cover shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base border border-pink-500/40 shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate max-w-[150px]">{user.name}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Realtime Google Profile Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: '১. সিস্টেম ওভারভিউ', icon: BookOpen },
          { id: 'auth', label: '২. প্রোফাইল ও সিকিউরিটি', icon: UserCheck },
          { id: 'api', label: '৩. API ইন্টিগ্রেশন', icon: Code2 },
          { id: 'webhooks', label: '৪. ওয়েবহুক ও সিকিউরিটি', icon: Webhook },
          { id: 'admin', label: '৫. অ্যাডমিন কনফিগারেশন', icon: ShieldCheck },
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

      {/* Tab Content */}
      <div className="space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-pink-400" />
                <span>PayBridge SaaS আর্কিটেকচার কী?</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                PayBridge হলো একটি অত্যাধুনিক Multi-Tenant bKash Payment Gateway SaaS প্ল্যাটফর্ম। এর মাধ্যমে বিভিন্ন সাব-মার্চেন্ট (Sub-Merchants) কোনো জটিল bKash API সরাসরি কোড না করেই নিজেদের ই-কমার্স বা ওয়েবসাইটে bKash পেমেন্ট যুক্ত করতে পারেন।
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs mb-2">
                    01
                  </div>
                  <h3 className="text-xs font-bold text-white">Multi-Tenant Isolation</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    প্রতিটি মার্চেন্টের আলাদা API Keys, Webhook URL, এবং আলাদা লেনদেন হিস্ট্রি সুরক্ষিত থাকে।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs mb-2">
                    02
                  </div>
                  <h3 className="text-xs font-bold text-white">AES-256-GCM Encryption</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    bKash App Secret, Passwords সহ সকল স্পর্শকাতর ডাটা ব্যাংক-লেভেল অ্যালগরিদমে এনক্রিপ্টেড থাকে।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs mb-2">
                    03
                  </div>
                  <h3 className="text-xs font-bold text-white">HMAC SHA256 Webhooks</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    পেমেন্ট সফল হওয়ার সাথে সাথে মার্চেন্ট সার্ভারে নিরাপদ সাইনড ওয়েবহুক নোটিফিকেশন পাঠানো হয়।
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">সিস্টেম সিকোয়েন্স ফ্লো (Transaction Flow)</h3>
              <ol className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold text-[10px] shrink-0 mt-0.5">১</span>
                  <span>মার্চেন্ট সার্ভার থেকে `/api/v1/payments/create` এন্ডপয়েন্টে Authorization Bearer Key সহ রিকোয়েস্ট পাঠানো হয়।</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold text-[10px] shrink-0 mt-0.5">২</span>
                  <span>PayBridge একটি ইউনিক Transaction Token জেনারেট করে এবং ব্রাউজারকে PayBridge Checkout UI-তে রিডাইরেক্ট করে।</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold text-[10px] shrink-0 mt-0.5">৩</span>
                  <span>গ্রাহক bKash পেমেন্ট সম্পন্ন করলে PayBridge ব্যাকএন্ড bKash API এর সাথে ভ্যালিডেশন চালায়।</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold text-[10px] shrink-0 mt-0.5">৪</span>
                  <span>পেমেন্ট সফল হলে গ্রাহককে মার্চেন্টের `callbackUrl`-এ ফেরত পাঠানো হয় এবং মার্চেন্টের `webhookUrl`-এ সাইনড পেলোড পাঠানো হয়।</span>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* TAB 2: AUTH & PROFILE */}
        {activeTab === 'auth' && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>গুগল অথেন্টিকেশন ও প্রোফাইল ব্যবস্থাপনা</span>
            </h2>

            <div className="space-y-4 text-xs text-slate-300">
              <p>
                PayBridge প্ল্যাটফর্মে Google OAuth 2.0 সমর্থন সুবিধা রয়েছে। যখন একজন ব্যবহারকারী Google দিয়ে সাইন ইন করেন:
              </p>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="font-bold text-pink-400">১. অটোমেটিক জিমেইল প্রোফাইল ও এভাটার (Profile Picture)</h3>
                <p className="text-slate-400">
                  Google API থেকে ব্যবহারকারীর পুরো নাম (`name`), ইমেইল ঠিকানা (`email`) এবং Google প্রোফাইল ছবি (`picture`) রিয়েলটাইমে সংগ্রহ করে ডাটাবেসে ও জেসন ওয়েব টোকেনে (`JWT`) যুক্ত করা হয়।
                </p>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-pink-500" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center font-bold text-white">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-white">{user.name} (Your Current Account)</p>
                    <p className="text-[11px] text-slate-400">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="font-bold text-indigo-400">২. এডমিন ও সুপার এডমিন ইমেইল অটো-এসাইনমেন্ট</h3>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between p-2 rounded bg-slate-950">
                    <span className="font-mono text-pink-300">niyamulhasanbd@gmail.com</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40">
                      SUPER_ADMIN
                    </span>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded bg-slate-950">
                    <span className="font-mono text-indigo-300">niyamulhasan1089@gmail.com</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      ADMIN
                    </span>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded bg-slate-950">
                    <span className="font-mono text-slate-400">অন্যান্য যেকোনো জিমেইল / ইমেইল</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      MERCHANT (Default)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: API INTEGRATION */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <span>API Integration Reference</span>
              </h2>

              <p className="text-xs text-slate-300">
                আপনার ওয়েবসাইট থেকে পেমেন্ট তৈরি করতে `API Credentials` মেনু থেকে আপনার `SANDBOX` অথবা `LIVE` API Key সংগ্রহ করুন এবং নিচের এন্ডপয়েন্টে রিকোয়েস্ট পাঠান:
              </p>

              <div className="p-3 rounded-xl bg-slate-900 font-mono text-xs text-pink-300 border border-slate-800 flex items-center justify-between">
                <span>POST /api/v1/payments/create</span>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded">Bearer Auth Required</span>
              </div>

              {/* cURL Code Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono">cURL Example</span>
                  <button
                    onClick={() => copyToClipboard(curlExample, 1)}
                    className="flex items-center gap-1 text-pink-400 hover:text-pink-300 text-xs font-semibold"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
                  {curlExample}
                </pre>
              </div>

              {/* JavaScript Code Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono">JavaScript Fetch Example</span>
                  <button
                    onClick={() => copyToClipboard(jsExample, 2)}
                    className="flex items-center gap-1 text-pink-400 hover:text-pink-300 text-xs font-semibold"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === 2 ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
                  {jsExample}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WEBHOOKS */}
        {activeTab === 'webhooks' && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Webhook className="w-5 h-5 text-pink-400" />
              <span>ওয়েবহুক ও ডিজিটাল সিগনেচার ভ্যালিডেশন</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              পেমেন্ট সফল বা ব্যর্থ হওয়ার সাথে সাথে PayBridge সিস্টেম আপনার সাব-মার্চেন্ট `webhookUrl`-এ একটি সাইনড HTTP POST রিকোয়েস্ট পাঠায়। রিকোয়েস্টের সাথে `X-PayBridge-Signature` হেডার সংযুক্ত থাকে।
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-white">ওয়েবহুক পেলোড ভ্যালিডেশন কোড (Node.js/Express)</h3>
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
{`const crypto = require('crypto');

app.post('/api/paybridge-webhook', (req, res) => {
  const receivedSignature = req.headers['x-paybridge-signature'];
  const webhookSecret = 'YOUR_MERCHANT_WEBHOOK_SECRET'; // Found in Dashboard

  // Re-calculate HMAC SHA-256 signature
  const calculatedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (receivedSignature !== calculatedSignature) {
    return res.status(401).send('Invalid webhook signature');
  }

  // Handle transaction status
  const { event, transactionId, amount, status } = req.body;
  if (event === 'payment.completed') {
    // Fulfill order in your database
    console.log(\`Payment SUCCESS for transaction: \${transactionId}\`);
  }

  res.status(200).send({ received: true });
});`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN CONFIGS */}
        {activeTab === 'admin' && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
              <span>অ্যাডমিন ও সুপার অ্যাডমিন কনফিগারেশন প্যানেল</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              পদ্ধতিগত নিরাপত্তা নিশ্চিত করতে `SUPER_ADMIN` এবং `ADMIN` ব্যবহারকারীরা সরাসরি সিস্টেম ডিফল্ট bKash অ্যাপ ক্রেডেনশিয়াল সেট করতে পারেন।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h3 className="font-bold text-pink-400">bKash App Credentials Vault</h3>
                <p className="text-slate-400 text-[11px]">
                  সিস্টেম ডিফল্ট `App Key`, `App Secret`, `Username`, `Password` ইনপুট দিলে ব্যাকএন্ডে র্যান্ডম IV ও Auth Tag তৈরি হয়ে AES-256-GCM এনক্রিপশনের মাধ্যমে ডাটাবেসে সেভ হয়।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h3 className="font-bold text-indigo-400">Environment Mode (Sandbox & Live)</h3>
                <p className="text-slate-400 text-[11px]">
                  অ্যাডমিন চাইলেই মুহূর্তে টেস্ট মোড (SANDBOX) ও আসল মোড (LIVE)-এর মধ্যে bKash অ্যাকাউন্ট সুইচ করতে পারেন।
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
