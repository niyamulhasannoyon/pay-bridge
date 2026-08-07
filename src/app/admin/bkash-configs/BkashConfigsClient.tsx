'use client';

import { useState, useEffect } from 'react';
import { Shield, Plus, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface BkashConfigItem {
  id: string;
  appKey: string;
  mode: 'SANDBOX' | 'LIVE';
  isSystemDefault: boolean;
  merchantName: string;
  isActive: boolean;
  createdAt: string;
}

export default function BkashConfigsClient() {
  const [configs, setConfigs] = useState<BkashConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [appKey, setAppKey] = useState('');
  const [appSecret, setAppSecret] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'SANDBOX' | 'LIVE'>('SANDBOX');
  const [isSystemDefault, setIsSystemDefault] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/bkash-configs');
      const data = await res.json();
      if (data.success) {
        setConfigs(data.configs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleCreateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/admin/bkash-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appKey,
          appSecret,
          username,
          password,
          mode,
          isSystemDefault,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        setAppKey('');
        setAppSecret('');
        setUsername('');
        setPassword('');
        fetchConfigs();
      } else {
        setError(data.error || 'Failed to save bKash configuration.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-pink-500" /> Configured bKash Accounts
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-lg glow-bkash flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add bKash Account Credentials</span>
        </button>
      </div>

      {/* Table of configured accounts */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Account Owner</th>
                <th className="py-3 px-4">bKash App Key</th>
                <th className="py-3 px-4">Environment</th>
                <th className="py-3 px-4">Default Account</th>
                <th className="py-3 px-4">AES-256 Encryption</th>
                <th className="py-3 px-4">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading bKash configurations...</td>
                </tr>
              ) : configs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">No bKash API credentials added yet. Using default Sandbox fallback.</td>
                </tr>
              ) : (
                configs.map((cfg) => (
                  <tr key={cfg.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{cfg.merchantName}</td>
                    <td className="py-3.5 px-4 font-mono text-pink-400">{cfg.appKey}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cfg.mode === 'LIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {cfg.mode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {cfg.isSystemDefault ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> YES
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">NO</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] text-indigo-400 font-mono flex items-center gap-1">
                        <Lock className="w-3 h-3 text-indigo-400" /> AES-256-GCM
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(cfg.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Credential Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-pink-500" /> Save bKash API Credentials
            </h3>

            {error && (
              <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateConfig} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Environment Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'SANDBOX' | 'LIVE')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                >
                  <option value="SANDBOX">SANDBOX (Test Mode)</option>
                  <option value="LIVE">LIVE (Production Mode)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">bKash App Key</label>
                <input
                  type="text"
                  required
                  placeholder="Enter bKash App Key"
                  value={appKey}
                  onChange={(e) => setAppKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">bKash App Secret</label>
                <input
                  type="password"
                  required
                  placeholder="Enter bKash App Secret"
                  value={appSecret}
                  onChange={(e) => setAppSecret(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">bKash Merchant Username</label>
                <input
                  type="text"
                  required
                  placeholder="Enter bKash Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">bKash Merchant Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter bKash Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sysDef"
                  checked={isSystemDefault}
                  onChange={(e) => setIsSystemDefault(e.target.checked)}
                  className="rounded border-slate-700 text-pink-600 focus:ring-pink-500"
                />
                <label htmlFor="sysDef" className="text-xs text-slate-300">Set as System Default for {mode} Mode</label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? 'Encrypting & Saving...' : 'Save Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
