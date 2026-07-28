'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, UserX, UserCheck, Loader2 } from 'lucide-react';

export default function StaffRowActions({
  id,
  isActive,
  isSelf,
}: {
  id: string;
  isActive: boolean;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function call(body: object, confirmMsg?: string) {
    if (confirmMsg && !confirm(confirmMsg)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/staff/${id}`, {
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

  function resetPassword() {
    const pw = prompt('Enter a new temporary password (min 8 characters):');
    if (!pw) return;
    if (pw.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    call({ action: 'resetPassword', newPassword: pw });
    alert(`Password set. Give this to the staff member:\n\n${pw}`);
  }

  if (busy) {
    return <Loader2 className="h-4 w-4 animate-spin text-slate-400 inline" />;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={resetPassword}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100"
      >
        <KeyRound className="h-3.5 w-3.5" />
        Reset Password
      </button>

      {!isSelf && (
        <button
          onClick={() =>
            call(
              { action: 'toggleActive' },
              isActive ? 'Deactivate this account? They will not be able to log in.' : 'Reactivate this account?'
            )
          }
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
            isActive
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          {isActive ? <><UserX className="h-3.5 w-3.5" /> Deactivate</> : <><UserCheck className="h-3.5 w-3.5" /> Activate</>}
        </button>
      )}
    </div>
  );
}