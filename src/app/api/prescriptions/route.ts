import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DoctorSpecialty } from '@prisma/client';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { patientId, visitId, vitals, clinicalFindings, diagnosis, medications, instructions, followUpDays } = data;

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    // Auto-detect template type based on the doctor's specialty
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const templateType = user?.specialty || DoctorSpecialty.GENERAL_PHYSICIAN;

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        visitId: visitId || null,
        doctorId: session.user.id,
        templateType: templateType,
        status: 'COMPLETED',
        vitals: vitals || null,
        clinicalFindings: clinicalFindings || null,
        diagnosis: diagnosis || null,
        medications: medications || null,
        instructions: instructions || null,
        followUpDays: followUpDays ? Number(followUpDays) : null,
      },
    });

    // Update patient to track who last updated them
    await prisma.patient.update({
      where: { id: patientId },
      data: { updatedById: session.user.id }
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'PRESCRIPTION_CREATE',
        entityType: 'Prescription',
        entityId: prescription.id,
      },
    });

    return NextResponse.json({ success: true, prescriptionId: prescription.id });
  } catch (error) {
    console.error('Save prescription error:', error);
    return NextResponse.json({ error: 'Could not save prescription' }, { status: 500 });
  }
}