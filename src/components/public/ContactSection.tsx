import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="book" className="relative py-20 lg:py-28 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-br from-[#2E5FA3] to-[#1E3A6E] rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-10 lg:p-14 text-white">
              <span className="inline-block text-sm font-semibold text-blue-200 uppercase tracking-wider mb-3">
                Book Your Visit
              </span>
              <h2 className="text-4xl font-extrabold font-heading leading-tight mb-4">
                Ready to book an appointment?
              </h2>
              <p className="text-blue-100/90 leading-relaxed mb-8">
                Call our reception to schedule your appointment with our doctors.
                Our team is here to help you 24/7.
              </p>

              <div className="space-y-4">
                <a href="tel:03001187088" className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 uppercase tracking-wide">Call reception</p>
                    <p className="font-semibold">0300-1187088</p>
                  </div>
                </a>

                <a href="tel:0563874905" className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 uppercase tracking-wide">Landline</p>
                    <p className="font-semibold">056-3874905</p>
                  </div>
                </a>

                <a href="mailto:Syedhospital34@gmail.com" className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 uppercase tracking-wide">Email us</p>
                    <p className="font-semibold break-all">Syedhospital34@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-10 lg:p-14 flex flex-col justify-center gap-6">
              <div className="flex items-start gap-4 text-white">
                <div className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Visit Us</p>
                  <p className="text-blue-100/80 text-sm">
                    Syed Hospital, Dr Habib Shah Chowk, Mohallah Rehmanpura,
                    Farooqabad, District Sheikhupura.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-white">
                <div className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Emergency</p>
                  <p className="text-blue-100/80 text-sm">Open 24 hours, 7 days a week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}