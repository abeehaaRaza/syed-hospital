'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2E5FA3] hover:bg-[#264F87] text-white rounded-lg font-semibold shadow-sm transition-colors"
    >
      <Printer className="h-4 w-4" /> Print Prescription
    </button>
  );
}