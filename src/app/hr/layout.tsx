import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import HRSidebar from '@/components/hr/Sidebar';
import MobileShell from '@/components/shared/MobileShell';

export default async function HRLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'HR' && session.user.role !== 'ADMIN') {
    redirect('/reception/dashboard');
  }
  return (
    <MobileShell sidebar={<HRSidebar userName={session.user.name ?? 'HR'} role={session.user.role} />}>
      {children}
    </MobileShell>
  );
}