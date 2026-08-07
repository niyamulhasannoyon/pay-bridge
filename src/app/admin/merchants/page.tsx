import { redirect } from 'next/navigation';
import { verifyJwtToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';
import MerchantsClient from './MerchantsClient';

export default async function AdminMerchantsPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('paybridge_session')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = await verifyJwtToken(token);
  if (!payload) {
    redirect('/login');
  }

  if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return <MerchantsClient user={payload} />;
}
