'use client';

import PhotoUpload from '@/components/reception/PhotoUpload';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Phone, MapPin, CreditCard, Stethoscope,
  FileText, Loader2, CheckCircle2, Copy, X, UserPlus, Users, Printer,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const patientSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  guardianName: z.string().optional(),
  guardianCnic: z.string().optional(),
  guardianMobile: z.string().optional(),
  age: z.coerce.number().min(0).max(999),
  ageUnit: z.enum(['Days', 'Months', 'Years']).default('Years'),
  gender: z.enum(['Male', 'Female', 'Other']),
  cnicNumber: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().min(3, 'Address is required'),
  department: z.enum(['ER', 'OPD', 'IND']),
  serviceRequired: z.string().min(1, 'Select a service'),
  fee: z.coerce.number().optional(),
  consentGiven: z.boolean(),
  disposal: z.string().optional(),
  details: z.string().optional(),
});

type PatientForm = z.infer<typeof patientSchema>;

const services = [
  'General Physician OPD', 'Eye OPD', 'General Surgery OPD',
  'Gynecology OPD', 'Radiology', 'Emergency', 'Follow-up', 'Other',
];

type SuccessResult = {
  mrNumber: string;
  patientName: string;
  patientAge: number;
  patientAgeUnit: string;
  isFollowUp: boolean;
  visitNumber: number;
  tokenNumber: number;
  visitDateTime: string;
};

