import BkashConfigsClient from './BkashConfigsClient';

export const revalidate = 0;

export default function BkashConfigsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">System bKash API Credentials</h1>
        <p className="text-xs text-slate-400 mt-1">Super-Admin Panel to configure system-wide bKash Tokenized Checkout credentials (encrypted at rest with AES-256-GCM).</p>
      </div>

      <BkashConfigsClient />
    </div>
  );
}
