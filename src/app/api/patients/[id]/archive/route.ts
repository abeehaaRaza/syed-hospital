import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PatientStatus } from '@prisma/client';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { archive } = await req.json();

    const patient = await prisma.patient.update({
      where: { id },
      data: archive
        ? { isVisible: false, status: PatientStatus.ARCHIVED, archivedAt: new Date(), updatedById: session.user.id }
        : { isVisible: true, status: PatientStatus.ACTIVE, archivedAt: null, updatedById: session.user.id },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: archive ? 'PATIENT_ARCHIVE' : 'PATIENT_RESTORE',
        entityType: 'Patient',
        entityId: patient.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Archive error:', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}