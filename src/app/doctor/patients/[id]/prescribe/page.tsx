'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, Plus, Trash2, Printer, ArrowLeft, Stethoscope, Activity, FileText, Eye, CheckSquare, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

const SYSTEMIC_ILLNESSES = ['Hypertension', 'Cardiac / IHD', 'Diabetes', 'Asthma', 'H/O Jaundice', 'Any Others'];
const OCULAR_FINDINGS = [
  'Refractive Error', 'Lid Disorder', 'Conjunctivitis', 'Trachoma', 'Foreign Body', 
  'Vitamin A Deficiency', 'Corneal Opacity', 'Cataract', 'Glaucoma Suspect', 
  'Squint/Ocular Motility', 'Uveitis', 'Diabetic Retinopathy', 'Vitreo Retinal Disorder', 
  'Optic Nerve Disorder', 'Ocular Trauma', 'Infections', 'Dacryocystitis', 'Any Other / NAD'
];

export default function PrescriptionStudio() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  const { data: session } = useSession();
  
  const specialty = session?.user?.specialty || 'GENERAL_PHYSICIAN';
  const isEyeSlip = specialty === 'OPHTHALMOLOGY';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [patient, setPatient] = useState<any>(null);

  const [vitals, setVitals] = useState({ bp: '', pulse: '', temp: '', weight: '', spo2: '' });
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [followUpDays, setFollowUpDays] = useState('');
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '', m: false, a: false, n: false, bm: false }]);

  const [eyeFindings, setEyeFindings] = useState({
    right: { va: '', ph: '', glasses: '', sph: '', cyl: '', axis: '', iop: '' },
    left: { va: '', ph: '', glasses: '', sph: '', cyl: '', axis: '', iop: '' },
    tests: { urineSugar: '', rbs: '', cpEsr: '', others: '' },
    prognosis: 'Good',
    systemic: [] as string[],
    allergies: '',
    ocular: [] as string[],
    clinicalHistory: '',
    familyHistory: '',
    ocularExam: '',
    remarks: ''
  });

  const [gpFindings, setGpFindings] = useState({
    notes: '',
    dm: false, htn: false, smok: false, cPlus: false,
    prn: '',
    labs: { bsf: '', bsr: '', cr: '', lft: '', tsh: '', a1c: '', ecg: '', usg: '', hb: '', tlc: '', esr: '', b: '', c: '' }
  });

  useEffect(() => {
    fetch(`/api/patients/${patientId}`)
      .then(res => res.json())
      .then(data => {
        setPatient(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [patientId]);

  const toggleArray = (field: 'systemic' | 'ocular', val: string) => {
    setEyeFindings(prev => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };

  const updateEye = (side: 'right' | 'left', field: string, val: string) => {
    setEyeFindings(prev => ({ ...prev, [side]: { ...prev[side], [field]: val } }));
  };

  const updateTest = (field: string, val: string) => {
    setEyeFindings(prev => ({ ...prev, tests: { ...prev.tests, [field]: val } }));
  };

  const updateLab = (field: string, val: string) => {
    setGpFindings(prev => ({ ...prev, labs: { ...prev.labs, [field]: val } }));
  };

  const addMedication = () => setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', m: false, a: false, n: false, bm: false }]);
  const removeMedication = (index: number) => setMedications(medications.filter((_, i) => i !== index));
  const updateMedication = (index: number, field: string, value: any) => {
    const updated = [...medications];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[index] as any)[field] = value;
    setMedications(updated);
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const validMeds = medications.filter(m => m.name.trim() !== '');
      let finalDiagnosis = diagnosis;
      if (isEyeSlip && !finalDiagnosis) finalDiagnosis = eyeFindings.ocularExam; 

      const payload = {
        patientId,
        visitId: patient?.visits?.[0]?.id,
        vitals,
        diagnosis: finalDiagnosis,
        instructions,
        followUpDays,
        clinicalFindings: isEyeSlip ? eyeFindings : gpFindings,
        medications: validMeds,
      };

      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (res.ok) {
        router.push(`/doctor/prescriptions/${data.prescriptionId}/print`);
      } else {
        alert(data.error);
        setSubmitting(false);
      }
    } catch (err) {
      alert('Failed to save prescription');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#2E5FA3]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doctor/dashboard" className="p-2 bg-white rounded-full ring-1 ring-slate-200 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold font-heading text-[#0F2347]">Prescription Studio</h1>
            <p className="text-slate-500 text-sm mt-1">Consultation for {patient?.fullName}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={submitting} className="h-11 px-6 bg-[#2E5FA3] hover:bg-[#264F87] text-white rounded-xl flex items-center gap-2">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
          Save & Print
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: Patient Info & Basic Vitals */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Patient Profile</h2>
            <div className="bg-[#EFF6FF] rounded-xl p-4 ring-1 ring-[#2E5FA3]/10 mb-5 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Queue Token</p>
              <p className="text-4xl font-extrabold text-[#1E3A6E]">{patient?.tokenNumber ?? '--'}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">MR Number</span>
                <span className="font-mono font-bold text-[#1E3A6E]">{patient?.mrNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Name</span>
                <span className="font-semibold text-slate-800 truncate max-w-[120px]">{patient?.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Age / Gender</span>
                <span className="font-medium text-slate-800">{patient?.age} {patient?.ageUnit} / {patient?.gender}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-slate-500">Service</span>
                <span className="font-medium text-slate-800 truncate max-w-[120px]">{patient?.serviceRequired || 'OPD'}</span>
              </div>
            </div>
          </div>

          {!isEyeSlip && (
            <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#1E3A6E] mb-4">
                <Activity className="h-4 w-4 text-[#2E5FA3]" /> Vitals
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-slate-500 mb-1 block">BP</Label><Input value={vitals.bp} onChange={e => setVitals({...vitals, bp: e.target.value})} placeholder="120/80" className="h-9 text-sm" /></div>
                <div><Label className="text-xs text-slate-500 mb-1 block">Pulse</Label><Input value={vitals.pulse} onChange={e => setVitals({...vitals, pulse: e.target.value})} placeholder="72" className="h-9 text-sm" /></div>
                <div><Label className="text-xs text-slate-500 mb-1 block">Temp</Label><Input value={vitals.temp} onChange={e => setVitals({...vitals, temp: e.target.value})} placeholder="98.6" className="h-9 text-sm" /></div>
                <div><Label className="text-xs text-slate-500 mb-1 block">Weight</Label><Input value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value})} placeholder="70" className="h-9 text-sm" /></div>
                <div className="col-span-2"><Label className="text-xs text-slate-500 mb-1 block">SPO2 %</Label><Input value={vitals.spo2} onChange={e => setVitals({...vitals, spo2: e.target.value})} placeholder="98" className="h-9 text-sm" /></div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Clinical Input (Dynamic by Specialty) */}
        <div className="lg:col-span-3 space-y-6">
          
          {isEyeSlip ? (
            // ==========================================
            // OPHTHALMOLOGY TEMPLATE
            // ==========================================
            <div className="space-y-6">
              
              {/* TOP GRID: VA & Refraction */}
              <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm overflow-x-auto">
                <h2 className="flex items-center gap-2 text-sm font-bold text-[#1E3A6E] mb-4">
                  <Eye className="h-4 w-4 text-[#2E5FA3]" /> Refraction & Measurements
                </h2>
                <table className="w-full text-sm border-collapse border border-slate-200 min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-slate-200 p-2 font-bold text-center w-[40%]">RIGHT EYE (OD)</th>
                      <th className="border border-slate-200 p-2 font-bold text-center w-[40%]">LEFT EYE (OS)</th>
                      <th className="border border-slate-200 p-2 font-bold text-center w-[20%]">TESTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 p-0 align-top">
                        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/50">
                          <div className="p-2 border-r border-slate-200"><Label className="text-xs mb-1 block">VA</Label><Input className="h-8 text-xs" value={eyeFindings.right.va} onChange={e => updateEye('right', 'va', e.target.value)} /></div>
                          <div className="p-2 border-r border-slate-200"><Label className="text-xs mb-1 block">PH</Label><Input className="h-8 text-xs" value={eyeFindings.right.ph} onChange={e => updateEye('right', 'ph', e.target.value)} /></div>
                          <div className="p-2"><Label className="text-xs mb-1 block">Glasses</Label><Input className="h-8 text-xs" value={eyeFindings.right.glasses} onChange={e => updateEye('right', 'glasses', e.target.value)} /></div>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-200">
                          <div className="p-2 border-r border-slate-200"><Label className="text-xs mb-1 block">SPHERE</Label><Input className="h-8 text-xs" value={eyeFindings.right.sph} onChange={e => updateEye('right', 'sph', e.target.value)} /></div>
                          <div className="p-2 border-r border-slate-200"><Label className="text-xs mb-1 block">CYLINDER</Label><Input className="h-8 text-xs" value={eyeFindings.right.cyl} onChange={e => updateEye('right', 'cyl', e.target.value)} /></div>
                          <div className="p-2"><Label className="text-xs mb-1 block">AXIS</Label><Input className="h-8 text-xs" value={eyeFindings.right.axis} onChange={e => updateEye('right', 'axis', e.target.value)} /></div>
                        </div>
                        <div className="p-2 bg-slate-50/50">
                          <Label className="text-xs mb-1 block">IOP</Label><Input className="h-8 text-xs w-1/2" value={eyeFindings.right.iop} onChange={e => updateEye('right', 'iop', e.target.value)} />
                        </div>
                      </td>
                      <td className="border border-slate-200 p-0 align-top">
                        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/50">
                          <div className="p-2 border-r border-slate-200"><Label className="text-xs mb-1 block">VA</Label><Input className="h-8 text-xs" value={eyeFindings.left.va} onChange={e => updateEye('left', 'va', e.target.value)} /></div>
                          <div className="p-2 border-r border-slate-200"><Label className="text-xs mb-1 block">PH</Label><Input className="h-8 text-xs" value={eyeFindings.left.ph} onChange={e => updateEye('left', 'ph', e.target.value)} /></div>
                          <div className="p-2"><Label className="text-xs mb-1 block">Glasses</Label><Input className="h-8 text-xs" value={eyeFindings.left.glasses} onChange={e => updateEye('left', 'glasses', e.target.value)} /></div>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-200">
                          <div className="p-2 border-r border-slate-200"><Label className="text-xs mb-1 block">SPHERE</Label><Input className="h-8 text-xs" value={eyeFindings.left.sph} onChange={e => updateEye('left', 'sph', e.target.value)} /></div>
                          <div className="p-2 border-r border-slate-200"><Label className="text-xs mb-1 block">CYLINDER</Label><Input className="h-8 text-xs" value={eyeFindings.left.cyl} onChange={e => updateEye('left', 'cyl', e.target.value)} /></div>
                          <div className="p-2"><Label className="text-xs mb-1 block">AXIS</Label><Input className="h-8 text-xs" value={eyeFindings.left.axis} onChange={e => updateEye('left', 'axis', e.target.value)} /></div>
                        </div>
                        <div className="p-2 bg-slate-50/50">
                          <Label className="text-xs mb-1 block">IOP</Label><Input className="h-8 text-xs w-1/2" value={eyeFindings.left.iop} onChange={e => updateEye('left', 'iop', e.target.value)} />
                        </div>
                      </td>
                      <td className="border border-slate-200 p-3 align-top space-y-3 bg-white">
                        <div><Label className="text-[10px] uppercase text-slate-500 mb-1 block">Urine / Sugar</Label><Input className="h-8 text-xs" value={eyeFindings.tests.urineSugar} onChange={e => updateTest('urineSugar', e.target.value)} /></div>
                        <div><Label className="text-[10px] uppercase text-slate-500 mb-1 block">RBS</Label><Input className="h-8 text-xs" value={eyeFindings.tests.rbs} onChange={e => updateTest('rbs', e.target.value)} /></div>
                        <div><Label className="text-[10px] uppercase text-slate-500 mb-1 block">CP.ESR</Label><Input className="h-8 text-xs" value={eyeFindings.tests.cpEsr} onChange={e => updateTest('cpEsr', e.target.value)} /></div>
                        <div><Label className="text-[10px] uppercase text-slate-500 mb-1 block">Others</Label><Input className="h-8 text-xs" value={eyeFindings.tests.others} onChange={e => updateTest('others', e.target.value)} /></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* BOTTOM SECTION: Checklists & History */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-100 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#2E5FA3] mb-3 border-b border-slate-100 pb-2 flex items-center gap-1.5"><CheckSquare className="h-3.5 w-3.5" /> Systemic Illness</h3>
                    <div className="space-y-2">
                      {SYSTEMIC_ILLNESSES.map(item => (
                        <label key={item} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                          <input type="checkbox" checked={eyeFindings.systemic.includes(item)} onChange={() => toggleArray('systemic', item)} className="rounded border-slate-300 text-[#2E5FA3]" />
                          {item}
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <Label className="text-xs text-slate-500 mb-1 block">Allergies</Label>
                      <Input value={eyeFindings.allergies} onChange={e => setEyeFindings({...eyeFindings, allergies: e.target.value})} className="h-8 text-xs" placeholder="Note allergies..." />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-100 shadow-sm h-96 overflow-y-auto">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#2E5FA3] mb-3 border-b border-slate-100 pb-2 flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> Ocular Findings</h3>
                    <div className="space-y-2">
                      {OCULAR_FINDINGS.map(item => (
                        <label key={item} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                          <input type="checkbox" checked={eyeFindings.ocular.includes(item)} onChange={() => toggleArray('ocular', item)} className="rounded border-slate-300 text-[#2E5FA3]" />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-100 shadow-sm space-y-4">
                    <div>
                      <Label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Presenting Complaints / Clinical History</Label>
                      <Textarea value={eyeFindings.clinicalHistory} onChange={e => setEyeFindings({...eyeFindings, clinicalHistory: e.target.value})} className="min-h-[80px] text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Family History</Label>
                      <Textarea value={eyeFindings.familyHistory} onChange={e => setEyeFindings({...eyeFindings, familyHistory: e.target.value})} className="min-h-[60px] text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block flex justify-between">
                        <span>Ocular Examination / Diagnosis</span>
                        <span className="text-slate-400 font-normal normal-case">(Replaces primary diagnosis)</span>
                      </Label>
                      <Textarea value={eyeFindings.ocularExam} onChange={e => setEyeFindings({...eyeFindings, ocularExam: e.target.value})} className="min-h-[160px] text-sm" placeholder="Detailed examination notes..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Prognosis</Label>
                        <select value={eyeFindings.prognosis} onChange={e => setEyeFindings({...eyeFindings, prognosis: e.target.value})} className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5FA3]">
                          <option>Good</option>
                          <option>Fair</option>
                          <option>Poor</option>
                          <option>Guarded</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Remarks</Label>
                        <Input value={eyeFindings.remarks} onChange={e => setEyeFindings({...eyeFindings, remarks: e.target.value})} className="h-10 text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            // ==========================================
            // GENERAL PHYSICIAN / ALL OTHERS TEMPLATE
            // ==========================================
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Clinical History & Quick Toggles */}
                <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm space-y-5">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-[#1E3A6E]">
                    <Stethoscope className="h-4 w-4 text-[#2E5FA3]" /> Clinical Assessment
                  </h2>
                  <div className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700">
                      <input type="checkbox" checked={gpFindings.dm} onChange={e => setGpFindings({...gpFindings, dm: e.target.checked})} className="rounded border-slate-300 text-[#2E5FA3] focus:ring-[#2E5FA3]" /> DM
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700">
                      <input type="checkbox" checked={gpFindings.htn} onChange={e => setGpFindings({...gpFindings, htn: e.target.checked})} className="rounded border-slate-300 text-[#2E5FA3] focus:ring-[#2E5FA3]" /> HTN
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700">
                      <input type="checkbox" checked={gpFindings.smok} onChange={e => setGpFindings({...gpFindings, smok: e.target.checked})} className="rounded border-slate-300 text-[#2E5FA3] focus:ring-[#2E5FA3]" /> Smok
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700">
                      <input type="checkbox" checked={gpFindings.cPlus} onChange={e => setGpFindings({...gpFindings, cPlus: e.target.checked})} className="rounded border-slate-300 text-[#2E5FA3] focus:ring-[#2E5FA3]" /> C+
                    </label>
                  </div>
                  <div>
                    <Label className="text-slate-700 mb-2 block">Presenting Complaints & History</Label>
                    <Textarea value={gpFindings.notes} onChange={e => setGpFindings({...gpFindings, notes: e.target.value})} placeholder="Complaints/History..." className="min-h-[140px]" />
                  </div>
                  <div className="pt-2">
                    <Label className="text-slate-700 mb-2 block">Primary Diagnosis (Δ)</Label>
                    <Input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="e.g. Acute Viral Pharyngitis" className="h-11 font-bold text-[#1E3A6E]" />
                  </div>
                </div>

                {/* Lab Investigations Grid */}
                <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-[#1E3A6E] mb-4">
                    <Beaker className="h-4 w-4 text-[#2E5FA3]" /> Lab Investigations
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 border-r border-slate-100 pr-4">
                      {['bsf', 'bsr', 'cr', 'lft', 'tsh', 'a1c'].map(lab => (
                        <div key={lab} className="flex items-center gap-2">
                          <Label className="w-12 text-xs font-bold uppercase text-slate-600">{lab}</Label>
                          <Input value={(gpFindings.labs as any)[lab]} onChange={e => updateLab(lab, e.target.value)} className="h-8 text-xs" />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {['hb', 'tlc', 'esr', 'b', 'c'].map(lab => (
                        <div key={lab} className="flex items-center gap-2">
                          <Label className="w-12 text-xs font-bold uppercase text-slate-600">{lab}</Label>
                          <Input value={(gpFindings.labs as any)[lab]} onChange={e => updateLab(lab, e.target.value)} className="h-8 text-xs" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Label className="w-12 text-xs font-bold uppercase text-slate-600">ECG</Label>
                      <Input value={gpFindings.labs.ecg} onChange={e => updateLab('ecg', e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="w-12 text-xs font-bold uppercase text-slate-600">USG</Label>
                      <Input value={gpFindings.labs.usg} onChange={e => updateLab('usg', e.target.value)} className="h-8 text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rx MEDICATIONS */}
          <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#1E3A6E]">
                <FileText className="h-4 w-4 text-[#2E5FA3]" /> Rx / Medications
              </h2>
              <Button type="button" onClick={addMedication} variant="outline" size="sm" className="h-8 text-xs bg-slate-50 hover:bg-slate-100 border-slate-200">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Medicine
              </Button>
            </div>
            
            <div className="space-y-3">
              {medications.map((med, idx) => (
                <div key={idx} className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl ring-1 ring-slate-200">
                  <div className="flex-1 grid grid-cols-12 gap-3">
                    <div className="col-span-12 sm:col-span-4">
                      <Input value={med.name} onChange={e => updateMedication(idx, 'name', e.target.value)} placeholder="Medicine Name" className="h-9 text-sm font-semibold text-[#1E3A6E]" />
                    </div>
                    {isEyeSlip ? (
                      <>
                        <div className="col-span-4 sm:col-span-3">
                          <Input value={med.dosage} onChange={e => updateMedication(idx, 'dosage', e.target.value)} placeholder="1 Drop" className="h-9 text-sm" />
                        </div>
                        <div className="col-span-4 sm:col-span-3">
                          <Input value={med.frequency} onChange={e => updateMedication(idx, 'frequency', e.target.value)} placeholder="Freq (TDS)" className="h-9 text-sm" />
                        </div>
                      </>
                    ) : (
                      <div className="col-span-12 sm:col-span-5 flex items-center justify-between bg-white rounded-lg border border-slate-200 px-3 h-9 overflow-x-auto">
                        <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer whitespace-nowrap pr-2"><input type="checkbox" checked={med.m} onChange={e => updateMedication(idx, 'm', e.target.checked)} className="rounded border-slate-300 text-[#2E5FA3]" /> صبح</label>
                        <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer whitespace-nowrap pr-2"><input type="checkbox" checked={med.a} onChange={e => updateMedication(idx, 'a', e.target.checked)} className="rounded border-slate-300 text-[#2E5FA3]" /> دوپہر</label>
                        <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer whitespace-nowrap pr-2"><input type="checkbox" checked={med.n} onChange={e => updateMedication(idx, 'n', e.target.checked)} className="rounded border-slate-300 text-[#2E5FA3]" /> رات</label>
                        <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer whitespace-nowrap"><input type="checkbox" checked={med.bm} onChange={e => updateMedication(idx, 'bm', e.target.checked)} className="rounded border-slate-300 text-[#2E5FA3]" /> کھانے سے پہلے / بعد</label>
                      </div>
                    )}
                    <div className="col-span-4 sm:col-span-2">
                      <Input value={med.duration} onChange={e => updateMedication(idx, 'duration', e.target.value)} placeholder="Days (5)" className="h-9 text-sm" />
                    </div>
                  </div>
                  <button onClick={() => removeMedication(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors mt-0.5" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {medications.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No medications added.</p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 grid sm:grid-cols-2 gap-5">
              {!isEyeSlip && (
                <div className="sm:col-span-2">
                  <Label className="text-slate-700 mb-2 block">حسب ضرورت ادویات (PRN Medicines)</Label>
                  <Input value={gpFindings.prn} onChange={e => setGpFindings({...gpFindings, prn: e.target.value})} placeholder="e.g. Panadol SOS" className="h-11" />
                </div>
              )}
              <div className="sm:col-span-2">
                <Label className="text-slate-700 mb-2 block">{isEyeSlip ? 'General Instructions' : 'خصوصی ہدایات (Special Instructions)'}</Label>
                <Input value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Advice / Instructions..." className="h-11" />
              </div>
              <div>
                <Label className="text-slate-700 mb-2 block">Follow-up In (Days)</Label>
                <Input value={followUpDays} onChange={e => setFollowUpDays(e.target.value)} type="number" placeholder="e.g. 7" className="h-11" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}