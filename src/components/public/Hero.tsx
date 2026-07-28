import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3B7DD8]/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2E5FA3]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-20 lg:pb-32 min-h-[85vh] grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-[#2E5FA3] shadow-sm ring-1 ring-[#2E5FA3]/10 mb-6">
            <ShieldCheck className="h-4 w-4" />
            Trusted care since day one
          </span>

          <h1 className="text-5xl lg:text-6xl font-extrabold font-heading text-[#0F2347] leading-[1.1] tracking-tight">
            Your Health,
            <br />
            <span className="text-[#2E5FA3]">Our Priority</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Compassionate care for you and your family. Modern facilities,
            experienced doctors, and a team dedicated to your wellbeing.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/#book"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2E5FA3] hover:bg-[#264F87] text-white font-medium px-7 py-3.5 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(46,95,163,0.35)] hover:-translate-y-0.5"
            >
              <Calendar className="h-5 w-5" />
              Book Appointment
            </Link>
            <Link
              href="/departments"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 text-[#1E3A6E] font-medium px-7 py-3.5 ring-1 ring-slate-200 transition-all duration-300 hover:shadow-md"
            >
              Explore Departments
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
            {[
              { value: '24/7', label: 'Emergency' },
              { value: '5+', label: 'Departments' },
              { value: '10k+', label: 'Patients' },
            ].map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <p className="text-3xl font-extrabold font-heading text-[#2E5FA3]">
                  {s.value}
                </p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/50 aspect-[4/5] max-w-md mx-auto">
            <Image
              src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Medical care"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A6E]/40 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 bg-white rounded-2xl shadow-xl px-5 py-4 ring-1 ring-slate-100">
            <div className="h-11 w-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <Clock className="h-5 w-5 text-[#2E5FA3]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1E3A6E]">Open Today</p>
              <p className="text-xs text-slate-500">24 hours a day</p>
            </div>
          </div>

          <div className="absolute -top-6 -right-6 hidden md:flex items-center gap-3 bg-white rounded-2xl shadow-xl px-5 py-4 ring-1 ring-slate-100">
            <div className="h-11 w-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-[#2E5FA3]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1E3A6E]">Certified</p>
              <p className="text-xs text-slate-500">Quality care</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}