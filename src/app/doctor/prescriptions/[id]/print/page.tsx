import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PrintButton from '@/components/doctor/PrintButton';

export default async function PrintPrescriptionPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return notFound();

  const { id } = await params;
  const prescription = await prisma.prescription.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
    }
  });

  if (!prescription) return notFound();

  const { patient, doctor, templateType } = prescription;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vitals = prescription.vitals as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cf = prescription.clinicalFindings as any; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const medications = (prescription.medications as any[]) || [];
  
  const isEyeSlip = templateType === 'OPHTHALMOLOGY';
  const isPremiumGP = templateType === 'GENERAL_PHYSICIAN';
  const isStandardGP = !isEyeSlip && !isPremiumGP;

  const visitDate = new Date(prescription.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
  
  const visitTime = new Date(prescription.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false
  });

  return (
    <div className="min-h-screen bg-slate-200 py-8 print:py-0 print:bg-white flex flex-col items-center font-sans text-black">
      
      {/* Strict Print Styles for Exact A4 Dimensions and Lined Paper effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .print-container {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            overflow: hidden !important;
          }
        }
        .lined-paper {
          background-image: repeating-linear-gradient(transparent, transparent 23px, #1E3A6E 24px);
          line-height: 24px;
        }
      `}} />

      {/* Non-Printable Action Bar */}
      <div className="w-[210mm] mb-6 flex justify-between items-center print:hidden bg-white p-4 rounded-xl shadow-sm">
        <Link href="/doctor/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#1E3A6E]">
          <ArrowLeft className="h-4 w-4" /> Back to Queue
        </Link>
        <PrintButton />
      </div>

      {/* A4 Printable Area */}
      <div className={`print-container w-[210mm] min-h-[297mm] mx-auto shadow-xl relative overflow-hidden text-[11px] leading-tight ${isStandardGP ? 'bg-[#dcf0ff]' : 'bg-white'}`}>
        
        {isEyeSlip ? (
          // ==========================================
          // 1. OPHTHALMOLOGY SPECIFIC LAYOUT
          // ==========================================
          <>
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#1E3A6E] to-[#2E5FA3]"></div>
            <div className="px-10 pt-10 pb-4">
              <div className="text-center mb-6 border-b-2 border-black pb-4">
                <h1 className="text-2xl font-bold uppercase tracking-widest mb-1">Syed Hospital</h1>
                <p className="text-xs">Dr Habib Shah Chowk, Farooqabad | Phone: 0300-1187088</p>
              </div>

              <div className="flex justify-between items-start">
                <table className="w-1/2 text-[10px]">
                  <tbody>
                    <tr><td className="font-bold w-20 py-0.5">MR. #:</td><td className="font-mono text-sm font-bold">{patient.mrNumber}</td></tr>
                    <tr><td className="font-bold py-0.5">MR Date:</td><td>{visitDate}</td></tr>
                    <tr><td className="font-bold py-0.5">Name:</td><td className="font-bold text-[11px] uppercase">{patient.fullName}</td></tr>
                    <tr><td className="font-bold py-0.5">W/O:</td><td className="uppercase">{patient.guardianName || '—'}</td></tr>
                    <tr><td className="font-bold py-0.5">Gender:</td><td className="uppercase">{patient.gender}</td></tr>
                    <tr><td className="font-bold py-0.5">Address:</td><td className="uppercase truncate max-w-[200px]">{patient.address}</td></tr>
                  </tbody>
                </table>
                <div className="w-1/3 text-center">
                  <div className="inline-block border border-black rounded-full px-6 py-1 font-bold text-base mb-2">
                    O P D   S L I P
                  </div>
                </div>
                <table className="w-[30%] text-[10px]">
                  <tbody>
                    <tr><td className="font-bold w-20 py-0.5">Token #:</td><td className="font-mono font-bold text-sm">{patient.tokenNumber || '—'}</td></tr>
                    <tr><td className="font-bold py-0.5">Time:</td><td>{visitTime}</td></tr>
                    <tr><td className="font-bold py-0.5">Age:</td><td>{patient.age} {patient.ageUnit.charAt(0).toUpperCase()}</td></tr>
                    <tr><td className="font-bold py-0.5">CNIC#:</td><td>{patient.cnicNumber || patient.guardianCnic || '—'}</td></tr>
                    <tr><td className="font-bold py-0.5">Telephone#:</td><td>{patient.mobile || patient.guardianMobile || '—'}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6">
              
              {/* TOP GRID: Refraction & Tests */}
              <table className="w-full border-collapse border border-black mb-0 text-[10px]">
                <thead>
                  <tr>
                    <th className="border border-black text-left pl-2 py-1 w-[40%]">RIGHT EYE</th>
                    <th className="border border-black text-left pl-2 py-1 w-[40%]">LEFT EYE</th>
                    <th className="border border-black text-left pl-2 py-1 w-[20%]"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-0 align-top h-20 relative">
                      <div className="flex w-full h-8 border-b border-black text-center items-center divide-x divide-black">
                        <div className="w-1/3"><span className="text-[9px] mr-1">VA</span> <span className="font-bold">{cf?.right?.va}</span></div>
                        <div className="w-1/3"><span className="text-[9px] mr-1">PH</span> <span className="font-bold">{cf?.right?.ph}</span></div>
                        <div className="w-1/3"><span className="text-[9px] mr-1 font-bold">Glasses</span> <span className="font-bold">{cf?.right?.glasses}</span></div>
                      </div>
                      <table className="w-full h-12 text-center table-fixed">
                        <thead>
                          <tr className="text-[8px] uppercase text-gray-600 border-b border-black">
                            <th className="font-normal w-1/3 border-r border-black">Sphere</th>
                            <th className="font-normal w-1/3 border-r border-black">Cylinder</th>
                            <th className="font-normal w-1/3">Axis</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="font-bold text-[11px]">
                            <td className="border-r border-black py-1 break-words">{cf?.right?.sph}</td>
                            <td className="border-r border-black py-1 break-words">{cf?.right?.cyl}</td>
                            <td className="py-1 break-words">{cf?.right?.axis}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="absolute bottom-1 left-2 text-[9px]">IOP: <span className="font-bold text-[11px] ml-1">{cf?.right?.iop}</span></div>
                    </td>
                    <td className="border border-black p-0 align-top h-20 relative">
                      <div className="flex w-full h-8 border-b border-black text-center items-center divide-x divide-black">
                        <div className="w-1/3"><span className="text-[9px] mr-1">VA</span> <span className="font-bold">{cf?.left?.va}</span></div>
                        <div className="w-1/3"><span className="text-[9px] mr-1">PH</span> <span className="font-bold">{cf?.left?.ph}</span></div>
                        <div className="w-1/3"><span className="text-[9px] mr-1 font-bold">Glasses</span> <span className="font-bold">{cf?.left?.glasses}</span></div>
                      </div>
                      <table className="w-full h-12 text-center table-fixed">
                        <thead>
                          <tr className="text-[8px] uppercase text-gray-600 border-b border-black">
                            <th className="font-normal w-1/3 border-r border-black">Sphere</th>
                            <th className="font-normal w-1/3 border-r border-black">Cylinder</th>
                            <th className="font-normal w-1/3">Axis</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="font-bold text-[11px]">
                            <td className="border-r border-black py-1 break-words">{cf?.left?.sph}</td>
                            <td className="border-r border-black py-1 break-words">{cf?.left?.cyl}</td>
                            <td className="py-1 break-words">{cf?.left?.axis}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="absolute bottom-1 left-2 text-[9px]">IOP: <span className="font-bold text-[11px] ml-1">{cf?.left?.iop}</span></div>
                    </td>
                    <td className="border border-black p-2 align-top text-[9px] leading-tight space-y-1">
                      <div className="font-bold underline mb-1">TESTS</div>
                      <div className="truncate">URINE/SUGAR: <span className="font-bold ml-1">{cf?.tests?.urineSugar}</span></div>
                      <div className="truncate">RBS: <span className="font-bold ml-1">{cf?.tests?.rbs}</span></div>
                      <div className="truncate">CP.ESR: <span className="font-bold ml-1">{cf?.tests?.cpEsr}</span></div>
                      <div className="truncate">OTHERS: <span className="font-bold ml-1">{cf?.tests?.others}</span></div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* OVERLAP FIX: Strict HTML Table for Middle Row to prevent Prognosis from jumping */}
              <table className="w-full border-collapse border-x border-b border-black text-[10px]">
                <tbody>
                  <tr>
                    <td className="w-[30%] border-r border-black p-2 align-top uppercase font-bold text-gray-600 bg-gray-50/20 text-[9px]">
                      Presenting Complaints
                    </td>
                    <td className="w-[50%] p-0 align-top">
                      <div className="border-b border-black p-2 min-h-[50px]">
                        <span className="font-bold text-gray-600 uppercase text-[9px] block mb-1">Clinical History</span>
                        <div className="text-[11px] leading-relaxed break-words text-slate-800">{cf?.clinicalHistory}</div>
                      </div>
                      <div className="p-2 min-h-[50px]">
                        <span className="font-bold text-gray-600 uppercase text-[9px] block mb-1">Family History</span>
                        <div className="text-[11px] leading-relaxed break-words text-slate-800">{cf?.familyHistory}</div>
                      </div>
                    </td>
                    <td className="w-[20%] border-l border-black align-bottom pb-2 pr-2 relative">
                      {/* Fixed Prognosis Box positioned strictly inside the TD */}
                      <div className="border border-black ml-4 mt-auto">
                        <div className="text-center font-bold text-gray-600 border-b border-black bg-gray-100 py-0.5 text-[9px]">
                          Prognosis
                        </div>
                        <div className="flex divide-x divide-black text-center text-[9px]">
                          <div className={`flex-1 py-1 ${cf?.prognosis==='Good'?'font-bold bg-black text-white':''}`}>Good</div>
                          <div className={`flex-1 py-1 ${cf?.prognosis==='Fair'?'font-bold bg-black text-white':''}`}>Fair</div>
                          <div className={`flex-1 py-1 ${cf?.prognosis==='Poor'?'font-bold bg-black text-white':''}`}>Poor</div>
                          <div className={`flex-1 py-1 ${cf?.prognosis==='Guarded'?'font-bold bg-black text-white':''}`}>Guarded</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Bottom Section: Checklists & Examination */}
              <div className="flex border-x border-b border-black min-h-[400px]">
                <div className="w-[30%] border-r border-black p-2 bg-gray-50/20">
                  <div className="font-bold text-[10px] uppercase mb-2">Systemic Illness</div>
                  <div className="space-y-1 text-[9px]">
                    {['Hypertension', 'Cardiac / IHD', 'Diabetes', 'Asthma', 'H/O Jaundice', 'Any Others'].map(item => (
                      <div key={item} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 border border-black flex items-center justify-center">
                          {cf?.systemic?.includes(item) ? '✓' : ''}
                        </div>
                        <span className="uppercase">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 font-bold text-[10px] uppercase mb-1 border-t border-gray-300 pt-2">Allergies</div>
                  <div className="text-[10px] font-medium min-h-[20px] break-words whitespace-pre-wrap leading-tight">{cf?.allergies || 'NIL'}</div>

                  <div className="mt-4 font-bold text-[10px] uppercase mb-2 border-t border-gray-300 pt-2">Ocular Findings</div>
                  <div className="space-y-1 text-[9px]">
                    {['Refractive Error', 'Lid Disorder', 'Conjunctivitis', 'Trachoma', 'Foreign Body', 
                      'Vitamin A Deficiency', 'Corneal Opacity', 'Cataract', 'Glaucoma Suspect', 
                      'Squint/Ocular Motility', 'Uveitis', 'Diabetic Retinopathy', 'Vitreo Retinal Disorder', 
                      'Optic Nerve Disorder', 'Ocular Trauma', 'Infections', 'Dacryocystitis', 'Any Other / NAD'].map(item => (
                      <div key={item} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 border border-black flex items-center justify-center">
                          {cf?.ocular?.includes(item) ? '✓' : ''}
                        </div>
                        <span className="uppercase">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 font-bold text-[10px] uppercase">Remarks</div>
                  <div className="text-[10px] break-words whitespace-pre-wrap leading-tight">{cf?.remarks}</div>
                </div>

                {/* Right Column: Examination notes and Rx */}
                <div className="w-[70%] p-3 flex flex-col relative">
                  <div className="text-[9px] uppercase font-bold text-gray-500 mb-2">Ocular Examination</div>
                  <div className="text-[12px] whitespace-pre-wrap break-words leading-relaxed text-slate-800 mb-6">{cf?.ocularExam}</div>

                  {/* Medicines */}
                  {medications.length > 0 && (
                    <div className="mt-4">
                      <div className="text-2xl font-serif font-bold italic mb-2">Rx</div>
                      <div className="space-y-3">
                        {medications.map((med, idx) => (
                          <div key={idx} className="flex justify-between items-baseline border-b border-gray-100 pb-1">
                            <div className="text-[12px] font-bold uppercase text-black break-words max-w-[60%]">{idx+1}. {med.name}</div>
                            <div className="text-[10px] text-right">
                              {med.dosage} {med.frequency && ` | ${med.frequency}`} {med.duration && ` | For ${med.duration}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {prescription.instructions && (
                    <div className="mt-4 text-[12px] leading-relaxed break-words text-slate-800 pr-48">
                      <span className="font-bold underline text-black">Advice:</span> {prescription.instructions}
                    </div>
                  )}
                  {prescription.followUpDays && (
                    <div className="mt-2 text-[12px] font-bold text-black">
                      Follow up after: {prescription.followUpDays} days
                    </div>
                  )}

                  {/* Bottom right signature box */}
                  <div className="absolute bottom-4 right-4 w-48 border border-black bg-white">
                    <div className="px-2 py-1 border-b border-black min-h-[40px]">
                      <div className="text-[8px] uppercase font-bold text-gray-500">Provisional Diagnosis</div>
                      <div className="font-bold text-[11px] leading-tight mt-1 break-words uppercase">{prescription.diagnosis}</div>
                    </div>
                    <div className="px-2 py-1 flex justify-between items-end h-12">
                      <div className="text-[8px] text-gray-500 uppercase">Sign / Name / Time</div>
                      <div className="text-right">
                        <div className="font-bold text-[10px]">{doctor.fullName}</div>
                        <div className="text-[8px] text-gray-500">CODE: {doctor.pmdcNumber || 'OPD'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // ==========================================
          // 2 & 3. GP LAYOUTS (Premium Dark Blue vs Standard Light Blue)
          // ==========================================
          <div className="h-[297mm] flex flex-col border-[3px] border-[#1E3A6E]">
            <div className="flex flex-1">
              
              {/* Left Sidebar (30%) */}
              <div className={`w-[30%] border-r-[3px] border-[#1E3A6E] flex flex-col ${isPremiumGP ? 'bg-[#F8FAFC]' : 'bg-transparent'}`}>
                
                {/* Patient Details */}
                <div className="p-3 border-b-[3px] border-[#1E3A6E]">
                  <div className="text-[11px] space-y-2">
                    <div className="flex gap-2"><span className="w-16 font-bold">Ref.No:</span> <span className="flex-1 border-b border-black text-[#1E3A6E] font-bold font-mono truncate">{patient.tokenNumber ?? patient.mrNumber}</span></div>
                    <div className="flex gap-2"><span className="w-16 font-bold">Date:</span> <span className="flex-1 border-b border-black font-semibold truncate">{visitDate}</span></div>
                    <div className="flex gap-2"><span className="w-16 font-bold">Time:</span> <span className="flex-1 border-b border-black font-semibold truncate">{visitTime}</span></div>
                    <div className="flex gap-2 mt-2"><span className="w-16 font-bold">Name:</span> <span className="flex-1 border-b border-black font-bold uppercase truncate">{patient.fullName}</span></div>
                    <div className="flex gap-2"><span className="w-16 font-bold">S/W/D/O:</span> <span className="flex-1 border-b border-black uppercase truncate">{patient.guardianName || ' '}</span></div>
                    <div className="flex gap-2"><span className="w-16 font-bold">Age/Sex:</span> <span className="flex-1 border-b border-black uppercase truncate">{patient.age}{patient.ageUnit.charAt(0)} / {patient.gender}</span></div>
                    <div className="flex gap-2"><span className="w-16 font-bold">Address:</span> <span className="flex-1 border-b border-black uppercase truncate">{patient.address}</span></div>
                  </div>
                </div>

                {/* History Toggles & Ruled Lines Text Box */}
                <div className="p-3 border-b-[3px] border-[#1E3A6E]">
                  <div className="flex justify-between items-center font-bold text-[12px] mb-3">
                    <span className={cf?.dm ? 'text-black border-b-2 border-black' : 'text-slate-500'}>DM</span>
                    <span className={cf?.htn ? 'text-black border-b-2 border-black' : 'text-slate-500'}>HTN</span>
                    <span className={cf?.smok ? 'text-black border-b-2 border-black' : 'text-slate-500'}>Smok</span>
                    <span className={cf?.cPlus ? 'text-black border-b-2 border-black' : 'text-slate-500'}>C+</span>
                  </div>
                  <div className="font-bold text-[12px] mb-1 text-black flex items-center gap-1">
                    Complaints/History: <div className="border-b border-black flex-1 min-w-[20px]"></div>
                  </div>
                  
                  {/* The Lined Paper Effect forcing exact line heights */}
                  <div className="lined-paper min-h-[96px] w-full text-[13px] break-words whitespace-pre-wrap text-slate-800 font-medium">
                    {cf?.notes}
                  </div>
                </div>

                {/* Vitals & Labs */}
                <div className="p-3 border-b-[3px] border-[#1E3A6E] flex-1">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-[11px] mb-6">
                    <div className="flex items-end gap-1"><span className="font-bold">SPO2</span> <div className="flex-1 border-b border-black text-center font-semibold truncate">{vitals?.spo2 || ' '}</div></div>
                    <div className="flex items-end gap-1"><span className="font-bold">Temp</span> <div className="flex-1 border-b border-black text-center font-semibold truncate">{vitals?.temp || ' '}</div></div>
                    <div className="flex items-end gap-1"><span className="font-bold">B.P</span> <div className="flex-1 border-b border-black text-center font-semibold truncate">{vitals?.bp || ' '}</div></div>
                    <div className="flex items-end gap-1"><span className="font-bold">Pulse</span> <div className="flex-1 border-b border-black text-center font-semibold truncate">{vitals?.pulse || ' '}</div></div>
                  </div>

                  <table className="w-full border-collapse border-2 border-black text-[10px] font-bold text-center table-fixed">
                    <tbody>
                      <tr><td className="border border-black py-1.5 w-1/4 bg-black/5">BSF</td><td className="border border-black py-1.5 w-1/4 font-semibold break-words">{cf?.labs?.bsf}</td><td className="border border-black py-1.5 w-1/4 bg-black/5">HB</td><td className="border border-black py-1.5 w-1/4 font-semibold break-words">{cf?.labs?.hb}</td></tr>
                      <tr><td className="border border-black py-1.5 bg-black/5">BSR</td><td className="border border-black py-1.5 font-semibold break-words">{cf?.labs?.bsr}</td><td className="border border-black py-1.5 bg-black/5">TLC</td><td className="border border-black py-1.5 font-semibold break-words">{cf?.labs?.tlc}</td></tr>
                      <tr><td className="border border-black py-1.5 bg-black/5">CR.</td><td className="border border-black py-1.5 font-semibold break-words">{cf?.labs?.cr}</td><td className="border border-black py-1.5 bg-black/5">ESR</td><td className="border border-black py-1.5 font-semibold break-words">{cf?.labs?.esr}</td></tr>
                      <tr><td className="border border-black py-1.5 bg-black/5">LFT</td><td className="border border-black py-1.5 font-semibold break-words">{cf?.labs?.lft}</td><td className="border border-black py-1.5 bg-black/5">B</td><td className="border border-black py-1.5 font-semibold break-words">{cf?.labs?.b}</td></tr>
                      <tr><td className="border border-black py-1.5 bg-black/5">TSH</td><td className="border border-black py-1.5 font-semibold break-words">{cf?.labs?.tsh}</td><td className="border border-black py-1.5 bg-black/5">C</td><td className="border border-black py-1.5 font-semibold break-words">{cf?.labs?.c}</td></tr>
                      <tr><td className="border border-black py-1.5 bg-black/5">A1C</td><td className="border border-black py-1.5 col-span-3 text-left pl-2 font-semibold break-words">{cf?.labs?.a1c}</td></tr>
                    </tbody>
                  </table>
                  
                  <div className="mt-5 space-y-3 text-[12px]">
                    <div className="flex items-end gap-2"><span className="font-bold">ECG</span> <div className="flex-1 border-b border-black pl-2 font-semibold truncate">{cf?.labs?.ecg}</div></div>
                    <div className="flex items-end gap-2"><span className="font-bold">USG</span> <div className="flex-1 border-b border-black pl-2 font-semibold truncate">{cf?.labs?.usg}</div></div>
                    <div className="border-b border-black h-4 mt-2"></div>
                    <div className="border-b border-black h-4"></div>
                  </div>
                </div>
              </div>

              {/* Right Main Area (70%) */}
              <div className={`w-[70%] flex flex-col ${isPremiumGP ? 'bg-white' : 'bg-transparent'}`}>
                
                {/* Header Section */}
                <div className={`p-5 border-b-[3px] border-[#1E3A6E] flex justify-between items-start ${isPremiumGP ? 'bg-[#1E3A6E] text-white' : 'bg-transparent'}`}>
                  <div className="flex-1">
                    <h1 className={`text-4xl font-extrabold tracking-tight font-sans uppercase mb-1 drop-shadow-md ${isPremiumGP ? 'text-white' : 'text-[#1E3A6E]'}`}>
                      SYED HOSPITAL
                    </h1>
                    <p className={`text-[11px] font-bold ${isPremiumGP ? 'text-blue-100' : 'text-[#1E3A6E]'}`}>
                      Dr Habib Shah Chowk, Mohallah Rehmanpura, Farooqabad
                    </p>
                    <p className={`text-[11px] font-bold ${isPremiumGP ? 'text-white' : 'text-[#1E3A6E]'}`}>
                      Phone: 0300-1187088
                    </p>
                    <p className={`text-[11px] font-bold mt-2 pr-4 ${isPremiumGP ? 'text-white' : 'text-[#1E3A6E]'}`}>
                      Diabetes, Hypertension, Heart Diseases, Stomach, Liver
                    </p>
                  </div>
                  <div className="text-right pl-4">
                    <h2 className={`text-xl font-extrabold m-0 ${isPremiumGP ? 'text-yellow-400' : 'text-[#1E3A6E]'}`}>
                      {doctor.fullName}
                    </h2>
                    <p className={`text-sm font-bold mt-0.5 ${isPremiumGP ? 'text-white' : 'text-[#1E3A6E]'}`}>
                      {doctor.qualification}
                    </p>
                    {doctor.pmdcNumber && (
                      <p className={`text-[11px] font-bold mt-2 ${isPremiumGP ? 'text-blue-100' : 'text-[#1E3A6E]'}`}>
                        PMDC Reg. No: {doctor.pmdcNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Diagnosis Box */}
                <div className={`p-4 border-b-[3px] border-[#1E3A6E] flex items-end gap-2 text-sm ${isPremiumGP ? 'bg-white' : 'bg-transparent'}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mb-0.5 flex-shrink-0"><path d="m3 21 9-18 9 18z"/><path d="M12 21V10"/></svg>
                  <div className="flex-1 border-b border-black font-bold uppercase pb-0.5 text-[#1E3A6E] text-[13px] px-2 break-words leading-tight">
                    {prescription.diagnosis}
                  </div>
                </div>

                {/* Rx Table */}
                <div className="flex-1">
                  <table className="w-full text-center border-collapse text-[12px] font-bold text-black table-fixed">
                    <thead>
                      <tr className="border-b-[3px] border-[#1E3A6E]">
                        <th className="py-2.5 px-3 text-left text-3xl font-serif italic w-[45%]">Rx</th>
                        <th className="py-2.5 px-2 border-l-[3px] border-[#1E3A6E] w-[10%] leading-tight" style={{ direction: 'rtl' }}>صبح</th>
                        <th className="py-2.5 px-2 border-l border-[#1E3A6E] w-[10%] leading-tight" style={{ direction: 'rtl' }}>دوپہر</th>
                        <th className="py-2.5 px-2 border-l border-[#1E3A6E] w-[10%] leading-tight" style={{ direction: 'rtl' }}>رات</th>
                        <th className="py-2.5 px-2 border-l-[3px] border-[#1E3A6E] w-[15%] leading-tight" style={{ direction: 'rtl' }}>کھانے سے<br/>پہلے/بعد</th>
                        <th className="py-2.5 px-2 border-l-[3px] border-[#1E3A6E] w-[10%] leading-tight" style={{ direction: 'rtl' }}>دن تک</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(Math.max(12, medications.length))].map((_, i) => {
                        const med = medications[i];
                        return (
                          <tr key={i} className="border-b border-[#1E3A6E]/40 h-[28px]">
                            <td className="text-left px-4 text-black font-bold text-[12px] uppercase break-words leading-tight">{med ? med.name : ''}</td>
                            <td className="border-l-[3px] border-[#1E3A6E] text-black font-bold text-sm">{med?.m ? '✓' : ''}</td>
                            <td className="border-l border-[#1E3A6E] text-black font-bold text-sm">{med?.a ? '✓' : ''}</td>
                            <td className="border-l border-[#1E3A6E] text-black font-bold text-sm">{med?.n ? '✓' : ''}</td>
                            <td className="border-l-[3px] border-[#1E3A6E] text-black font-bold text-sm">{med?.bm ? '✓' : ''}</td>
                            <td className="border-l-[3px] border-[#1E3A6E] text-black font-medium text-[12px] truncate">{med?.duration || ''}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Strip */}
                <div className={`border-t-[3px] border-[#1E3A6E] ${isPremiumGP ? 'bg-white' : 'bg-transparent'}`}>
                  
                  <div className="flex justify-between items-center border-b-[3px] border-[#1E3A6E] p-2.5">
                    <div className="flex-1 font-bold text-[12px] uppercase pl-2 text-slate-800 break-words">{cf?.prn}</div>
                    <div className="font-bold text-[13px] text-black whitespace-nowrap" style={{ direction: 'rtl' }}>حسب ضرورت ادویات</div>
                  </div>

                  <div className="flex border-b-[3px] border-[#1E3A6E]">
                    <div className="w-[60%] flex gap-5 p-3 items-center justify-center">
                      <span className="w-4 h-4 rounded-full border-2 border-black"></span>
                      <span className="w-4 h-4 rounded-full border-2 border-black"></span>
                      <span className="w-4 h-4 rounded-full border-2 border-black"></span>
                      <span className="w-4 h-4 rounded-full border-2 border-black"></span>
                      <span className="w-4 h-4 rounded-full border-2 border-black"></span>
                    </div>
                    <div className="w-[40%] border-l-[3px] border-[#1E3A6E] p-2 flex items-center justify-center font-bold text-lg">
                      ER<span className="text-sm align-bottom font-serif ml-0.5">X</span>
                    </div>
                  </div>

                  <div className="flex justify-between p-3 min-h-[45px]">
                    <div className="flex-1 font-bold text-[12px] pl-2 pt-1 text-slate-800 break-words leading-relaxed">{prescription.instructions}</div>
                    <div className="font-bold text-[14px] text-black whitespace-nowrap" style={{ direction: 'rtl' }}>خصوصی ہدایات:</div>
                  </div>

                  {/* Dark Blue Footer */}
                  <div className={`${isPremiumGP ? 'bg-[#1E3A6E] text-white' : 'bg-transparent border-t-[3px] border-[#1E3A6E]'} p-3 flex justify-between items-center text-[11px] font-bold`}>
                    <div style={{ direction: 'rtl' }}>
                      <span className="font-bold font-mono underline mx-1 text-sm">{prescription.followUpDays || '  '}</span> دن بعد تشریف لائیں۔
                    </div>
                    <div className="text-center">
                      <span className="flex items-center justify-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        (WhatApp / SMS only NO CALL)
                      </span><br/>
                      <span className="text-[12px] font-semibold mt-0.5 inline-block">
                        برائے رابطہ <span className="font-mono text-[14px] tracking-tight">0300-1187088</span> صبح 9 بجے تا 2 بجے تک - شام 6 بجے تا 9 بجے تک ناغہ بروز اتوار
                      </span>
                    </div>
                  </div>
                  <div className={`${isPremiumGP ? 'bg-[#1E3A6E] text-white border-t border-white/20' : 'border-t-[3px] border-[#1E3A6E]'} p-2 text-center text-[12px] font-bold pb-3`} style={{ direction: 'rtl' }}>
                    نسخہ ہمیشہ ساتھ لائیں۔ دوا بغیر مشورہ بند نہ کریں
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}