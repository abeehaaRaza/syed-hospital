'use client';

import { useState } from 'react';
import { KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) {
      alert('New passwords do not match');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Could not change password');
      } else {
        setDone(true);
        setCurrent(''); setNext(''); setConfirm('');
      }
    } catch {
      alert('Network error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm max-w-md">
      <h2 className="flex items-center gap-2 text-lg font-bold text-[#1E3A6E] mb-5">
        <KeyRound className="h-5 w-5 text-[#2E5FA3]" />
        Change Password
      </h2>

      <div className="space-y-5">
        <div>
          <Label className="text-slate-700 mb-2 block">Current Password</Label>
          <Input type="password" value={current} onChange={(e) => { setCurrent(e.target.value); setDone(false); }} className="h-11" required />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">New Password</Label>
          <Input type="password" value={next} onChange={(e) => { setNext(e.target.value); setDone(false); }} className="h-11" required minLength={8} />
          <p className="text-xs text-slate-400 mt-1">At least 8 characters.</p>
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Confirm New Password</Label>
          <Input type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setDone(false); }} className="h-11" required minLength={8} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        {done ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" /> Password updated
          </span>
        ) : <span />}
        <Button type="submit" disabled={busy} className="h-11 px-6 bg-[#2E5FA3] hover:bg-[#264F87] text-white rounded-xl">
          {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : 'Update Password'}
        </Button>
      </div>
    </form>
  );
}