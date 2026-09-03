'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Loader2, Printer, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const shifts = ['Morning (8AM–2PM)', 'Evening (2PM–8PM)', 'Night (8PM–8AM)', 'Full Day (9AM–5PM)', 'On Call'];

export default function HireStaffForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hired, setHired] = useState<any>(null);
  const [form, setForm] = useState({
    fullName: '', age: '', designation: '', department: '',
    shift: shifts[0], joiningDate: '', phone: '', cnic: '', address: '', photoUrl: '',
  });

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) set('photoUrl', data.secure_url);
    } catch { alert('Photo upload failed'); }
    finally { setUploading(false); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch('/api/hr/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'Could not hire staff'); }
      else { setHired(data); router.refresh(); }
    } catch { alert('Network error'); }
    finally { setBusy(false); }
  }

  function printRecord() {
    if (!hired) return;
    const win = window.open('', '', 'width=800,height=600');
    if (!win) return;
    win.document.write(`
      <html><head><title>Staff Record</title><style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #000; }
        h1 { font-size: 22px; margin-bottom: 4px; }
        .sub { color: #555; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 8px 12px; border-bottom: 1px solid #eee; }
        td:first-child { font-weight: bold; color: #333; width: 200px; }
        .footer { margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 12px; }
      </style></head><body>
        <h1>SYED HOSPITAL</h1>
        <div class="sub">Staff Employment Record</div>
        <table>
          <tr><td>Full Name</td><td>${hired.fullName}</td></tr>
          <tr><td>Age</td><td>${hired.age}</td></tr>
          <tr><td>Designation</td><td>${hired.designation}</td></tr>
          <tr><td>Department</td><td>${hired.department || '—'}</td></tr>
          <tr><td>Shift</td><td>${hired.shift}</td></tr>
          <tr><td>Joining Date</td><td>${new Date(hired.joiningDate).toLocaleDateString('en-GB')}</td></tr>
          <tr><td>Phone</td><td>${hired.phone || '—'}</td></tr>
          <tr><td>CNIC</td><td>${hired.cnic || '—'}</td></tr>
          <tr><td>Address</td><td>${hired.address || '—'}</td></tr>
        </table>
        <div class="footer">Printed: ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Karachi' })}</div>
      </body></html>
    `);
    win.document.close();
    win.print();
    win.close();
  }

  if (hired) {
    return (
      <div className="bg-white rounded-2xl p-8 ring-1 ring-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-lg">✓</div>
          <h2 className="text-lg font-bold text-[#1E3A6E]">{hired.fullName} hired successfully</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">They now appear in the HR attendance system.</p>
        <div className="flex gap-2">
          <Button onClick={printRecord} className="h-11 px-5 bg-white ring-1 ring-[#2E5FA3] text-[#2E5FA3] hover:bg-[#EFF6FF] rounded-xl">
            <Printer className="mr-2 h-4 w-4" /> Print Record
          </Button>
          <Button onClick={() => { setHired(null); setForm({ fullName: '', age: '', designation: '', department: '', shift: shifts[0], joiningDate: '', phone: '', cnic: '', address: '', photoUrl: '' }); }} className="h-11 px-5 bg-[#2E5FA3] hover:bg-[#264F87] text-white rounded-xl">
            <UserPlus className="mr-2 h-4 w-4" /> Hire Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-bold text-[#1E3A6E] mb-5">
        <UserPlus className="h-5 w-5 text-[#2E5FA3]" />
        Hire New Staff Member
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label className="text-slate-700 mb-2 block">Full Name *</Label>
          <Input value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Staff name" className="h-11" required />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Age</Label>
          <Input type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="Age" className="h-11" />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Designation *</Label>
          <Input value={form.designation} onChange={e => set('designation', e.target.value)} placeholder="e.g. Nurse, Doctor, Receptionist" className="h-11" required />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Department</Label>
          <Input value={form.department} onChange={e => set('department', e.target.value)} placeholder="e.g. Emergency, OPD" className="h-11" />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Shift *</Label>
          <select value={form.shift} onChange={e => set('shift', e.target.value)} className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]" required>
            {shifts.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Joining Date *</Label>
          <Input type="date" value={form.joiningDate} onChange={e => set('joiningDate', e.target.value)} className="h-11" required />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">Phone</Label>
          <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="03XX-XXXXXXX" className="h-11" />
        </div>
        <div>
          <Label className="text-slate-700 mb-2 block">CNIC</Label>
          <Input value={form.cnic} onChange={e => set('cnic', e.target.value)} placeholder="XXXXX-XXXXXXX-X" className="h-11" />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-slate-700 mb-2 block">Address</Label>
          <Textarea value={form.address} onChange={e => set('address', e.target.value)} placeholder="Home address" className="min-h-[70px]" />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-slate-700 mb-2 block">Photo</Label>
          <label className="inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-600 cursor-pointer hover:bg-slate-50">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading...' : form.photoUrl ? 'Photo uploaded ✓' : 'Upload Photo'}
            <input type="file" accept="image/*" onChange={uploadPhoto} className="hidden" />
          </label>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button type="submit" disabled={busy} className="h-11 px-6 bg-[#2E5FA3] hover:bg-[#264F87] text-white rounded-xl">
          {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Hiring...</> : 'Hire Staff Member'}
        </Button>
      </div>
    </form>
  );
}