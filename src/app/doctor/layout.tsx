
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DoctorSidebar from '@/components/doctor/Sidebar';
import MobileShell from '@/components/shared/MobileShell';

export default async function DoctorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'DOCTOR' && session.user.role !== 'ADMIN') {
    redirect('/reception/dashboard');
  }

  return (
    <MobileShell
      sidebar={
        <DoctorSidebar
          userName={session.user.name ?? 'Doctor'}
          specialty={session.user.specialty ?? 'Consultant'}
          role={session.user.role}
        />
      }
    >
      {children}
    </MobileShell>
  );
}