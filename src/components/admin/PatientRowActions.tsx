'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Archive, RotateCcw, Loader2 } from 'lucide-react';

export default function PatientRowActions({
  id,
  isVisible,
}: {
  id: string;
  isVisible: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
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

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
        isVisible
          ? 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          : 'bg-[#EFF6FF] text-[#2E5FA3] hover:bg-[#DBEAFE]'
      }`}
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isVisible ? (
        <><Archive className="h-3.5 w-3.5" /> Archive</>
      ) : (
        <><RotateCcw className="h-3.5 w-3.5" /> Restore</>
      )}
    </button>
  );
}