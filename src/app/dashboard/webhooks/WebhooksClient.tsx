'use client';

import { useState, useEffect } from 'react';
import { Webhook, Send, ShieldCheck, RefreshCw, Copy, Check, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface WebhookLogItem {
  id: string;
  event: string;
  endpointUrl: string;
  httpStatus: number | null;
  attemptCount: number;
  status: 'PENDING' | 'DELIVERED' | 'FAILED';
  responseBody: string | null;
  createdAt: string;
  transaction: {
    transactionId: string;
    merchantInvoiceNo: string;
    amount: number;
  };
}

export default function WebhooksClient() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [logs, setLogs] = useState<WebhookLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const fetchWebhookData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/merchant/webhooks');
      const data = await res.json();
      if (data.success) {
        setWebhookUrl(data.webhookUrl || '');
        setWebhookSecret(data.webhookSecret || '');
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhookData();
  }, []);

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/v1/merchant/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setWebhookUrl(data.webhookUrl);
        alert('Webhook URL saved successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateSecret = async () => {
    if (!confirm('Regenerate Webhook Secret? You will need to update the signature verification key in your backend.')) return;
    try {
      const res = await fetch('/api/v1/merchant/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regenerateSecret: true }),
      });
      const data = await res.json();
      if (data.success) {
        setWebhookSecret(data.webhookSecret);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestSimulator = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/v1/merchant/webhooks', { method: 'PUT' });
      const data = await res.json();
      setTestResult(data.dispatchResult);
      fetchWebhookData();
    } catch (err) {
      console.error(err);
    } finally {
      setTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Settings Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Webhook className="w-4 h-4 text-pink-500" /> Webhook Configuration
        </h2>

        <form onSubmit={handleSaveWebhook} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Webhook Endpoint URL (HTTPS Preferred)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                placeholder="https://your-website.com/api/webhooks/paybridge"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500 font-mono"
              />
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md transition-all shrink-0"
              >
                {saving ? 'Saving...' : 'Save Webhook URL'}
              </button>
            </div>
          </div>
        </form>

        {/* Webhook Secret Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> HMAC-SHA256 Signing Secret
            </span>
            <button
              onClick={handleRegenerateSecret}
              className="text-[11px] text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Regenerate Secret
            </button>
          </div>

          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-lg bg-slate-950 font-mono text-xs text-pink-300 border border-slate-800 truncate">
              {webhookSecret || 'No secret generated'}
            </code>
            <button
              onClick={() => copyToClipboard(webhookSecret)}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            PayBridge includes a header <code className="text-slate-300 font-mono">x-paybridge-signature</code> on every webhook POST request signed using this secret.
          </p>
        </div>

        {/* Test Simulator Trigger */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
          <div>
            <h4 className="text-xs font-bold text-white">Test Webhook Integration</h4>
            <p className="text-[11px] text-slate-400">Send a test HTTP POST event to your webhook URL with signed headers.</p>
          </div>
          <button
            onClick={handleTestSimulator}
            disabled={testing || !webhookUrl}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{testing ? 'Dispatching Test...' : 'Send Test Webhook'}</span>
          </button>
        </div>

        {testResult && (
          <div className={`p-3 rounded-xl border text-xs ${testResult.success ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300' : 'bg-rose-950/50 border-rose-800 text-rose-300'}`}>
            {testResult.success ? (
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Test Webhook Delivered Successfully! HTTP Response Code: 200 OK
              </span>
            ) : (
              <span className="flex items-center gap-2 font-medium">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                Test Delivery Scheduled for Retry. Check server connectivity or webhook URL.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Webhook Delivery Logs Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" /> Webhook Dispatch Logs
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Endpoint</th>
                <th className="py-3 px-4">HTTP Status</th>
                <th className="py-3 px-4">Attempts</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dispatched At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading Webhook Logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">No webhook logs dispatched yet. Use the test simulator above.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-pink-400">{log.event}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300 truncate max-w-xs">{log.endpointUrl}</td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {log.httpStatus ? (
                        <span className={log.httpStatus >= 200 && log.httpStatus < 300 ? 'text-emerald-400' : 'text-rose-400'}>
                          {log.httpStatus}
                        </span>
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{log.attemptCount} / 5</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        log.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
