'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Departments', href: '/departments' },
  { label: 'Services', href: '/services' },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="sticky top-4 z-50 px-4">
      <header
        className={`max-w-6xl mx-auto rounded-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(46,95,163,0.15)] ring-1 ring-white/60'
            : 'bg-white/50 backdrop-blur-xl shadow-[0_4px_24px_rgba(46,95,163,0.10)] ring-1 ring-white/50'
        }`}
      >
        <nav className="px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/hos.png"
              alt="Syed Hospital"
              width={64}
              height={64}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span
                className="text-[22px] font-medium tracking-tight text-[#2B3A4A]"
                style={{ fontFamily: 'var(--font-jost)' }}
              >
                SYED
              </span>
              <span
                className="text-[12px] font-light tracking-[0.35em] text-[#2E5FA3] -mt-0.5"
                style={{ fontFamily: 'var(--font-jost)' }}
              >
                HOSPITAL
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-5 py-2.5 rounded-full text-sm font-medium text-slate-600
                           transition-all duration-300
                           hover:text-[#1E3A6E]
                           hover:bg-white/60 hover:backdrop-blur-md
                           hover:shadow-[0_4px_20px_rgba(46,95,163,0.15)]
                           hover:ring-1 hover:ring-white/70"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/#book"
              className="hidden sm:inline-flex items-center rounded-full
                         bg-[#2E5FA3] hover:bg-[#264F87] text-white text-sm font-medium
                         px-6 py-2.5 transition-all duration-300
                         hover:shadow-[0_8px_24px_rgba(46,95,163,0.35)] hover:-translate-y-0.5"
            >
              Book Appointment
            </Link>

            <button
              className="md:hidden text-slate-700"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-xl rounded-3xl mt-2 mx-2 mb-2 px-6 py-4 space-y-2 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-[#1E3A6E] hover:bg-slate-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#book"
              className="block rounded-full bg-[#2E5FA3] text-white text-sm font-medium px-5 py-2.5 text-center"
              onClick={() => setMobileOpen(false)}
            >
              Book Appointment
            </Link>
          </div>
        )}
      </header>
    </div>
  );
}