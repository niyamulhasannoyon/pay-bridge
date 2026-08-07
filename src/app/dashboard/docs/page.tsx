import { redirect } from 'next/navigation';
import { verifyJwtToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';
import DocsClient from './DocsClient';

export default async function DocsPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('paybridge_session')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = await verifyJwtToken(token);
  if (!payload) {
    redirect('/login');
  }

  return <DocsClient user={payload} />;
}
