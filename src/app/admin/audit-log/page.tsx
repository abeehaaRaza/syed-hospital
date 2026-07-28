import { getAuditLogs } from '@/lib/data';
import { ScrollText } from 'lucide-react';

export const metadata = { title: 'Audit Log · Syed Hospital' };

const actionColors: Record<string, string> = {
  LOGIN: 'bg-slate-100 text-slate-600',
  PATIENT_CREATE: 'bg-green-50 text-green-600',
  PATIENT_FOLLOWUP: 'bg-blue-50 text-[#2E5FA3]',
  PATIENT_UPDATE: 'bg-amber-50 text-amber-600',
  PATIENT_ARCHIVE: 'bg-orange-50 text-orange-600',
  PATIENT_RESTORE: 'bg-teal-50 text-teal-600',
  STAFF_CREATE: 'bg-purple-50 text-purple-600',
};

export default async function AuditPage() {
  const logs = await getAuditLogs();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">Audit Log</h1>
        <p className="text-slate-500 mt-1">
          A permanent record of every action taken in the system.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center ring-1 ring-slate-100">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <ScrollText className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No activity recorded yet</h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="px-6 py-4 font-semibold">When</th>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Record</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleString('en-GB')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{l.userName}</p>
                      <p className="text-xs text-slate-400 font-mono">{l.userLogin}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${actionColors[l.action] ?? 'bg-slate-100 text-slate-600'}`}>
                        {l.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {l.entityType}
                      <span className="text-xs text-slate-300 ml-2 font-mono">{l.entityId?.slice(0, 8)}</span>
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