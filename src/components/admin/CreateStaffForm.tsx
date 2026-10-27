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
    specialty: 'GENERAL_PHYSICIAN',
    qualification: '',
    pmdcNumber: '',
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
          specialty: 'GENERAL_PHYSICIAN',
          qualification: '',
          pmdcNumber: '',
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
          Give these credentials to the staff/doctor member. This password will not be shown again.
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
                : created.role === 'DOCTOR'
                ? 'Doctor / Consultant'
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
        Create Account
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label className="text-slate-700 mb-2 block">Full Name *</Label>
          <Input
            value={form.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            placeholder="e.g. Dr. Muhammad Ejaz"
            className="h-11"
            required
          />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Username *</Label>
          <Input
            value={form.username}
            onChange={(e) => set('username', e.target.value)}
            placeholder="e.g. drejaz"
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
            placeholder="doctor@syedhospital.com"
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
        <div className="sm:col-span-2">
          <Label className="text-slate-700 mb-2 block">Role *</Label>
          <select
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]"
          >
            <option value="RECEPTIONIST">Receptionist</option>
            <option value="DOCTOR">Doctor / Consultant</option>
            <option value="HR">HR Officer</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </div>

        {form.role === 'DOCTOR' && (
          <>
            <div>
              <Label className="text-slate-700 mb-2 block">Specialty / Template Type *</Label>
              <select
                value={form.specialty}
                onChange={(e) => set('specialty', e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]"
              >
                <option value="GENERAL_PHYSICIAN">General Physician (OPD Template)</option>
                <option value="OPHTHALMOLOGY">Ophthalmology (Eye Slip Template)</option>
                <option value="GYNECOLOGY">Gynecology</option>
                <option value="PEDIATRICS">Pediatrics</option>
                <option value="SURGERY">General Surgery</option>
              </select>
            </div>
            <div>
              <Label className="text-slate-700 mb-2 block">Qualifications</Label>
              <Input
                value={form.qualification}
                onChange={(e) => set('qualification', e.target.value)}
                placeholder="e.g. M.B.B.S., FCPS"
                className="h-11"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-slate-700 mb-2 block">PMDC / PMC Reg. Number</Label>
              <Input
                value={form.pmdcNumber}
                onChange={(e) => set('pmdcNumber', e.target.value)}
                placeholder="e.g. 33776-P"
                className="h-11"
              />
            </div>
          </>
        )}
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