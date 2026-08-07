'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarClock, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function FollowUpButton({
  patientId,
  patientName,
  compact = false,
}: {
  patientId: string;
  patientName: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!date) {
      alert('Please pick a follow-up date');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/followup`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set', followUpDate: date, followUpReason: reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Could not schedule follow-up');
      } else {
        setOpen(false);
        setDate('');
        setReason('');
        router.refresh();
      }
    } catch {
      alert('Network error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          compact
            ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#EFF6FF] text-[#2E5FA3] hover:bg-[#DBEAFE]'
            : 'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#EFF6FF] text-[#2E5FA3] hover:bg-[#DBEAFE]'
        }
      >
        <CalendarClock className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        Schedule Follow-up
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-extrabold font-heading text-[#0F2347] mb-1">Schedule Follow-up</h2>
            <p className="text-sm text-slate-500 mb-5">For {patientName}</p>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-700 mb-2 block">Follow-up Date</Label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]"
                />
              </div>
              <div>
                <Label className="text-slate-700 mb-2 block">Reason (optional)</Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Wound check, review test results"
                  className="min-h-[70px]"
                />
              </div>
            </div>

            <Button onClick={save} disabled={busy} className="w-full mt-6 h-11 bg-[#2E5FA3] hover:bg-[#264F87] text-white rounded-xl">
              {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Follow-up'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}