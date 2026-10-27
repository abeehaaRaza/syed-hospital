import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Clock, UserCheck, ArrowRight, Activity } from 'lucide-react';

export const metadata = { title: 'Doctor Dashboard · Syed Hospital' };

export default async function DoctorDashboard() {
  const session = await auth();
  const doctorId = session?.user?.id;

  // Use a rolling 24-hour window to avoid UTC server timezone cutoff glitches
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Fetch patients assigned to this specific doctor
  const patients = await prisma.patient.findMany({
    where: {
      visitDate: { gte: twentyFourHoursAgo },
      isVisible: true,
      assignedDoctorId: doctorId,
    },
    include: {
      prescriptions: {
        where: { doctorId },
        take: 1,
      },
    },
    orderBy: { tokenNumber: 'asc' },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">
          Welcome, {session?.user?.name}
        </h1>
        <p className="text-slate-500 mt-1">
          {session?.user?.specialty?.replace('_', ' ')} Clinic Queue · {patients.length} patient(s) today
        </p>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-[#1E3A6E] flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#2E5FA3]" />
            Today&apos;s Queue
          </h2>
          <span className="text-xs text-slate-400">Sorted by Queue Token</span>
        </div>

        {patients.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <p className="text-base font-semibold">No patients in your queue right now.</p>
            <p className="text-sm mt-1">Patients dispatched from reception will show up here automatically.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="px-6 py-4 font-semibold">Token</th>
                <th className="px-6 py-4 font-semibold">MR Number</th>
                <th className="px-6 py-4 font-semibold">Patient Name</th>
                <th className="px-6 py-4 font-semibold">Age / Gender</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => {
                const hasPrescription = p.prescriptions.length > 0;
                return (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <span className="h-8 w-8 rounded-full bg-[#1E3A6E] text-white flex items-center justify-center font-bold text-xs">
                        #{p.tokenNumber ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-[#1E3A6E]">{p.mrNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{p.fullName}</p>
                      {p.guardianName && <p className="text-xs text-slate-400">{p.guardianName}</p>}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.age} {p.ageUnit} / {p.gender}</td>
                    <td className="px-6 py-4 text-slate-600">{p.serviceRequired || 'OPD'}</td>
                    <td className="px-6 py-4">
                      {hasPrescription ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <UserCheck className="h-3.5 w-3.5" /> Consulted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                          <Clock className="h-3.5 w-3.5" /> Waiting
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/doctor/patients/${p.id}/prescribe`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2E5FA3] hover:bg-[#264F87] text-white transition-colors"
                      >
                        {hasPrescription ? 'View / Edit Prescription' : 'Open Prescription'}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}