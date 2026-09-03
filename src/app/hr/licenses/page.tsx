import { prisma } from '@/lib/prisma';
import LicenseCard from '@/components/hr/LicenseCard';
import { FileCheck } from 'lucide-react';

export const metadata = { title: 'Licenses · Syed Hospital HR' };

export default async function LicensesPage() {
  const licenses = await prisma.hospitalLicense.findMany({
    orderBy: { name: 'asc' },
    include: { history: { orderBy: { recordedAt: 'desc' } } },
  });

  const today = new Date();
  const thirtyDays = new Date();
  thirtyDays.setDate(today.getDate() + 30);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">Hospital Licenses</h1>
        <p className="text-slate-500 mt-1">Track issuance dates, expiry dates, and documents for all licenses.</p>
      </div>

      <div className="space-y-4">
        {licenses.map((license) => {
          const isExpired = license.expiryDate && new Date(license.expiryDate) < today;
          const isExpiringSoon = license.expiryDate && new Date(license.expiryDate) <= thirtyDays && !isExpired;
          return (
            <LicenseCard
              key={license.id}
              license={license}
              isExpired={!!isExpired}
              isExpiringSoon={!!isExpiringSoon}
            />
          );
        })}
      </div>
    </div>
  );
}