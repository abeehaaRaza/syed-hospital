import { Ambulance, Eye, Baby, ScanLine, Stethoscope } from 'lucide-react';
import { getDepartments } from '@/lib/data';

const iconMap: Record<string, React.ElementType> = {
  Ambulance,
  Eye,
  Baby,
  ScanLine,
  Stethoscope,
};

export const metadata = {
  title: 'Departments · Syed Hospital',
};

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-block text-sm font-semibold text-[#2E5FA3] uppercase tracking-wider mb-3">
          Our Care
        </span>
        <h1 className="text-4xl lg:text-5xl font-extrabold font-heading text-[#0F2347]">
          Our Departments
        </h1>
        <p className="mt-4 text-slate-600">
          Comprehensive medical care across specialized departments, each
          staffed by experienced professionals.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const Icon = iconMap[dept.iconName ?? ''] ?? Stethoscope;
          return (
            <div
              key={dept.id}
              className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 ring-1 ring-white/60 shadow-[0_8px_30px_rgba(46,95,163,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(46,95,163,0.15)]"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-8 w-8 text-[#2E5FA3]" />
              </div>
              <h3 className="text-xl font-bold font-heading text-[#1E3A6E] mb-2">
                {dept.name}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {dept.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}