import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getAdminStats } from '@/lib/data';
import { Users, CalendarDays, CalendarRange, UserCog, ArrowRight, Bell } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata = { title: 'Admin Dashboard · Syed Hospital' };

export default async function AdminDashboard() {
  const session = await auth();
  const stats = await getAdminStats();

  const hrNotifications = await prisma.licenseNotification.findMany({
    where: { isRead: false },
    include: { license: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

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

      {/* HR Notifications from license manager */}
      {hrNotifications.length > 0 && (
        <div className="mb-6 bg-amber-50 ring-1 ring-amber-200 rounded-2xl p-5">
          <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-600" />
            HR Notifications ({hrNotifications.length} unread)
          </h3>
          <div className="space-y-2">
            {hrNotifications.map((n) => (
              <div key={n.id} className="bg-white rounded-xl p-3 ring-1 ring-amber-100 text-sm">
                <p className="font-medium text-slate-800">{n.license.name}</p>
                <p className="text-slate-600 mt-0.5">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(n.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Karachi' })}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-700 mt-3">
            These notifications were sent by HR. Go to the HR portal to manage licenses.
          </p>
        </div>
      )}

      {/* Stat cards */}
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

      {/* Quick links */}
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
        <Link
          href="/hr/dashboard"
          className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
        >
          <div>
            <p className="font-bold text-[#1E3A6E]">HR Portal</p>
            <p className="text-sm text-slate-500 mt-1">Licenses, attendance, and staff records</p>
          </div>
          <ArrowRight className="h-5 w-5 text-[#2E5FA3]" />
        </Link>
        <Link
          href="/admin/staff/hire"
          className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
        >
          <div>
            <p className="font-bold text-[#1E3A6E]">Hospital Staff</p>
            <p className="text-sm text-slate-500 mt-1">Hire and manage employed staff</p>
          </div>
          <ArrowRight className="h-5 w-5 text-[#2E5FA3]" />
        </Link>
      </div>
    </div>
  );
}