import FollowUpButton from '@/components/reception/FollowUpButton';
import Link from 'next/link';
import { searchPatientsForReception } from '@/lib/data';
import { formatPakistanDate } from '@/lib/time';
import { Search, UserSearch } from 'lucide-react';

export const metadata = { title: 'Find Patient · Syed Hospital' };

const deptColors: Record<string, string> = {
  ER: 'bg-red-50 text-red-600',
  OPD: 'bg-blue-50 text-[#2E5FA3]',
  IND: 'bg-purple-50 text-purple-600',
};

export default async function ReceptionSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const search = params.q ?? '';
  const patients = search ? await searchPatientsForReception(search) : [];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">Find a Patient</h1>
        <p className="text-slate-500 mt-1">
          Search returning patients by name, MR number, mobile, or CNIC.
        </p>
      </div>

      <form className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            name="q"
            defaultValue={search}
            placeholder="Type a name, MR number, mobile, or CNIC..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]"
          />
        </div>
        <button type="submit" className="h-11 px-6 rounded-xl bg-[#2E5FA3] hover:bg-[#264F87] text-white text-sm font-medium">
          Search
        </button>
      </form>

      {!search ? (
        <div className="bg-white rounded-2xl p-16 text-center ring-1 ring-slate-100">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <UserSearch className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">Search for a patient</h3>
          <p className="text-slate-400 mt-1">Enter a name, MR number, or contact to begin.</p>
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center ring-1 ring-slate-100">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <UserSearch className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No patient found</h3>
          <p className="text-slate-400 mt-1">Try a different name or number.</p>
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
                  <th className="px-6 py-4 font-semibold">Mobile</th>
                  <th className="px-6 py-4 font-semibold">Last Visit</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono font-semibold text-[#1E3A6E]">{p.mrNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{p.fullName}</p>
                      {p.guardianName && <p className="text-xs text-slate-400">{p.guardianName}</p>}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.age} / {p.gender}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${deptColors[p.department] ?? 'bg-slate-100 text-slate-600'}`}>
                        {p.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {p.mobile || p.guardianMobile || '—'}
                    </td>
                   <td className="px-6 py-4 text-slate-500">{formatPakistanDate(p.visitDate)}</td>
                    <td className="px-6 py-4 text-right">
                      <FollowUpButton patientId={p.id} patientName={p.fullName} compact />
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