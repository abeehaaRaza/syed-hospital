'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const statuses = ['Active', 'On Leave', 'Left'];

export default function EmployeeStatusControl({
  employeeId,
  currentStatus,
}: {
  employeeId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function changeStatus(status: string) {
    if (status === currentStatus) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/hr/employees/${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setStatus', employmentStatus: status }),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Could not update status');
      } else {
        router.refresh();
      }
    } catch {
      alert('Network error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-100 shadow-sm flex items-center gap-3 flex-wrap">
      <span className="text-sm font-medium text-slate-700">Employment Status:</span>
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => changeStatus(s)}
          disabled={busy}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
            s === currentStatus
              ? 'bg-[#2E5FA3] text-white'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {busy && s === currentStatus ? <Loader2 className="h-3.5 w-3.5 animate-spin inline" /> : s}
        </button>
      ))}
    </div>
  );
}