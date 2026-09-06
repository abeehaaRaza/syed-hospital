'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Loader2, CheckCircle2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CreateStaffForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<{
    username: string;
    password: string;
    role: string;
  } | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'RECEPTIONIST',
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Could not create account');
      } else {
        setCreated({
          username: form.username,
          password: form.password,
          role: form.role,
        });
        setForm({
          fullName: '',
          username: '',
          email: '',
          password: '',
          role: 'RECEPTIONIST',
        });
        router.refresh();
      }
    } catch {
      alert('Network error');
    } finally {
      setBusy(false);
    }
  }

  if (created) {
    return (
      <div className="bg-white rounded-2xl p-8 ring-1 ring-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          <h2 className="text-lg font-bold text-[#1E3A6E]">Account created</h2>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Give these credentials to the staff member. This password will not be shown again.
        </p>
        <div className="bg-[#EFF6FF] rounded-xl p-5 ring-1 ring-[#2E5FA3]/10 space-y-2">
          <p className="text-sm">
            <span className="text-slate-500">Username:</span>{' '}
            <span className="font-mono font-semibold text-[#1E3A6E]">
              {created.username}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-slate-500">Password:</span>{' '}
            <span className="font-mono font-semibold text-[#1E3A6E]">
              {created.password}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-slate-500">Role:</span>{' '}
            <span className="font-semibold text-[#1E3A6E]">
              {created.role === 'ADMIN'
                ? 'Administrator'
                : created.role === 'HR'
                ? 'HR Officer'
                : 'Receptionist'}
            </span>
          </p>
          <button
            type="button"
            onClick={() =>
              navigator.clipboard.writeText(
                `Username: ${created.username}\nPassword: ${created.password}`
              )
            }
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2E5FA3] hover:text-[#264F87] pt-1"
          >
            <Copy className="h-4 w-4" /> Copy credentials
          </button>
        </div>
        <Button
          onClick={() => setCreated(null)}
          className="mt-5 h-11 px-6 bg-[#2E5FA3] hover:bg-[#264F87] text-white rounded-xl"
        >
          Create another account
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm"
    >
      <h2 className="flex items-center gap-2 text-lg font-bold text-[#1E3A6E] mb-5">
        <UserPlus className="h-5 w-5 text-[#2E5FA3]" />
        Create Staff Account
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label className="text-slate-700 mb-2 block">Full Name *</Label>
          <Input
            value={form.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            placeholder="Staff member's name"
            className="h-11"
            required
          />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Username *</Label>
          <Input
            value={form.username}
            onChange={(e) => set('username', e.target.value)}
            placeholder="e.g. hr1 or reception1"
            className="h-11"
            required
            minLength={3}
          />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Email *</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="staff@syedhospital.com"
            className="h-11"
            required
          />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">
            Temporary Password *
          </Label>
          <Input
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            placeholder="At least 8 characters"
            className="h-11"
            required
            minLength={8}
          />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Role *</Label>
          <select
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]"
          >
            <option value="RECEPTIONIST">Receptionist</option>
            <option value="HR">HR Officer</option>
            <option value="ADMIN">Administrator</option>
          </select>
          <p className="text-xs text-slate-400 mt-1">
            HR Officers manage licenses and staff attendance. Administrators
            have full access.
          </p>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button
          type="submit"
          disabled={busy}
          className="h-11 px-6 bg-[#2E5FA3] hover:bg-[#264F87] text-white rounded-xl"
        >
          {busy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </div>
    </form>
  );
}