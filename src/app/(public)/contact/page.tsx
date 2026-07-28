import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contact · Syed Hospital',
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-block text-sm font-semibold text-[#2E5FA3] uppercase tracking-wider mb-3">
          Get in Touch
        </span>
        <h1 className="text-4xl lg:text-5xl font-extrabold font-heading text-[#0F2347]">
          Contact Us
        </h1>
        <p className="mt-4 text-slate-600">
          Reach out to book an appointment or ask any questions. We&apos;re here
          to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { icon: Phone, title: 'Phone', value: '0300-1187088', href: 'tel:03001187088' },{ icon: Phone, title: 'Telephone', value: '056-3874905', href: 'tel:0563874905' },
          { icon: Mail, title: 'Email', value: 'Syedhospital34@gmail.com', href: 'mailto:Syedhospital34@gmail.com' },
          { icon: MapPin, title: 'Address', value: 'Syed Hospital, Dr Habib Shah Chowk, Mohallah Rehmanpura, Farooqabad, District Sheikhupura.', href: null },
          { icon: Clock, title: 'Hours', value: 'Emergency: 24/7 · OPD: 9 AM – 9 PM', href: null },
        ].map((item, i) => {
          const Icon = item.icon;
          const content = (
            <div className="flex items-start gap-4 bg-white/70 backdrop-blur-sm rounded-3xl p-8 ring-1 ring-white/60 shadow-[0_8px_30px_rgba(46,95,163,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(46,95,163,0.15)]">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                <Icon className="h-7 w-7 text-[#2E5FA3]" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-[#1E3A6E] mb-1">{item.title}</h3>
                <p className="text-slate-600">{item.value}</p>
              </div>
            </div>
          );
          return item.href ? <a key={i} href={item.href}>{content}</a> : <div key={i}>{content}</div>;
        })}
      </div>
    </div>
  );
}