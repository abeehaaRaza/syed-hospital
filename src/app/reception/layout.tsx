import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/reception/Sidebar';

export default async function ReceptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        userName={session.user.name ?? 'Staff'}
        role={session.user.role === 'ADMIN' ? 'Administrator' : 'Receptionist'}
      />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}