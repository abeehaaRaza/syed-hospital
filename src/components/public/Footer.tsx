import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1E3A6E] to-[#0F2347] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-xl p-2">
                <Image src="/hos.png" alt="Syed Hospital" width={48} height={48} className="object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-medium tracking-tight" style={{ fontFamily: 'var(--font-jost)' }}>SYED</span>
                <span className="text-xs font-light tracking-[0.3em] text-blue-200" style={{ fontFamily: 'var(--font-jost)' }}>HOSPITAL</span>
              </div>
            </div>
            <p className="text-blue-200/80 text-sm leading-relaxed">
              Compassionate care for you and your family. Your health is our
              priority, every single day.
            </p>
          </div>

          <div>
            <h4 className="font-semibold font-heading mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-blue-200/80">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/departments" className="hover:text-white transition-colors">Departments</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/doctors" className="hover:text-white transition-colors">Doctors</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold font-heading mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-blue-200/80">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-300" />
                <span>Dr Habib Shah Chowk, Mohallah Rehmanpura, Farooqabad, District Sheikhupura.</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-300" />
                <span>0300-1187088 <br></br> 056-3874905
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-300" />
                <a href="mailto:Syedhospital34@gmail.com" className="hover:text-white transition-colors break-all">Syedhospital34@gmail.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold font-heading mb-4">Hours</h4>
            <ul className="space-y-3 text-sm text-blue-200/80">
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 flex-shrink-0 text-blue-300" />
                <span>Emergency: Open 24/7</span>
              </li>
              <li className="flex items-center gap-3 pl-7">
                <span>OPD: 9:00 AM – 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-200/60">
            © {new Date().getFullYear()} Syed Hospital. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs text-blue-200/60 hover:text-white transition-colors">
              Staff Portal
            </Link>
            <span className="text-blue-200/30">·</span>
            <Link href="/login" className="text-xs text-blue-200/60 hover:text-white transition-colors">
              Doctor Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}