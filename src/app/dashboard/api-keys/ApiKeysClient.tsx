'use client';

import { useState, useEffect } from 'react';
import { KeyRound, Plus, Copy, Check, Trash2, ShieldAlert, Code } from 'lucide-react';

interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  mode: 'SANDBOX' | 'LIVE';
  isRevoked: boolean;
  lastUsedAt: string | null;
  createdAt: string;
}

export default function ApiKeysClient() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [keyMode, setKeyMode] = useState<'SANDBOX' | 'LIVE'>('SANDBOX');
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/merchant/api-keys');
      const data = await res.json();
      if (data.success) {
        setKeys(data.keys);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;

    try {
      const res = await fetch('/api/v1/merchant/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName, mode: keyMode }),
      });
      const data = await res.json();

      if (data.success) {
        setCreatedSecret(data.rawApiKey);
        setShowModal(false);
        setKeyName('');
        fetchKeys();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? Applications using it will lose access immediately.')) return;

    try {
      await fetch(`/api/v1/merchant/api-keys?id=${id}`, { method: 'DELETE' });
      fetchKeys();
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* New Key Generated Alert Banner */}
      {createdSecret && (
        <div className="glass-panel p-5 rounded-2xl border-2 border-pink-500/80 bg-pink-950/40 text-slate-100 shadow-2xl relative">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">Save Your API Key Secret Immediately</h3>
              <p className="text-xs text-slate-300 mt-1">
                This API secret key will <strong>NEVER</strong> be displayed again for security reasons. Copy and store it securely in your environment variables.
              </p>

              <div className="mt-3 flex items-center gap-2">
                <code className="px-3 py-2 rounded-lg bg-slate-900 font-mono text-xs text-pink-300 border border-slate-700 flex-1 truncate">
                  {createdSecret}
                </code>
                <button
                  onClick={() => copyToClipboard(createdSecret)}
                  className="px-3 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Key'}</span>
                </button>
              </div>
            </div>
            <button
              onClick={() => setCreatedSecret(null)}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header action button */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-pink-500" /> Active API Keys
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg glow-bkash flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New API Key</span>
        </button>
      </div>

      {/* Keys Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Key Name</th>
                <th className="py-3 px-4">Prefix</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Last Used</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading API Keys...</td>
                </tr>
              ) : keys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">No API keys generated yet. Click above to generate your first key.</td>
                </tr>
              ) : (
                keys.map((key) => (
                  <tr key={key.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{key.name}</td>
                    <td className="py-3.5 px-4 font-mono text-pink-400">{key.keyPrefix}****************</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        key.mode === 'LIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {key.mode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Never'}</td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(key.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      {key.isRevoked ? (
                        <span className="text-[10px] text-rose-400 font-bold uppercase">Revoked</span>
                      ) : (
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Code Snippet Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Code className="w-4 h-4 text-indigo-400" />
          Integration Quick-Start Snippet
        </h3>
        <p className="text-xs text-slate-400">Call PayBridge REST API from your Node.js, Python, Laravel, or Next.js backend using your API Key:</p>

        <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800">
          <pre>{`// Example Payment Initiation Request
const response = await fetch('http://localhost:3000/api/v1/payments/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'pb_test_YOUR_API_KEY_SECRET'
  },
  body: JSON.stringify({
    amount: 500.00,
    merchantInvoiceNumber: 'INV-1002',
    callbackUrl: 'https://your-website.com/checkout/callback'
  })
});

const data = await response.json();
// Redirect user to Hosted Checkout: window.location.href = data.paymentUrl;`}</pre>
        </div>
      </div>

      {/* Create Key Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Generate Sub-Merchant API Key</h3>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Key Description / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Production Web Backend Key"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Environment Mode</label>
                <select
                  value={keyMode}
                  onChange={(e) => setKeyMode(e.target.value as 'SANDBOX' | 'LIVE')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                >
                  <option value="SANDBOX">SANDBOX (Test Mode)</option>
                  <option value="LIVE">LIVE (Production Mode)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold"
                >
                  Generate Key Pair
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
