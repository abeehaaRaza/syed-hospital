import { getUpcomingFollowUps } from '@/lib/data';
import { formatPakistanDate } from '@/lib/time';
import FollowUpDoneButton from '@/components/reception/FollowUpDoneButton';
import { CalendarClock, Phone } from 'lucide-react';

export const metadata = { title: 'Follow-ups · Syed Hospital' };

export default async function FollowUpsPage() {
  const followUps = await getUpcomingFollowUps();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">Follow-ups</h1>
        <p className="text-slate-500 mt-1">
          Patients with a scheduled return visit. Call to remind them, then mark done.
        </p>
      </div>

      {followUps.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center ring-1 ring-slate-100">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <CalendarClock className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No upcoming follow-ups</h3>
          <p className="text-slate-400 mt-1">Scheduled follow-ups will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {followUps.map((p) => {
            const due = new Date(p.followUpDate!);
            due.setHours(0, 0, 0, 0);
            const isOverdue = due < today;
            const isToday = due.getTime() === today.getTime();
            const phone = p.mobile || p.guardianMobile;

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl p-5 ring-1 shadow-sm flex items-center justify-between gap-4 ${
                  isOverdue ? 'ring-red-200' : isToday ? 'ring-[#2E5FA3]/30' : 'ring-slate-100'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-[#1E3A6E]">{p.fullName}</p>
                    <span className="font-mono text-xs text-slate-500">{p.mrNumber}</span>
                    {isOverdue && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">Overdue</span>
                    )}
                    {isToday && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#EFF6FF] text-[#2E5FA3]">Today</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Due {formatPakistanDate(p.followUpDate!)}
                    {p.followUpReason ? ` · ${p.followUpReason}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {phone ? (
                    <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2E5FA3] hover:text-[#264F87]">
                      <Phone className="h-4 w-4" />
                      {phone}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">No number</span>
                  )}
                  <FollowUpDoneButton patientId={p.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}