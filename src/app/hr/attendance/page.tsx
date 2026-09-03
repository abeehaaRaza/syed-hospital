import { prisma } from '@/lib/prisma';
import AttendanceMarker from '@/components/hr/AttendanceMarker';

export const metadata = { title: 'Attendance · HR Portal' };

export default async function AttendancePage() {
  const employees = await prisma.employee.findMany({
    where: { isActive: true },
    orderBy: { fullName: 'asc' },
  });

  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });

  const existing = await prisma.attendance.findMany({
    where: { date: today },
  });

  const attendanceMap = Object.fromEntries(existing.map(a => [a.employeeId, a]));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">Attendance</h1>
        <p className="text-slate-500 mt-1">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Karachi' })}
        </p>
      </div>

      {employees.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center ring-1 ring-slate-100">
          <p className="text-slate-500">No active employees. Hire staff from the Admin portal first.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="px-6 py-4 font-semibold">Employee</th>
                  <th className="px-6 py-4 font-semibold">Shift</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Check In</th>
                  <th className="px-6 py-4 font-semibold">Check Out</th>
                  <th className="px-6 py-4 font-semibold">Notes</th>
                  <th className="px-6 py-4 font-semibold text-right">Save</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <AttendanceMarker
                    key={emp.id}
                    employee={emp}
                    date={today}
                    existing={attendanceMap[emp.id] || null}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}