import Link from 'next/link';
import { getAllPatients } from '@/lib/data';
import PatientRowActions from '@/components/admin/PatientRowActions';
import { Search, Users, Download } from 'lucide-react';

export const metadata = { title: 'All Patients · Syed Hospital' };

const deptColors: Record<string, string> = {
  ER: 'bg-red-50 text-red-600',
  OPD: 'bg-blue-50 text-[#2E5FA3]',
  IND: 'bg-purple-50 text-purple-600',
};

export default async function AdminPatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; archived?: string }>;
}) {
  const params = await searchParams;
  const search = params.q ?? '';
  const showArchived = params.archived === '1';
  const patients = await getAllPatients(search, showArchived);

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">All Patients</h1>
          <p className="text-slate-500 mt-1">{patients.length} record(s) found</p>
        </div>
        <a href="/api/patients/export" className="inline-flex items-center gap-2 rounded-xl bg-white ring-1 ring-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Download className="h-4 w-4" />
          Export CSV
        </a>
      </div>

      {/* Search + filter */}
      <form className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            name="q"
            defaultValue={search}
            placeholder="Search by name, MR number, mobile, or CNIC..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]"
          />
        </div>
        <label className="flex items-center gap-2 px-4 h-11 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 cursor-pointer">
          <input type="checkbox" name="archived" value="1" defaultChecked={showArchived} className="h-4 w-4 rounded" />
          Include archived
        </label>
        <button
          type="submit"
          className="h-11 px-6 rounded-xl bg-[#2E5FA3] hover:bg-[#264F87] text-white text-sm font-medium"
        >
          Search
        </button>
      </form>

      {patients.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center ring-1 ring-slate-100">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No patients found</h3>
          <p className="text-slate-400 mt-1">Try a different search term.</p>
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
                  <th className="px-6 py-4 font-semibold">Visit Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono font-semibold text-[#1E3A6E]">{p.mrNumber}</td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/patients/${p.id}`} className="font-medium text-slate-800 hover:text-[#2E5FA3]">
                        {p.fullName}
                      </Link>
                      {p.guardianName && <p className="text-xs text-slate-400">{p.guardianName}</p>}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.age} / {p.gender}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${deptColors[p.department] ?? 'bg-slate-100 text-slate-600'}`}>
                        {p.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.mobile}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(p.visitDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.isVisible ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {p.isVisible ? 'Active' : 'Archived'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <PatientRowActions id={p.id} isVisible={p.isVisible} />
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