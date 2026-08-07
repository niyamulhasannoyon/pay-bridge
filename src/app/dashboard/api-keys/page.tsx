import ApiKeysClient from './ApiKeysClient';

export const revalidate = 0;

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Merchant API Credentials</h1>
        <p className="text-xs text-slate-400 mt-1">Manage API Keys for integrating PayBridge Gateway API into your websites, SDKs, and mobile apps.</p>
      </div>

      <ApiKeysClient />
    </div>
  );
}
