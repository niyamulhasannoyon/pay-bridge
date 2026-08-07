import WebhooksClient from './WebhooksClient';

export const revalidate = 0;

export default function WebhooksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Webhook & Callback Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure reliable webhook endpoints to receive real-time payment state updates signed with HMAC-SHA256.</p>
      </div>

      <WebhooksClient />
    </div>
  );
}
