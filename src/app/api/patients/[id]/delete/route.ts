import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Only an administrator can delete records' }, { status: 403 });
  }

  try {
    const { id } = await params;

    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Log BEFORE deleting (so the audit trail keeps a record of what was removed)
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'PATIENT_DELETE',
        entityType: 'Patient',
        entityId: id,
        details: { mrNumber: patient.mrNumber, fullName: patient.fullName },
      },
    });

    // Visits are removed automatically (onDelete: Cascade in the schema)
    await prisma.patient.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete patient error:', error);
    return NextResponse.json({ error: 'Could not delete record' }, { status: 500 });
  }
}