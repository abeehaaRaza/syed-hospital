import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { action, newPassword } = await req.json();

    if (id === session.user.id && (action === 'toggleActive' || action === 'delete')) {
      return NextResponse.json({ error: 'You cannot modify your own account this way' }, { status: 400 });
    }

    if (action === 'resetPassword') {
      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
      }
      await prisma.user.update({
        where: { id },
        data: { passwordHash: await bcrypt.hash(newPassword, 10) },
      });
      await prisma.auditLog.create({
        data: { userId: session.user.id, action: 'STAFF_PASSWORD_RESET', entityType: 'User', entityId: id },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'toggleActive') {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return NextResponse.json({ error: 'Account not found' }, { status: 404 });
      await prisma.user.update({ where: { id }, data: { isActive: !user.isActive } });
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: user.isActive ? 'STAFF_DEACTIVATE' : 'STAFF_ACTIVATE',
          entityType: 'User',
          entityId: id,
        },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

      const patientsCreated = await prisma.patient.count({ where: { createdById: id } });
      const patientsUpdated = await prisma.patient.count({ where: { updatedById: id } });

      if (patientsCreated > 0 || patientsUpdated > 0) {
        // This account created/edited real patient records — cannot safely delete.
        // Patient records must keep a valid creator reference for legal/audit purposes.
        return NextResponse.json(
          { error: 'This account has patient records tied to it and cannot be permanently deleted. Deactivate it instead to preserve those records.' },
          { status: 400 }
        );
      }

      // No patient records depend on this account — safe to fully remove,
      // including its login history, since nothing else references it.
      await prisma.auditLog.deleteMany({ where: { userId: id } });
      await prisma.user.delete({ where: { id } });

      return NextResponse.json({ success: true, permanentlyDeleted: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Staff action error:', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}