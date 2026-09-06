'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type PatientData = {
  id: string;
  fullName: string;
  guardianName: string;
  age: number;
  ageUnit: string;
  gender: string;
  cnicNumber: string;
  mobile: string;
  address: string;
  serviceRequired: string;
  fee: number | null;
  disposal: string;
  details: string;
};

const services = [
  'General Physician OPD', 'Eye OPD', 'General Surgery OPD',
  'Gynecology OPD', 'Radiology', 'Emergency', 'Follow-up', 'Other',
];

export default function EditPatientForm({ patient }: { patient: PatientData }) {
  const router = useRouter();
  const [form, setForm] = useState(patient);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  function set(field: keyof PatientData, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`/api/patients/${patient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Could not save changes');
      } else {
        setSaved(true);
        router.refresh();
      }
    } catch {
      alert('Network error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm">
      <h2 className="text-lg font-bold text-[#1E3A6E] mb-5">Edit Record</h2>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label className="text-slate-700 mb-2 block">Full Name</Label>
          <Input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} className="h-11" required />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">S/O · D/O · W/O</Label>
          <Input value={form.guardianName} onChange={(e) => set('guardianName', e.target.value)} className="h-11" />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Age</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={form.age}
              onChange={(e) => set('age', Number(e.target.value))}
              className="h-11 flex-1"
              required
            />
            <select
              value={form.ageUnit}
              onChange={(e) => set('ageUnit', e.target.value)}
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]"
            >
              <option value="Days">Days</option>
              <option value="Months">Months</option>
              <option value="Years">Years</option>
            </select>
          </div>
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Gender</Label>
          <select
            value={form.gender}
            onChange={(e) => set('gender', e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">CNIC</Label>
          <Input value={form.cnicNumber} onChange={(e) => set('cnicNumber', e.target.value)} placeholder="XXXXX-XXXXXXX-X" className="h-11" />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Mobile</Label>
          <Input value={form.mobile} onChange={(e) => set('mobile', e.target.value)} className="h-11" required />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-slate-700 mb-2 block">Address</Label>
          <Textarea value={form.address} onChange={(e) => set('address', e.target.value)} className="min-h-[80px]" required />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Service Required</Label>
          <select
            value={form.serviceRequired}
            onChange={(e) => set('serviceRequired', e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]"
          >
            <option value="">Select...</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Fee (Rs.)</Label>
          <Input
            type="number"
            value={form.fee ?? ''}
            onChange={(e) => set('fee', e.target.value === '' ? 0 : Number(e.target.value))}
            className="h-11"
          />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Disposal</Label>
          <select
            value={form.disposal}
            onChange={(e) => set('disposal', e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]"
          >
            <option value="">Select...</option>
            <option value="discharged">Discharged</option>
            <option value="admit">Admit</option>
            <option value="refer">Refer</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label className="text-slate-700 mb-2 block">Details / Notes</Label>
          <Textarea value={form.details} onChange={(e) => set('details', e.target.value)} className="min-h-[80px]" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 mt-6">
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" /> Changes saved
          </span>
        )}
        <Button type="submit" disabled={busy} className="h-11 px-6 bg-[#2E5FA3] hover:bg-[#264F87] text-white rounded-xl">
          {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
        </Button>
      </div>
    </form>
  );
}