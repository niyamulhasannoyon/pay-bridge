import { cookies } from 'next/headers';
import { verifyJwtToken } from '@/lib/auth/jwt';
import DocsPublicClient from './DocsPublicClient';

export default async function PublicDocsPage() {
  const token = cookies().get('paybridge_session')?.value;
  let user = null;

  if (token) {
    user = await verifyJwtToken(token);
  }

  return <DocsPublicClient user={user} />;
}
