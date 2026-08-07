import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getReceptionStats, getTodayFollowUpCount } from '@/lib/data';
import { UserPlus, Users, Ambulance, Stethoscope, BedDouble, ArrowRight, CalendarClock } from 'lucide-react';

export const metadata = { title: 'Reception Dashboard · Syed Hospital' };

export default async function ReceptionDashboard() {
  const session = await auth();
  const stats = await getReceptionStats();
  const followUpCount = await getTodayFollowUpCount();

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Asia/Karachi',
  });

  const cards = [
    { label: 'Total Today', value: stats.today, icon: Users },
    { label: 'Emergency', value: stats.er, icon: Ambulance },
    { label: 'Out-Patient', value: stats.opd, icon: Stethoscope },
    { label: 'In-Door', value: stats.ind, icon: BedDouble },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">
          Good day, {session?.user?.name ?? 'Staff'}
        </h1>
        <p className="text-slate-500 mt-1">{today}</p>
      </div>

      {/* Follow-up reminder banner */}
      {followUpCount > 0 && (
        <Link href="/reception/follow-ups" className="block bg-amber-50 ring-1 ring-amber-200 rounded-2xl p-4 mb-6 hover:bg-amber-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <CalendarClock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-amber-800">
                {followUpCount} follow-up{followUpCount !== 1 ? 's' : ''} due today
              </p>
              <p className="text-sm text-amber-700">Tap to see who to call and remind.</p>
            </div>
          </div>
        </Link>
      )}

      {/* Primary action */}
      <Link href="/reception/new-patient" className="block bg-gradient-to-br from-[#2E5FA3] to-[#1E3A6E] rounded-2xl p-6 mb-8 text-white hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-lg">Register New Patient</p>
              <p className="text-blue-100/80 text-sm">Create a record and generate an MR number</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5" />
        </div>
      </Link>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c) => {
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

      {/* Recent */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="font-bold text-[#1E3A6E]">Recent Registrations</h2>
          <Link href="/reception/patients" className="text-sm font-medium text-[#2E5FA3] hover:text-[#264F87]">
            View today&apos;s list
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <p className="px-6 py-10 text-center text-slate-400">No patients registered yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {stats.recent.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-4 font-mono font-semibold text-[#1E3A6E]">{p.mrNumber}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{p.fullName}</td>
                  <td className="px-6 py-4 text-slate-500">{p.department}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(p.visitDate).toLocaleDateString('en-GB', { timeZone: 'Asia/Karachi' })} · {p.visitTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}