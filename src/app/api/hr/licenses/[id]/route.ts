import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  if (session.user.role === 'RECEPTIONIST') return NextResponse.json({ error: 'Not authorized' }, { status: 403 });

  const { id } = await params;
  const data = await req.json();

  const existing = await prisma.hospitalLicense.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'License not found' }, { status: 404 });

  // Save history if dates are changing
  if (data.issuanceDate && data.expiryDate) {
    await prisma.licenseHistory.create({
      data: {
        licenseId: id,
        issuanceDate: new Date(data.issuanceDate),
        expiryDate: new Date(data.expiryDate),
        documentUrl: data.documentUrl || existing.documentUrl,
        notes: data.notes,
      },
    });
  }

  const updated = await prisma.hospitalLicense.update({
    where: { id },
    data: {
      issuanceDate: data.issuanceDate ? new Date(data.issuanceDate) : existing.issuanceDate,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : existing.expiryDate,
      documentUrl: data.documentUrl !== undefined ? data.documentUrl : existing.documentUrl,
      rackLocation: data.rackLocation !== undefined ? data.rackLocation : existing.rackLocation,
      notes: data.notes !== undefined ? data.notes : existing.notes,
    },
  });
  return NextResponse.json(updated);
}