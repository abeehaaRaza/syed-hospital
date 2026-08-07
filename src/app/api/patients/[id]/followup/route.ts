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
    const { action, followUpDate, followUpReason } = await req.json();

    if (action === 'set') {
      if (!followUpDate) {
        return NextResponse.json({ error: 'Please pick a follow-up date' }, { status: 400 });
      }
      await prisma.patient.update({
        where: { id },
        data: {
          followUpDate: new Date(followUpDate),
          followUpReason: followUpReason || null,
          followUpDone: false,
        },
      });
      await prisma.auditLog.create({
        data: { userId: session.user.id, action: 'FOLLOWUP_SET', entityType: 'Patient', entityId: id },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'markDone') {
      await prisma.patient.update({
        where: { id },
        data: { followUpDone: true },
      });
      await prisma.auditLog.create({
        data: { userId: session.user.id, action: 'FOLLOWUP_DONE', entityType: 'Patient', entityId: id },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'clear') {
      await prisma.patient.update({
        where: { id },
        data: { followUpDate: null, followUpReason: null, followUpDone: false },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Follow-up error:', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}