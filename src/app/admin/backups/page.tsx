import { Download, ShieldCheck, HardDrive, CalendarClock } from 'lucide-react';

export const metadata = { title: 'Backups · Syed Hospital' };

export default function BackupsPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">
          Backups &amp; Data Safety
        </h1>
        <p className="text-slate-500 mt-1">
          Download a copy of all hospital records to keep offline.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm">
          <div className="h-11 w-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-4">
            <HardDrive className="h-5 w-5 text-[#2E5FA3]" />
          </div>
          <h2 className="font-bold text-[#1E3A6E]">Spreadsheet (CSV)</h2>
          <p className="text-sm text-slate-500 mt-1 mb-4">
            Opens in Excel. Best for reading, printing, and sharing records.
          </p>
          <a href="/api/patients/export" className="inline-flex items-center gap-2 rounded-xl bg-[#2E5FA3] hover:bg-[#264F87] text-white text-sm font-medium px-5 py-2.5">
            <Download className="h-4 w-4" />
            Download CSV
          </a>
        </div>

        <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm">
          <div className="h-11 w-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-4">
            <ShieldCheck className="h-5 w-5 text-[#2E5FA3]" />
          </div>
          <h2 className="font-bold text-[#1E3A6E]">Full Backup (JSON)</h2>
          <p className="text-sm text-slate-500 mt-1 mb-4">
            Complete data copy including all fields. Use this to restore records.
          </p>
          <a href="/api/backup" className="inline-flex items-center gap-2 rounded-xl bg-white ring-1 ring-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-5 py-2.5">
            <Download className="h-4 w-4" />
            Download JSON
          </a>
        </div>
      </div>

      <div className="bg-[#EFF6FF] rounded-2xl p-6 ring-1 ring-[#2E5FA3]/10">
        <h3 className="flex items-center gap-2 font-bold text-[#1E3A6E] mb-3">
          <CalendarClock className="h-5 w-5 text-[#2E5FA3]" />
          Recommended routine
        </h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>• Download a backup <strong>once a week</strong> (e.g. every Friday).</li>
          <li>• Keep copies in <strong>two places</strong> — the hospital computer and a USB drive or Google Drive.</li>
          <li>• Records are never deleted — archiving only hides them from the active list.</li>
        </ul>
      </div>
    </div>
  );
}