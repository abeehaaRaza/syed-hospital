import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Phone, CreditCard, MapPin, Users, CalendarClock } from 'lucide-react';
import { getPatientWithVisits } from '@/lib/data';
import EditPatientForm from '@/components/admin/EditPatientForm';

export const metadata = { title: 'Patient Record · Syed Hospital' };

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPatientWithVisits(id);

  if (!result) notFound();
  const { patient, visits } = result;

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/admin/patients"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#2E5FA3] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all patients
      </Link>

      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <div className="w-28 h-28 rounded-2xl overflow-hidden ring-1 ring-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 relative">
          {patient.photoUrl ? (
            <Image src={patient.photoUrl} alt={patient.fullName} fill className="object-cover" />
          ) : (
            <User className="h-10 w-10 text-slate-300" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">
            {patient.fullName}
          </h1>
          <p className="font-mono font-semibold text-[#2E5FA3] mt-1">
            {patient.mrNumber}
            {patient.tokenNumber != null && (
              <span className="ml-3 inline-block bg-[#1E3A6E] text-white text-xs font-bold px-2.5 py-1 rounded-full align-middle">
                Token #{patient.tokenNumber}
              </span>
            )}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {patient.department}
            {patient.serviceRequired ? ` · ${patient.serviceRequired}` : ''} ·{' '}
            {visits.length} visit{visits.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Contact & Identity */}
      <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-[#1E3A6E] mb-4">Contact &amp; Identity</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-500">Patient CNIC:</span>
            <span className="text-slate-800 font-medium">{patient.cnicNumber || '—'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-500">Patient Mobile:</span>
            <span className="text-slate-800 font-medium">{patient.mobile || '—'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-500">Guardian CNIC:</span>
            <span className="text-slate-800 font-medium">{patient.guardianCnic || '—'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-500">Guardian Mobile:</span>
            <span className="text-slate-800 font-medium">{patient.guardianMobile || '—'}</span>
          </div>
          {patient.guardianName && (
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-500">Guardian Name:</span>
              <span className="text-slate-800 font-medium">{patient.guardianName}</span>
            </div>
          )}
          <div className="flex items-start gap-3 sm:col-span-2">
            <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span className="text-slate-500">Address:</span>
            <span className="text-slate-800 font-medium">{patient.address}</span>
          </div>
        </div>
      </div>

      {/* Visit history */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-100 shadow-sm mb-6 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-[#2E5FA3]" />
          <h2 className="text-lg font-bold text-[#1E3A6E]">Visit History</h2>
        </div>
        {visits.length === 0 ? (
          <p className="px-6 py-8 text-center text-slate-400 text-sm">No visits recorded.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="px-6 py-3 font-semibold">Visit</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Department</th>
                <th className="px-6 py-3 font-semibold">Service</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => (
                <tr key={v.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-3">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-[#EFF6FF] text-[#2E5FA3]">
                      #{v.visitNumber}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {new Date(v.visitDate).toLocaleString('en-GB')}
                  </td>
                  <td className="px-6 py-3 text-slate-600">{v.department}</td>
                  <td className="px-6 py-3 text-slate-600">{v.serviceRequired || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit form */}
      <EditPatientForm
        patient={{
          id: patient.id,
          fullName: patient.fullName,
          guardianName: patient.guardianName ?? '',
          age: patient.age,
          gender: patient.gender,
          cnicNumber: patient.cnicNumber ?? '',
          mobile: patient.mobile ?? '',
          address: patient.address,
          serviceRequired: patient.serviceRequired ?? '',
          fee: patient.fee ?? null,
          disposal: patient.disposal ?? '',
          details: patient.details ?? '',
        }}
      />
    </div>
  );
}