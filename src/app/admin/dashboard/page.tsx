import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getAdminStats } from '@/lib/data';
import { Users, CalendarDays, CalendarRange, UserCog, ArrowRight } from 'lucide-react';

export const metadata = { title: 'Admin Dashboard · Syed Hospital' };

export default async function AdminDashboard() {
  const session = await auth();
  const stats = await getAdminStats();

  const cards = [
    { label: 'Total Patients', value: stats.total, icon: Users },
    { label: 'Registered Today', value: stats.today, icon: CalendarDays },
    { label: 'This Month', value: stats.month, icon: CalendarRange },
    { label: 'Active Staff', value: stats.staff, icon: UserCog },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">
          Welcome back, {session?.user?.name ?? 'Admin'}
        </h1>
        <p className="text-slate-500 mt-1">Here&apos;s an overview of the hospital records.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-[#2E5FA3]" />
              </div>
              <p className="text-3xl font-extrabold font-heading text-[#1E3A6E]">{c.value}</p>
              <p className="text-sm text-slate-500 mt-1">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Link
          href="/admin/patients"
          className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
        >
          <div>
            <p className="font-bold text-[#1E3A6E]">Manage Patients</p>
            <p className="text-sm text-slate-500 mt-1">Search, view, and archive records</p>
          </div>
          <ArrowRight className="h-5 w-5 text-[#2E5FA3]" />
        </Link>
        <Link
          href="/admin/staff"
          className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
        >
          <div>
            <p className="font-bold text-[#1E3A6E]">Staff Accounts</p>
            <p className="text-sm text-slate-500 mt-1">Create and manage receptionist logins</p>
          </div>
          <ArrowRight className="h-5 w-5 text-[#2E5FA3]" />
        </Link>
      </div>
    </div>
  );
}