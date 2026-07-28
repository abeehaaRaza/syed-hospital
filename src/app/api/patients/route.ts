import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateMRNumber } from '@/lib/mr-generator';
import { DepartmentType } from '@prisma/client';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    const now = new Date();
    const visitTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    let mrNumber: string;
    let patientCount: number;
    let isFollowUp = false;

    if (data.cnicNumber && data.cnicNumber.trim() !== '') {
      const existing = await prisma.patient.findFirst({
        where: { cnicNumber: data.cnicNumber.trim() },
        orderBy: { createdAt: 'asc' },
      });

      if (existing) {
        mrNumber = existing.mrNumber;
        patientCount = existing.patientCount;
        isFollowUp = true;
      } else {
        const generated = await generateMRNumber(data.department as DepartmentType, now);
        mrNumber = generated.mrNumber;
        patientCount = generated.patientCount;
      }
    } else {
      const generated = await generateMRNumber(data.department as DepartmentType, now);
      mrNumber = generated.mrNumber;
      patientCount = generated.patientCount;
    }

    const patient = await prisma.patient.create({
      data: {
        mrNumber,
        fullName: data.fullName,
        guardianName: data.guardianName || null,
        age: Number(data.age),
        gender: data.gender,
        cnicNumber: data.cnicNumber || null,
        mobile: data.mobile,
        address: data.address,
        photoUrl: data.photoUrl || null,
        department: data.department as DepartmentType,
        registerType: data.serviceRequired,
        serviceRequired: data.serviceRequired,
        patientCount,
        visitTime,
        consentGiven: data.consentGiven ?? false,
        disposal: data.disposal || null,
        fee: data.fee ? Number(data.fee) : null,
        details: data.details || null,
        createdById: session.user.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: isFollowUp ? 'PATIENT_FOLLOWUP' : 'PATIENT_CREATE',
        entityType: 'Patient',
        entityId: patient.id,
      },
    });

    return NextResponse.json({
      success: true,
      mrNumber: patient.mrNumber,
      patientName: patient.fullName,
      isFollowUp,
    });
  } catch (error) {
    console.error('Save patient error:', error);
    return NextResponse.json(
      { error: 'Failed to save patient' },
      { status: 500 }
    );
  }
}