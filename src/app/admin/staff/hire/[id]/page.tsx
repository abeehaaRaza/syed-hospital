import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, User, Phone, CreditCard, MapPin, Briefcase, Calendar, Clock } from 'lucide-react';
import EmployeeStatusControl from '@/components/admin/EmployeeStatusControl';

export const metadata = { title: 'Employee Record · Syed Hospital' };

const statusColors: Record<string, string> = {
  Active: 'bg-green-50 text-green-700',
  'On Leave': 'bg-amber-50 text-amber-700',
  Left: 'bg-slate-100 text-slate-500',
};

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: { attendance: { orderBy: { date: 'desc' }, take: 30 } },
  });

  if (!employee) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/staff/hire" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#2E5FA3] mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Hospital Staff
      </Link>

      <div className="flex items-start gap-6 mb-8">
        <div className="w-28 h-28 rounded-2xl overflow-hidden ring-1 ring-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 relative">
          {employee.photoUrl ? (
            <Image src={employee.photoUrl} alt={employee.fullName} fill className="object-cover" />
          ) : (
            <User className="h-10 w-10 text-slate-300" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">{employee.fullName}</h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[employee.employmentStatus] ?? statusColors.Active}`}>
              {employee.employmentStatus}
            </span>
          </div>
          <p className="text-[#2E5FA3] font-medium mt-1">{employee.designation}</p>
          <p className="text-sm text-slate-500 mt-1">
            {employee.department ? `${employee.department} · ` : ''}{employee.shift}
          </p>
        </div>
      </div>

      <EmployeeStatusControl employeeId={employee.id} currentStatus={employee.employmentStatus} />

      <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm mb-6 mt-6">
        <h2 className="text-lg font-bold text-[#1E3A6E] mb-4">Details</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">Joining Date:</span>
            <span className="text-slate-800 font-medium">{new Date(employee.joiningDate).toLocaleDateString('en-GB')}</span>
          </div>
          {employee.leftDate && (
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500">Left Date:</span>
              <span className="text-slate-800 font-medium">{new Date(employee.leftDate).toLocaleDateString('en-GB')}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">Phone:</span>
            <span className="text-slate-800 font-medium">{employee.phone || '—'}</span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">CNIC:</span>
            <span className="text-slate-800 font-medium">{employee.cnic || '—'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">Age:</span>
            <span className="text-slate-800 font-medium">{employee.age}</span>
          </div>
          <div className="flex items-start gap-3 sm:col-span-2">
            <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
            <span className="text-slate-500">Address:</span>
            <span className="text-slate-800 font-medium">{employee.address || '—'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#2E5FA3]" />
          <h2 className="text-lg font-bold text-[#1E3A6E]">Recent Attendance</h2>
        </div>
        {employee.attendance.length === 0 ? (
          <p className="px-6 py-8 text-center text-slate-400 text-sm">No attendance recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Check In</th>
                <th className="px-6 py-3 font-semibold">Check Out</th>
              </tr>
            </thead>
            <tbody>
              {employee.attendance.map((a) => (
                <tr key={a.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-3 text-slate-600">{a.date}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#EFF6FF] text-[#2E5FA3]">{a.status}</span>
                  </td>
                  <td className="px-6 py-3 text-slate-500">{a.checkIn || '—'}</td>
                  <td className="px-6 py-3 text-slate-500">{a.checkOut || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}