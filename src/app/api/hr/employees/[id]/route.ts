import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });

  const { id } = await params;
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: { attendance: { orderBy: { date: 'desc' }, take: 30 } },
  });
  if (!employee) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(employee);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  const { id } = await params;
  const { action, employmentStatus } = await req.json();

  if (action === 'setStatus') {
    const validStatuses = ['Active', 'On Leave', 'Left'];
    if (!validStatuses.includes(employmentStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    const updated = await prisma.employee.update({
      where: { id },
      data: {
        employmentStatus,
        isActive: employmentStatus !== 'Left',
        leftDate: employmentStatus === 'Left' ? new Date() : null,
      },
    });
    return NextResponse.json(updated);
  }

  if (action === 'archive') {
    const updated = await prisma.employee.update({
      where: { id },
      data: { isActive: false, employmentStatus: 'Left', leftDate: new Date() },
    });
    return NextResponse.json(updated);
  }

  if (action === 'restore') {
    const updated = await prisma.employee.update({
      where: { id },
      data: { isActive: true, employmentStatus: 'Active', leftDate: null },
    });
    return NextResponse.json(updated);
  }

  if (action === 'delete') {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) return NextResponse.json({ error: 'Employee not found' }, { status: 404 });

    // Attendance records cascade-delete automatically with the employee
    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}