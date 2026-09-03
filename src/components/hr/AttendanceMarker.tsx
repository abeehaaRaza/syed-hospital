'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const statusOptions = ['Present', 'Absent', 'Late', 'Half-Day', 'Leave'];
const statusColors: Record<string, string> = {
  Present: 'bg-green-50 text-green-700',
  Absent: 'bg-red-50 text-red-700',
  Late: 'bg-amber-50 text-amber-700',
  'Half-Day': 'bg-blue-50 text-blue-700',
  Leave: 'bg-purple-50 text-purple-700',
};

export default function AttendanceMarker({
  employee, date, existing,
}: {
  employee: { id: string; fullName: string; designation: string; shift: string };
  date: string;
  existing: { status: string; checkIn: string | null; checkOut: string | null; notes: string | null } | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(existing?.status || 'Present');
  const [checkIn, setCheckIn] = useState(existing?.checkIn || '');
  const [checkOut, setCheckOut] = useState(existing?.checkOut || '');
  const [notes, setNotes] = useState(existing?.notes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/hr/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: employee.id, date, status, checkIn, checkOut, notes }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      }
    } catch {
      alert('Network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="border-b border-slate-50 last:border-0">
      <td className="px-6 py-3">
        <p className="font-medium text-slate-800">{employee.fullName}</p>
        <p className="text-xs text-slate-400">{employee.designation}</p>
      </td>
      <td className="px-6 py-3 text-slate-500 text-xs">{employee.shift}</td>
      <td className="px-6 py-3">
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border-0 focus:outline-none cursor-pointer ${statusColors[status]}`}
        >
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
      <td className="px-6 py-3">
        <input type="time" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="h-8 rounded-lg border border-slate-200 px-2 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#2E5FA3]" />
      </td>
      <td className="px-6 py-3">
        <input type="time" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="h-8 rounded-lg border border-slate-200 px-2 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#2E5FA3]" />
      </td>
      <td className="px-6 py-3">
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional note" className="h-8 w-36 rounded-lg border border-slate-200 px-2 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#2E5FA3]" />
      </td>
      <td className="px-6 py-3 text-right">
        <button onClick={save} disabled={saving} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${saved ? 'bg-green-50 text-green-600' : 'bg-[#2E5FA3] text-white hover:bg-[#264F87]'} disabled:opacity-50`}>
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save'}
        </button>
      </td>
    </tr>
  );
}