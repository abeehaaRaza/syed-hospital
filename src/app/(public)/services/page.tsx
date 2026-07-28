import {
  ScanLine, FlaskConical, Pill, Syringe, Bed, Baby,
  HeartPulse, ShieldPlus, Droplet, Activity,
} from 'lucide-react';

export const metadata = {
  title: 'Services · Syed Hospital',
};

const services = [
  { icon: ScanLine, title: 'Radiology & Imaging', desc: 'X-ray and ultrasound (USG) with expert radiologists.' },
  { icon: FlaskConical, title: 'Laboratory', desc: 'Accurate diagnostic testing and lab investigations.' },
  { icon: Pill, title: 'Pharmacy', desc: 'On-site pharmacy stocked with essential medicines.' },
  { icon: Activity, title: 'Operation Theatre', desc: 'Fully equipped OT for surgical procedures.' },
  { icon: Syringe, title: 'Anesthesia', desc: 'Safe, monitored anesthesia for surgeries.' },
  { icon: Droplet, title: 'Blood Bank', desc: 'Reliable blood units available when needed.' },
  { icon: Baby, title: 'Labor & Nursery', desc: 'Maternity, delivery, and newborn care.' },
  { icon: ShieldPlus, title: 'Infection Control', desc: 'CSSD, sterilization, and hospital infection control.' },
  { icon: HeartPulse, title: 'Emergency Care', desc: '24/7 emergency and urgent medical services.' },
];

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-block text-sm font-semibold text-[#2E5FA3] uppercase tracking-wider mb-3">
          Our Expertise
        </span>
        <h1 className="text-4xl lg:text-5xl font-extrabold font-heading text-[#0F2347]">
          Our Services
        </h1>
        <p className="mt-4 text-slate-600">
          A full range of medical services delivered with precision, care, and
          modern facilities.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 ring-1 ring-white/60 shadow-[0_8px_30px_rgba(46,95,163,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(46,95,163,0.15)]"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-8 w-8 text-[#2E5FA3]" />
              </div>
              <h3 className="text-xl font-bold font-heading text-[#1E3A6E] mb-2">
                {s.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}