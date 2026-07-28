import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/reception/dashboard');

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar userName={session.user.name ?? 'Admin'} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}