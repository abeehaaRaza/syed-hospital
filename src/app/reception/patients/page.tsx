import Link from 'next/link';
import { getTodaysPatients } from '@/lib/data';
import { Users, UserPlus, Phone, Clock } from 'lucide-react';

export const metadata = {
  title: "Today's Patients · Syed Hospital",
};

const deptColors: Record<string, string> = {
  ER: 'bg-red-50 text-red-600',
  OPD: 'bg-blue-50 text-[#2E5FA3]',
  IND: 'bg-purple-50 text-purple-600',
};

export default async function TodaysPatientsPage() {
  const patients = await getTodaysPatients();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">
            Today&apos;s Patients
          </h1>
          <p className="text-slate-500 mt-1">
            {patients.length} patient{patients.length !== 1 ? 's' : ''} registered today
          </p>
        </div>
        <Link
          href="/reception/new-patient"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2E5FA3] hover:bg-[#264F87] text-white text-sm font-medium px-5 py-2.5 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          New Patient
        </Link>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center ring-1 ring-slate-100">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No patients yet today</h3>
          <p className="text-slate-400 mt-1">Registered patients will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="px-6 py-4 font-semibold">MR Number</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Age / Gender</th>
                  <th className="px-6 py-4 font-semibold">Dept</th>
                  <th className="px-6 py-4 font-semibold">Service</th>
                  <th className="px-6 py-4 font-semibold">Mobile</th>
                  <th className="px-6 py-4 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-[#1E3A6E]">{p.mrNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{p.fullName}</p>
                      {p.guardianName && (
                        <p className="text-xs text-slate-400">{p.guardianName}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {p.age} {(p as any).ageUnit ?? 'Years'} / {p.gender}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${deptColors[p.department] ?? 'bg-slate-100 text-slate-600'}`}>
                        {p.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.serviceRequired}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {p.mobile || p.guardianMobile || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {p.visitTime}
                      </span>
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