'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Archive, RotateCcw, Trash2, Loader2 } from 'lucide-react';

export default function EmployeeRowActions({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function call(body: object, confirmMsg?: string) {
    if (confirmMsg && !confirm(confirmMsg)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/hr/employees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) alert(data.error || 'Action failed');
      else router.refresh();
    } catch {
      alert('Network error');
    } finally {
      setBusy(false);
    }
  }

  if (busy) return <Loader2 className="h-4 w-4 animate-spin text-slate-400 inline" />;

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() =>
          call(
            { action: isActive ? 'archive' : 'restore' },
            isActive ? 'Archive this employee (mark as left)?' : 'Restore this employee to active?'
          )
        }
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
          isActive ? 'bg-slate-50 text-slate-600 hover:bg-slate-100' : 'bg-[#EFF6FF] text-[#2E5FA3] hover:bg-[#DBEAFE]'
        }`}
      >
        {isActive ? <><Archive className="h-3.5 w-3.5" /> Archive</> : <><RotateCcw className="h-3.5 w-3.5" /> Restore</>}
      </button>
      <button
        onClick={() => call({ action: 'delete' }, 'Permanently delete this employee record? This cannot be undone.')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100"
      >
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </button>
    </div>
  );
}