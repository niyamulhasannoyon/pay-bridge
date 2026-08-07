import { redirect } from 'next/navigation';
import { verifyJwtToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
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

  return <AdminDashboardClient user={payload} />;
}
