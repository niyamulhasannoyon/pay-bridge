import Link from 'next/link';
import { Zap, ShieldCheck, KeyRound, Webhook, CreditCard, ArrowRight, Code2, Server, Cpu, CheckCircle, BookOpen } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 relative overflow-hidden font-sans">
      {/* Background Glow Orbs */}
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Navigation Bar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20 relative">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-xl glow-bkash">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white block leading-none">PayBridge</span>
            <span className="text-[10px] text-pink-400 font-mono">Multi-Gateway SaaS</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/docs"
            className="text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30"
          >
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            <span>Documentation (বাংলা)</span>
          </Link>

          <Link href="/login" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg glow-bkash transition-all flex items-center gap-1.5"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-950/60 border border-pink-500/30 text-xs font-medium text-pink-300">
          <Zap className="w-4 h-4 text-pink-400" />
          bKash, Nagad, Rocket & Bank Payment Gateway Wrapper
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Accept MFS & Bank Payments Anywhere <br className="hidden sm:inline" />
          <span className="gradient-text">bKash, Nagad, Rocket & Bank Gateway</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          PayBridge is an enterprise multi-tenant payment gateway wrapper supporting <span className="text-pink-400 font-semibold">bKash</span>, <span className="text-orange-400 font-semibold">Nagad</span>, <span className="text-purple-400 font-semibold">Rocket</span>, and upcoming <span className="text-cyan-400 font-semibold">Bank Transfers</span>. Use it for your own apps or offer multi-channel payment processing with automated token caching, HMAC webhooks, and fee markups.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm shadow-xl glow-bkash transition-all flex items-center justify-center gap-2"
          >
            <span>Register Merchant Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/docs"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-pink-300 font-semibold text-sm border border-pink-500/30 flex items-center justify-center gap-2 transition-all"
          >
            <BookOpen className="w-4 h-4 text-pink-400" />
            <span>Public Documentation (বাংলা)</span>
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
          >
            Sub-Merchant Portal
          </Link>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-600/10 text-pink-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Automated Token Manager</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic Redis caching and silent token renewal for bKash <code className="text-pink-300 font-mono">id_token</code> before the 1-hour expiration window.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center">
              <Webhook className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Signed Webhook Dispatcher</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every payment state change triggers an HMAC-SHA256 signed HTTP POST webhook to merchant endpoints with exponential backoff retries.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AES-256 Encrypted Vault</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              bKash merchant credentials (<code className="text-slate-300 font-mono">app_secret</code>, password) are encrypted at rest using AES-256-GCM.
            </p>
          </div>
        </div>
      </section>

      {/* Code Snippet Demonstration */}
      <section className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-pink-400" />
              <h3 className="text-sm font-bold text-white">Unified REST API Integration</h3>
            </div>
            <span className="text-[11px] text-pink-400 font-mono">POST /api/v1/payments/create</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed">
            <pre>{`// Initiate bKash Payment from Sub-Merchant App
const res = await fetch('https://paybridge-official.vercel.app/api/v1/payments/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_MERCHANT_API_KEY' // Found in Sub-Merchant Dashboard
  },
  body: JSON.stringify({
    amount: 1250.00,
    merchantInvoiceNo: 'INV-2026-98214',
    callbackUrl: 'https://yourdomain.com/payment/callback'
  })
});

const data = await res.json();
// Redirect customer to PayBridge Hosted Checkout URL: data.checkoutUrl`}</pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-pink-500" />
          <span>PayBridge © {new Date().getFullYear()} - bKash Tokenized Checkout Wrapper Platform</span>
        </div>
        <div className="flex gap-4">
          <Link href="/docs" className="hover:text-pink-300 text-pink-400 font-bold">Documentation (বাংলা)</Link>
          <Link href="/login" className="hover:text-slate-300">Sign In</Link>
          <Link href="/register" className="hover:text-slate-300">Register Merchant</Link>
        </div>
      </footer>
    </div>
  );
}
