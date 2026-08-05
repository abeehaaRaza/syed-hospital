'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Archive, RotateCcw, Loader2, Trash2 } from 'lucide-react';

export default function PatientRowActions({
  id,
  isVisible,
}: {
  id: string;
  isVisible: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleArchive() {
    setBusy(true);
    try {
      const res = await fetch(`/api/patients/${id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archive: isVisible }),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Action failed');
      } else {
        router.refresh();
      }
    } catch {
      alert('Network error');
    } finally {
      setBusy(false);
    }
  }

  async function deletePatient() {
    const sure = confirm(
      'Permanently DELETE this patient and all their visit history?\n\nThis cannot be undone. Consider archiving instead if you only want to hide the record.'
    );
    if (!sure) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/patients/${id}/delete`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Delete failed');
      } else {
        router.refresh();
      }
    } catch {
      alert('Network error');
    } finally {
      setBusy(false);
    }
  }

  if (busy) {
    return <Loader2 className="h-4 w-4 animate-spin text-slate-400 inline" />;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={toggleArchive}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          isVisible
            ? 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            : 'bg-[#EFF6FF] text-[#2E5FA3] hover:bg-[#DBEAFE]'
        }`}
      >
        {isVisible ? <><Archive className="h-3.5 w-3.5" /> Archive</> : <><RotateCcw className="h-3.5 w-3.5" /> Restore</>}
      </button>

      <button
        onClick={deletePatient}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </button>
    </div>
  );
}