import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, User } from 'lucide-react';
import { getPatientById } from '@/lib/data';
import EditPatientForm from '@/components/admin/EditPatientForm';

export const metadata = { title: 'Patient Record · Syed Hospital' };

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await getPatientById(id);

  if (!patient) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/admin/patients"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#2E5FA3] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all patients
      </Link>

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
          <p className="font-mono font-semibold text-[#2E5FA3] mt-1">{patient.mrNumber}</p>
          <p className="text-sm text-slate-500 mt-1">
            Registered {new Date(patient.createdAt).toLocaleString('en-GB')} · {patient.department}
            {patient.serviceRequired ? ` · ${patient.serviceRequired}` : ''}
          </p>
        </div>
      </div>

      <EditPatientForm
        patient={{
          id: patient.id,
          fullName: patient.fullName,
          guardianName: patient.guardianName ?? '',
          age: patient.age,
          gender: patient.gender,
          cnicNumber: patient.cnicNumber ?? '',
          mobile: patient.mobile,
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