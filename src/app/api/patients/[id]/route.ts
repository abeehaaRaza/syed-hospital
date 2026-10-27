import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        visits: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        prescriptions: {
          where: { doctorId: session.user.id },
          orderBy: { createdAt: 'desc' },
          take: 1,
        }
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Fetch patient error:', error);
    return NextResponse.json({ error: 'Could not fetch patient' }, { status: 500 });
  }
}

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

    // Receptionists can only edit patients registered TODAY
    if (session.user.role !== 'ADMIN') {
      const patient = await prisma.patient.findUnique({ where: { id } });
      if (!patient) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
      }
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      if (new Date(patient.visitDate) < startOfDay) {
        return NextResponse.json(
          { error: 'Reception can only edit patients registered today. Ask an administrator for older records.' },
          { status: 403 }
        );
      }
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        fullName: data.fullName,
        guardianName: data.guardianName || null,
        guardianCnic: data.guardianCnic || null,
        guardianMobile: data.guardianMobile || null,
        age: Number(data.age),
        gender: data.gender,
        cnicNumber: data.cnicNumber || null,
        mobile: data.mobile || null,
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