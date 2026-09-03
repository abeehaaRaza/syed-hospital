'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Clock, Upload, Bell, Loader2, FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type License = {
  id: string;
  name: string;
  issuanceDate: Date | null;
  expiryDate: Date | null;
  rackLocation: string | null;
  documentUrl: string | null;
  notes: string | null;
  history: Array<{
    id: string;
    issuanceDate: Date;
    expiryDate: Date;
    recordedAt: Date;
    notes: string | null;
  }>;
};

export default function LicenseCard({
  license,
  isExpired,
  isExpiringSoon,
}: {
  license: License;
  isExpired: boolean;
  isExpiringSoon: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState('');
  const [showNotify, setShowNotify] = useState(false);

  const [form, setForm] = useState({
    issuanceDate: license.issuanceDate ? new Date(license.issuanceDate).toISOString().split('T')[0] : '',
    expiryDate: license.expiryDate ? new Date(license.expiryDate).toISOString().split('T')[0] : '',
    rackLocation: license.rackLocation || '',
    notes: license.notes || '',
    documentUrl: license.documentUrl || '',
  });

  async function uploadDocument(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setForm(f => ({ ...f, documentUrl: data.secure_url }));
      }
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/hr/licenses/${license.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Save failed');
      } else {
        router.refresh();
        setOpen(false);
      }
    } catch {
      alert('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function sendNotification() {
    if (!notifyMsg.trim()) return;
    setNotifying(true);
    try {
      const res = await fetch(`/api/hr/licenses/${license.id}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: notifyMsg }),
      });
      if (res.ok) {
        setNotifyMsg('');
        setShowNotify(false);
        alert('Admin has been notified.');
      }
    } catch {
      alert('Failed to send notification');
    } finally {
      setNotifying(false);
    }
  }

  const statusColor = isExpired
    ? 'ring-red-200 bg-red-50'
    : isExpiringSoon
    ? 'ring-amber-200 bg-amber-50'
    : 'ring-slate-100 bg-white';

  const StatusIcon = isExpired ? AlertTriangle : isExpiringSoon ? Clock : CheckCircle2;
  const statusIconColor = isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-500' : 'text-green-500';

  return (
    <div className={`rounded-2xl ring-1 shadow-sm ${statusColor}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <StatusIcon className={`h-5 w-5 flex-shrink-0 ${statusIconColor}`} />
          <div>
            <p className="font-bold text-[#1E3A6E]">{license.name}</p>
            <p className="text-sm text-slate-500 mt-0.5">
              {license.expiryDate
                ? `Expires: ${new Date(license.expiryDate).toLocaleDateString('en-GB')}`
                : 'No expiry date set yet'}
              {license.rackLocation ? ` · Rack: ${license.rackLocation}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(isExpired || isExpiringSoon) && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isExpired ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
              {isExpired ? 'Expired' : 'Expiring Soon'}
            </span>
          )}
          {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-700 mb-2 block">Issuance Date</Label>
              <Input type="date" value={form.issuanceDate} onChange={e => setForm(f => ({ ...f, issuanceDate: e.target.value }))} className="h-11" />
            </div>
            <div>
              <Label className="text-slate-700 mb-2 block">Expiry Date</Label>
              <Input type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} className="h-11" />
            </div>
            <div>
              <Label className="text-slate-700 mb-2 block">Rack Location</Label>
              <Input placeholder="e.g. Cabinet A, Shelf 2" value={form.rackLocation} onChange={e => setForm(f => ({ ...f, rackLocation: e.target.value }))} className="h-11" />
            </div>
            <div>
              <Label className="text-slate-700 mb-2 block">Document</Label>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-600 cursor-pointer hover:bg-slate-50">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'Uploading...' : 'Upload PDF/Image'}
                  <input type="file" accept=".pdf,image/*" onChange={uploadDocument} className="hidden" />
                </label>
                {form.documentUrl && (
                  <a href={form.documentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[#2E5FA3] hover:underline">
                    <FileText className="h-4 w-4" />
                    View
                  </a>
                )}
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label className="text-slate-700 mb-2 block">Notes</Label>
              <Textarea placeholder="Any notes about this license..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="min-h-[70px]" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E5FA3] hover:bg-[#264F87] text-white text-sm font-medium disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => setShowNotify(!showNotify)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium ring-1 ring-amber-200">
              <Bell className="h-4 w-4" />
              Notify Admin
            </button>
            {license.history.length > 0 && (
              <button onClick={() => setHistoryOpen(!historyOpen)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium ring-1 ring-slate-200">
                History ({license.history.length})
              </button>
            )}
          </div>

          {showNotify && (
            <div className="bg-amber-50 rounded-xl p-4 ring-1 ring-amber-200 space-y-3">
              <p className="text-sm font-medium text-amber-800">Send a notification to the administrator:</p>
              <Textarea
                placeholder={`e.g. "${license.name}" is expiring on ${form.expiryDate || '[date]'}. Please arrange renewal.`}
                value={notifyMsg}
                onChange={e => setNotifyMsg(e.target.value)}
                className="min-h-[70px]"
              />
              <button onClick={sendNotification} disabled={notifying || !notifyMsg.trim()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium disabled:opacity-50">
                {notifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                {notifying ? 'Sending...' : 'Send to Admin'}
              </button>
            </div>
          )}

          {historyOpen && (
            <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-100">
              <p className="text-sm font-semibold text-slate-700 mb-3">License History</p>
              <div className="space-y-2">
                {license.history.map(h => (
                  <div key={h.id} className="text-sm text-slate-600 border-b border-slate-100 pb-2">
                    <span className="font-medium">Issued:</span> {new Date(h.issuanceDate).toLocaleDateString('en-GB')} →{' '}
                    <span className="font-medium">Expires:</span> {new Date(h.expiryDate).toLocaleDateString('en-GB')}
                    <span className="text-slate-400 ml-2">(recorded {new Date(h.recordedAt).toLocaleDateString('en-GB')})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}