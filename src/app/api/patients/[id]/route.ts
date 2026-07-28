import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await req.json();

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        fullName: data.fullName,
        guardianName: data.guardianName || null,
        age: Number(data.age),
        gender: data.gender,
        cnicNumber: data.cnicNumber || null,
        mobile: data.mobile,
        address: data.address,
        serviceRequired: data.serviceRequired || null,
        fee: data.fee ? Number(data.fee) : null,
        disposal: data.disposal || null,
        details: data.details || null,
        updatedById: session.user.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'PATIENT_UPDATE',
        entityType: 'Patient',
        entityId: patient.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update patient error:', error);
    return NextResponse.json({ error: 'Could not save changes' }, { status: 500 });
  }
}