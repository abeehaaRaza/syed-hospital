import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });

  const url = new URL(req.url);
  const date = url.searchParams.get('date') || new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });

  const attendance = await prisma.attendance.findMany({
    where: { date },
    include: { employee: true },
  });
  return NextResponse.json(attendance);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  if (session.user.role === 'RECEPTIONIST') return NextResponse.json({ error: 'HR or Admin only' }, { status: 403 });

  const { employeeId, date, status, checkIn, checkOut, notes } = await req.json();

  const record = await prisma.attendance.upsert({
    where: { employeeId_date: { employeeId, date } },
    update: { status, checkIn: checkIn || null, checkOut: checkOut || null, notes: notes || null },
    create: { employeeId, date, status, checkIn: checkIn || null, checkOut: checkOut || null, notes: notes || null },
  });
  return NextResponse.json(record);
}