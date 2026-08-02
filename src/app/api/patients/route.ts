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

    // Build a list of identifiers to match a returning patient by:
    // patient CNIC, patient mobile, guardian CNIC, guardian mobile
    const cnic = data.cnicNumber?.trim() || null;
    const mobile = data.mobile?.trim() || null;
    const gCnic = data.guardianCnic?.trim() || null;
    const gMobile = data.guardianMobile?.trim() || null;

    let existing = null;

    const orConditions = [];
    if (cnic) orConditions.push({ cnicNumber: cnic });
    if (cnic) orConditions.push({ guardianCnic: cnic });
    if (gCnic) orConditions.push({ cnicNumber: gCnic });
    if (gCnic) orConditions.push({ guardianCnic: gCnic });
    if (mobile) orConditions.push({ mobile: mobile });
    if (mobile) orConditions.push({ guardianMobile: mobile });
    if (gMobile) orConditions.push({ mobile: gMobile });
    if (gMobile) orConditions.push({ guardianMobile: gMobile });

    if (orConditions.length > 0) {
      existing = await prisma.patient.findFirst({
        where: { OR: orConditions },
        orderBy: { createdAt: 'asc' },
      });
    }

    let mrNumber: string;
    let patientCount: number;
    let patientId: string;
    let isFollowUp = false;

    if (existing) {
      // Returning patient — reuse their permanent MR number
      mrNumber = existing.mrNumber;
      patientCount = existing.patientCount;
      patientId = existing.id;
      isFollowUp = true;

      // Update their latest details (in case something changed)
      await prisma.patient.update({
        where: { id: existing.id },
        data: {
          department: data.department as DepartmentType,
          serviceRequired: data.serviceRequired,
          registerType: data.serviceRequired,
          fee: data.fee ? Number(data.fee) : null,
          disposal: data.disposal || null,
          details: data.details || null,
          visitDate: now,
          visitTime,
          updatedById: session.user.id,
        },
      });
    } else {
      // New patient — generate a fresh MR number
      const generated = await generateMRNumber(data.department as DepartmentType, now);
      mrNumber = generated.mrNumber;
      patientCount = generated.patientCount;

      const patient = await prisma.patient.create({
        data: {
          mrNumber,
          fullName: data.fullName,
          guardianName: data.guardianName || null,
          guardianCnic: gCnic,
          guardianMobile: gMobile,
          age: Number(data.age),
          gender: data.gender,
          cnicNumber: cnic,
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
      patientId = patient.id;
    }

    // Count existing visits for this patient, then create the next visit
    const priorVisits = await prisma.visit.count({ where: { patientId } });
    const visitNumber = priorVisits + 1;

    await prisma.visit.create({
      data: {
        patientId,
        visitNumber,
        department: data.department as DepartmentType,
        serviceRequired: data.serviceRequired,
        reason: data.details || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: isFollowUp ? 'PATIENT_FOLLOWUP' : 'PATIENT_CREATE',
        entityType: 'Patient',
        entityId: patientId,
      },
    });

    return NextResponse.json({
      success: true,
      mrNumber,
      patientName: data.fullName,
      isFollowUp,
      visitNumber,
    });
  } catch (error) {
    console.error('Save patient error:', error);
    return NextResponse.json({ error: 'Failed to save patient' }, { status: 500 });
  }
}