import { UserRound, Stethoscope } from 'lucide-react';

export const metadata = {
  title: 'Doctors · Syed Hospital',
};

// Edit these with real doctor details later
const doctors = [
  { name: 'Dr. Habib Shah', specialty: 'Chief Medical Officer', field: 'General Medicine' },
  { name: 'Dr. Zain Shah', specialty: 'Consultant', field: 'Pediatrics' },
  { name: 'Dr. Saira Kazmi', specialty: 'Consultant', field: 'Ophthalmologist' },
  { name: 'Dr. Zaeem Shah', specialty: 'Consultant', field: 'Cardiology' },
];

export default function DoctorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-block text-sm font-semibold text-[#2E5FA3] uppercase tracking-wider mb-3">
          Meet the Team
        </span>
        <h1 className="text-4xl lg:text-5xl font-extrabold font-heading text-[#0F2347]">
          Our Doctors
        </h1>
        <p className="mt-4 text-slate-600">
          Experienced, compassionate professionals dedicated to your care.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {doctors.map((doc, i) => (
          <div
            key={i}
            className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center ring-1 ring-white/60 shadow-[0_8px_30px_rgba(46,95,163,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(46,95,163,0.15)]"
          >
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-105">
              <UserRound className="h-12 w-12 text-[#2E5FA3]" />
            </div>
            <h3 className="text-lg font-bold font-heading text-[#1E3A6E]">
              {doc.name}
            </h3>
            <p className="text-sm text-[#2E5FA3] font-medium mt-1">
              {doc.specialty}
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-slate-500">
              <Stethoscope className="h-3.5 w-3.5" />
              {doc.field}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}