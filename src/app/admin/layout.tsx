import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyJwtToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db/prisma';
import AdminSidebar from './AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('paybridge_session')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = await verifyJwtToken(token);
  if (!payload) {
    redirect('/login');
  }

  // Restrict access: Only SUPER_ADMIN and ADMIN can access /admin routes
  if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Fetch freshest user data including avatarUrl directly from Database
  const dbUser = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { name: true, email: true, role: true, avatarUrl: true },
  });

  const currentUser = {
    ...payload,
    name: dbUser?.name || payload.name,
    avatarUrl: dbUser?.avatarUrl || payload.avatarUrl || null,
    role: dbUser?.role || payload.role,
  };

  return (
    <div className="min-h-screen bg-[#070911] text-slate-100 flex flex-col md:flex-row">
      {/* Admin Dedicated Sidebar */}
      <AdminSidebar user={currentUser} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
