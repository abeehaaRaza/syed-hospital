'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function MobileShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 print:bg-white print:min-h-0">
      {/* Sidebar — desktop: static; mobile: slide-in drawer. HIDES ON PRINT */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:static lg:translate-x-0 print:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebar}
      </div>

      {/* Dark overlay behind the drawer on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden print:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 print:block print:w-full">
        {/* Mobile top bar with hamburger — hidden on desktop AND print */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-white border-b border-slate-100 px-4 py-3 print:hidden">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-50"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span
            className="font-medium tracking-tight text-[#2B3A4A]"
            style={{ fontFamily: 'var(--font-jost)' }}
          >
            SYED{' '}
            <span className="text-[10px] font-light tracking-[0.3em] text-[#2E5FA3]">
              HOSPITAL
            </span>
          </span>
        </div>

        {/* Close button floating inside the open drawer (mobile only) */}
        {open && (
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden fixed top-4 left-[calc(16rem-2.75rem)] z-[60] p-2 rounded-lg bg-white shadow text-slate-600 print:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <main className="flex-1 overflow-x-hidden print:overflow-visible print:w-full">{children}</main>
      </div>
    </div>
  );
}