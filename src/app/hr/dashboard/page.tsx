import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { FileCheck, Users, CalendarCheck, AlertTriangle, ArrowRight } from 'lucide-react';

export const metadata = { title: 'HR Dashboard · Syed Hospital' };

export default async function HRDashboard() {
  const session = await auth();

  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const [totalLicenses, expiringLicenses, totalEmployees, todayAttendance] = await Promise.all([
    prisma.hospitalLicense.count(),
    prisma.hospitalLicense.count({
      where: {
        expiryDate: { lte: thirtyDaysFromNow, gte: today },
      },
    }),
    prisma.employee.count({ where: { isActive: true } }),
    prisma.attendance.count({
      where: {
        date: today.toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' }),
      },
    }),
  ]);

  const unreadNotifications = await prisma.licenseNotification.findMany({
    where: { isRead: false },
    include: { license: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">
          HR Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Welcome, {session?.user?.name ?? 'HR Officer'}</p>
      </div>

      {expiringLicenses > 0 && (
        <Link href="/hr/licenses" className="block bg-red-50 ring-1 ring-red-200 rounded-2xl p-4 mb-6 hover:bg-red-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-bold text-red-800">{expiringLicenses} license{expiringLicenses !== 1 ? 's' : ''} expiring within 30 days</p>
              <p className="text-sm text-red-700">Click to review and notify the administrator.</p>
            </div>
          </div>
        </Link>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Licenses', value: totalLicenses, icon: FileCheck },
          { label: 'Expiring Soon', value: expiringLicenses, icon: AlertTriangle },
          { label: 'Active Employees', value: totalEmployees, icon: Users },
          { label: "Today's Attendance", value: todayAttendance, icon: CalendarCheck },
        ].map((c) => {
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
        <Link href="/hr/licenses" className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="font-bold text-[#1E3A6E]">Manage Licenses</p>
            <p className="text-sm text-slate-500 mt-1">Update dates, upload documents, notify admin</p>
          </div>
          <ArrowRight className="h-5 w-5 text-[#2E5FA3]" />
        </Link>
        <Link href="/hr/attendance" className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="font-bold text-[#1E3A6E]">Mark Attendance</p>
            <p className="text-sm text-slate-500 mt-1">Today's employee attendance</p>
          </div>
          <ArrowRight className="h-5 w-5 text-[#2E5FA3]" />
        </Link>
      </div>
    </div>
  );
}