export default function NewPatientPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PatientForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(patientSchema) as any,
    defaultValues: {
      ageUnit: 'Years',
      gender: 'Male',
      department: 'OPD',
      consentGiven: false,
    },
  });

  const consentGiven = watch('consentGiven');

  async function onSubmit(data: PatientForm) {
    setSubmitting(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, photoUrl }),
      });
      const result = await res.json();

      if (!res.ok) {
        alert(result.error || 'Something went wrong');
        setSubmitting(false);
        return;
      }

      setSuccess({
        mrNumber: result.mrNumber,
        patientName: result.patientName,
        patientAge: result.patientAge,
        patientAgeUnit: result.patientAgeUnit,
        isFollowUp: result.isFollowUp,
        visitNumber: result.visitNumber,
        tokenNumber: result.tokenNumber,
        visitDateTime: result.visitDateTime,
      });
    } catch {
      alert('Network error — could not save patient');
    } finally {
      setSubmitting(false);
    }
  }

  function copyMR() {
    if (success) {
      navigator.clipboard.writeText(success.mrNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function printToken() {
    if (!success) return;
    const now = success.visitDateTime;
    const win = window.open('', '', 'width=300,height=500');
    if (!win) return;
    win.document.write(`
      <html><head><title>Token</title><style>
        @page { size: 80mm auto; margin: 0; }
        body { width: 72mm; margin: 0 auto; padding: 6mm 2mm; font-family: 'Courier New', monospace; text-align: center; color:#000; }
        .brand { font-size: 15px; font-weight: bold; letter-spacing: 1px; }
        .sub { font-size: 9px; letter-spacing: 3px; margin-bottom: 6px; }
        .line { border-top: 1px dashed #000; margin: 8px 0; }
        .token-label { font-size: 10px; margin-top: 6px; }
        .token { font-size: 46px; font-weight: bold; line-height: 1; margin: 2px 0 8px; }
        .name { font-size: 20px; font-weight: bold; margin: 4px 0 2px; }
        .age { font-size: 13px; margin: 0 0 6px; color: #333; }
        .row { font-size: 12px; margin: 3px 0; }
        .mr { font-size: 14px; font-weight: bold; }
        .foot { font-size: 9px; margin-top: 10px; }
      </style></head><body>
        <div class="brand">SYED HOSPITAL</div>
        <div class="sub">PATIENT TOKEN</div>
        <div class="line"></div>
        <div class="token-label">TOKEN NUMBER</div>
        <div class="token">${success.tokenNumber}</div>
        <div class="line"></div>
        <div class="name">${success.patientName}</div>
        <div class="age">Age: ${success.patientAge} ${success.patientAgeUnit}</div>
        <div class="row mr">MR: ${success.mrNumber}</div>
        <div class="row">Visit #${success.visitNumber}</div>
        <div class="row">${now}</div>
        <div class="line"></div>
        <div class="foot">Please keep this token<br/>and wait for your turn</div>
      </body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }

  function registerAnother() {
    reset();
    setSuccess(null);
    setPhotoUrl(null);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">
          Register New Patient
        </h1>
        <p className="text-slate-500 mt-1">
          Fill in the patient details to generate their Medical Record number.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* SECTION 1 — Department & Service */}
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#1E3A6E] mb-5">
            <Stethoscope className="h-5 w-5 text-[#2E5FA3]" />
            Department & Service
          </h2>
          <div className="space-y-5">
            <div>
              <Label className="text-slate-700 mb-2 block">Department</Label>
              <div className="flex gap-3">
                {(['ER', 'OPD', 'IND'] as const).map((dep) => (
                  <label key={dep} className="flex-1 cursor-pointer">
                    <input type="radio" value={dep} {...register('department')} className="peer sr-only" />
                    <div className="text-center px-4 py-3 rounded-xl ring-1 ring-slate-200 text-sm font-medium text-slate-600 peer-checked:bg-[#2E5FA3] peer-checked:text-white peer-checked:ring-[#2E5FA3] transition-all">
                      {dep === 'ER' ? 'Emergency (ER)' : dep === 'OPD' ? 'Out-Patient (OPD)' : 'In-Door (IND)'}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="serviceRequired" className="text-slate-700 mb-2 block">Service Required</Label>
              <select
                id="serviceRequired"
                {...register('serviceRequired')}
                className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]"
              >
                <option value="">Select a service...</option>
                {services.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.serviceRequired && (
                <p className="text-sm text-red-500 mt-1">{errors.serviceRequired.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 1.5 — Patient Photo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#1E3A6E] mb-5">
            <User className="h-5 w-5 text-[#2E5FA3]" />
            Patient Photo
          </h2>
          <PhotoUpload value={photoUrl} onChange={setPhotoUrl} />
          <p className="text-xs text-slate-400 mt-3">
            Optional — upload a file or capture with the camera.
          </p>
        </div>

        {/* SECTION 2 — Patient Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#1E3A6E] mb-5">
            <User className="h-5 w-5 text-[#2E5FA3]" />
            Patient Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="fullName" className="text-slate-700 mb-2 block">Full Name *</Label>
              <Input id="fullName" placeholder="Patient's name" className="h-11" {...register('fullName')} />
              {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <Label htmlFor="guardianName" className="text-slate-700 mb-2 block">S/O · D/O · W/O</Label>
              <Input id="guardianName" placeholder="Father/Husband name" className="h-11" {...register('guardianName')} />
            </div>

            <div>
              <Label htmlFor="age" className="text-slate-700 mb-2 block">Age *</Label>
              <div className="flex gap-2">
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g. 3"
                  className="h-11 flex-1"
                  {...register('age')}
                />
                <select
                  {...register('ageUnit')}
                  className="h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]"
                >
                  <option value="Days">Days</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </select>
              </div>
              {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>}
            </div>

            <div>
              <Label className="text-slate-700 mb-2 block">Gender *</Label>
              <div className="flex gap-3">
                {(['Male', 'Female', 'Other'] as const).map((g) => (
                  <label key={g} className="flex-1 cursor-pointer">
                    <input type="radio" value={g} {...register('gender')} className="peer sr-only" />
                    <div className="text-center px-3 py-2.5 rounded-xl ring-1 ring-slate-200 text-sm font-medium text-slate-600 peer-checked:bg-[#2E5FA3] peer-checked:text-white peer-checked:ring-[#2E5FA3] transition-all">
                      {g}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="cnicNumber" className="text-slate-700 mb-2 block">CNIC Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="cnicNumber" placeholder="XXXXX-XXXXXXX-X" className="h-11 pl-10" {...register('cnicNumber')} />
              </div>
            </div>
            <div>
              <Label htmlFor="mobile" className="text-slate-700 mb-2 block">Mobile</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="mobile" placeholder="03XX-XXXXXXX" className="h-11 pl-10" {...register('mobile')} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address" className="text-slate-700 mb-2 block">Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Textarea id="address" placeholder="Full address" className="pl-10 min-h-[80px]" {...register('address')} />
              </div>
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 2.5 — Guardian Contact */}
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#1E3A6E] mb-1">
            <Users className="h-5 w-5 text-[#2E5FA3]" />
            Guardian Contact
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            If the patient has no CNIC or mobile of their own (e.g. a child), record the guardian&apos;s here.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="guardianCnic" className="text-slate-700 mb-2 block">Guardian CNIC</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="guardianCnic" placeholder="XXXXX-XXXXXXX-X" className="h-11 pl-10" {...register('guardianCnic')} />
              </div>
            </div>
            <div>
              <Label htmlFor="guardianMobile" className="text-slate-700 mb-2 block">Guardian Mobile</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="guardianMobile" placeholder="03XX-XXXXXXX" className="h-11 pl-10" {...register('guardianMobile')} />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3 — Visit Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#1E3A6E] mb-5">
            <FileText className="h-5 w-5 text-[#2E5FA3]" />
            Visit Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="fee" className="text-slate-700 mb-2 block">Fee (Rs.)</Label>
              <Input id="fee" type="number" placeholder="0" className="h-11" {...register('fee')} />
            </div>
            <div>
              <Label htmlFor="disposal" className="text-slate-700 mb-2 block">Disposal</Label>
              <select
                id="disposal"
                {...register('disposal')}
                className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]"
              >
                <option value="">Select...</option>
                <option value="discharged">Discharged</option>
                <option value="admit">Admit</option>
                <option value="refer">Refer</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="details" className="text-slate-700 mb-2 block">Details / Notes</Label>
              <Textarea id="details" placeholder="Any additional notes" className="min-h-[80px]" {...register('details')} />
            </div>
          </div>
        </div>

        {/* SECTION 4 — Consent */}
        <div className="bg-[#EFF6FF] rounded-2xl p-6 ring-1 ring-[#2E5FA3]/10">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('consentGiven')}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-[#2E5FA3] focus:ring-[#2E5FA3]"
            />
            <span className="text-sm text-slate-700 leading-relaxed">
              <strong className="text-[#1E3A6E]">Consent from patient / attendant:</strong> We
              give consent to examine our patient and prescribe medicine. We trust the doctor and
              paramedical staff of this hospital and will not file any lawsuit against the hospital,
              doctor, or paramedical staff.
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={submitting || !consentGiven}
            className="h-12 px-8 bg-[#2E5FA3] hover:bg-[#264F87] text-white font-medium rounded-xl"
          >
            {submitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
            ) : (
              <><CheckCircle2 className="mr-2 h-4 w-4" /> Register Patient</>
            )}
          </Button>
        </div>
      </form>

      {/* SUCCESS MODAL */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={registerAnother} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600" aria-label="Close">
              <X className="h-5 w-5" />
            </button>

            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="h-9 w-9 text-green-500" />
            </div>

            <h2 className="text-2xl font-extrabold font-heading text-[#0F2347] text-center">
              {success.isFollowUp ? 'Follow-up Recorded' : 'Patient Registered'}
            </h2>
            <p className="text-slate-500 text-center mt-1">
              {success.patientName} · {success.patientAge} {success.patientAgeUnit}
            </p>

            {/* Queue Token */}
            <div className="mt-6 bg-[#1E3A6E] rounded-2xl p-5 text-center text-white">
              <p className="text-xs text-blue-200 uppercase tracking-wide mb-1">Queue Token Number</p>
              <p className="text-5xl font-extrabold tracking-wide">{success.tokenNumber}</p>
            </div>

            {/* MR number */}
            <div className="mt-4 bg-[#EFF6FF] rounded-2xl p-5 text-center ring-1 ring-[#2E5FA3]/10">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Medical Record Number</p>
              <p className="text-2xl font-mono font-bold text-[#1E3A6E] tracking-wide">{success.mrNumber}</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 ring-1 ring-[#2E5FA3]/15">
                <span className="text-sm font-semibold text-[#2E5FA3]">Visit #{success.visitNumber}</span>
              </div>
              <div className="mt-3">
                <button onClick={copyMR} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2E5FA3] hover:text-[#264F87]">
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy number'}
                </button>
              </div>
            </div>

            <button
              onClick={printToken}
              className="w-full mt-4 h-12 bg-white ring-1 ring-[#2E5FA3] text-[#2E5FA3] hover:bg-[#EFF6FF] font-medium rounded-xl inline-flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Token
            </button>

            <p className="text-xs text-slate-400 text-center mt-4">
              Print the token slip and staple it to the patient&apos;s prescription.
            </p>

            <Button onClick={registerAnother} className="w-full mt-6 h-12 bg-[#2E5FA3] hover:bg-[#264F87] text-white font-medium rounded-xl">
              <UserPlus className="mr-2 h-4 w-4" />
              Register Another Patient
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}