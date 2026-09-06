import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { User } from 'lucide-react';

export const metadata = { title: 'Employees · HR Portal' };

const statusColors: Record<string, string> = {
  Active: 'bg-green-50 text-green-700',
  'On Leave': 'bg-amber-50 text-amber-700',
  Left: 'bg-slate-100 text-slate-500',
};

export default async function HREmployeesPage() {
  const employees = await prisma.employee.findMany({
    orderBy: { fullName: 'asc' },
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">Employees</h1>
        <p className="text-slate-500 mt-1">{employees.length} staff member{employees.length !== 1 ? 's' : ''} on record</p>
      </div>

      {employees.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center ring-1 ring-slate-100">
          <p className="text-slate-500">No employees yet. The administrator hires staff from the Admin portal.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl p-5 ring-1 ring-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0 relative">
                {e.photoUrl ? (
                  <Image src={e.photoUrl} alt={e.fullName} fill className="object-cover" />
                ) : (
                  <User className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#1E3A6E] truncate">{e.fullName}</p>
                </div>
                <p className="text-sm text-slate-500">{e.designation}</p>
                <p className="text-xs text-slate-400">{e.shift}</p>
                <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[e.employmentStatus] ?? statusColors.Active}`}>
                  {e.employmentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}