import Link from 'next/link';
import { Zap, ShieldCheck, Webhook, Cpu, ArrowRight, BookOpen, Lock, Server } from 'lucide-react';
import HeaderNavbar from '@/components/landing/HeaderNavbar';
import LiveCheckoutPreview from '@/components/landing/LiveCheckoutPreview';
import BrandLogosBar from '@/components/landing/BrandLogosBar';
import SecurityComplianceBar from '@/components/landing/SecurityComplianceBar';
import TabbedCodeSwitcher from '@/components/landing/TabbedCodeSwitcher';
import PricingSection from '@/components/landing/PricingSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 relative overflow-hidden font-sans bg-grid-pattern">
      {/* Background Depth Ambient Glow Orbs */}
      <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Header Navbar */}
      <HeaderNavbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
          
          {/* Left Column: Headline, Value Prop & Focused CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-950/60 border border-pink-500/30 text-xs font-medium text-pink-300 backdrop-blur-md shadow-md">
              <Zap className="w-4 h-4 text-pink-400" />
              <span>Multi-Gateway Payment Infrastructure for Bangladesh</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Accept MFS & Bank Payments Anywhere <br />
              <span className="gradient-text">bKash, Nagad, Rocket & Bank Gateway</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
              PayBridge is an enterprise multi-tenant payment gateway wrapper supporting <span className="text-pink-400 font-semibold">bKash</span>, <span className="text-orange-400 font-semibold">Nagad</span>, <span className="text-purple-400 font-semibold">Rocket</span>, and <span className="text-cyan-400 font-semibold">Bank Transfers</span>. Automate token caching, HMAC webhooks, and sub-merchant fees in one unified API.
            </p>

            {/* Streamlined Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/register"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl glow-bkash transition-all flex items-center justify-center gap-2"
              >
                <span>Start Integrating</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/docs"
                className="px-8 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-pink-300 font-semibold text-sm border border-pink-500/30 flex items-center justify-center gap-2 transition-all"
              >
                <BookOpen className="w-4 h-4 text-pink-400" />
                <span>View Documentation</span>
              </Link>
            </div>

            {/* Fast Stats / Setup Trust Callout */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>5-Minute SDK Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                <span>Automated Redis Caching</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>Signed Webhooks</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Product Preview */}
          <div className="lg:col-span-5 w-full">
            <LiveCheckoutPreview />
          </div>

        </div>
      </section>

      {/* Official Brand Logos Strip */}
      <BrandLogosBar />

      {/* Security & Compliance Trust Bar */}
      <SecurityComplianceBar />

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 glass-card-hover">
            <div className="w-10 h-10 rounded-xl bg-pink-600/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Automated Token Manager</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic Redis caching and silent token renewal for bKash <code className="text-pink-300 font-mono">id_token</code> before the 1-hour expiration window.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 glass-card-hover">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Webhook className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Signed Webhook Dispatcher</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every payment state change triggers an HMAC-SHA256 signed HTTP POST webhook to merchant endpoints with exponential backoff retries.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 glass-card-hover">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AES-256 Encrypted Vault</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              bKash merchant credentials (<code className="text-slate-300 font-mono">app_secret</code>, password) are encrypted at rest using AES-256-GCM.
            </p>
          </div>
        </div>
      </section>

      {/* Developer Experience Code Switcher */}
      <TabbedCodeSwitcher />

      {/* Pricing & Fee Section */}
      <PricingSection />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-pink-500 fill-pink-500" />
          <span>PayBridge © {new Date().getFullYear()} - Enterprise Payment Gateway Wrapper SaaS</span>
        </div>
        <div className="flex gap-6">
          <Link href="/docs" className="hover:text-pink-300 text-pink-400 font-bold transition-colors">Documentation</Link>
          <Link href="/login" className="hover:text-slate-300 transition-colors">Merchant Sign In</Link>
          <Link href="/register" className="hover:text-slate-300 transition-colors">Register Account</Link>
        </div>
      </footer>
    </div>
  );
}
