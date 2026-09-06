import { prisma } from '@/lib/prisma';
import HireStaffForm from '@/components/admin/HireStaffForm';
import EmployeeRowActions from '@/components/admin/EmployeeRowActions';
import Link from 'next/link';

export const metadata = { title: 'Hospital Staff · Syed Hospital' };

const statusColors: Record<string, string> = {
  Active: 'bg-green-50 text-green-700',
  'On Leave': 'bg-amber-50 text-amber-700',
  Left: 'bg-slate-100 text-slate-500',
};

export default async function HireStaffPage() {
  const employees = await prisma.employee.findMany({ orderBy: { fullName: 'asc' } });

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">Hospital Staff</h1>
        <p className="text-slate-500 mt-1">Manage all employed staff. HR will track their attendance.</p>
      </div>

      <HireStaffForm />

      {employees.length > 0 && (
        <div className="bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden mt-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Designation</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Shift</th>
                  <th className="px-6 py-4 font-semibold">Joining Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <Link href={`/admin/staff/hire/${e.id}`} className="font-medium text-[#2E5FA3] hover:underline">
                        {e.fullName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{e.designation}</td>
                    <td className="px-6 py-4 text-slate-500">{e.department || '—'}</td>
                    <td className="px-6 py-4 text-slate-500">{e.shift}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(e.joiningDate).toLocaleDateString('en-GB')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[e.employmentStatus] ?? statusColors.Active}`}>
                        {e.employmentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <EmployeeRowActions id={e.id} isActive={e.isActive} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}