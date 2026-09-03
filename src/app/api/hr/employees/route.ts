import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  const employees = await prisma.employee.findMany({ orderBy: { fullName: 'asc' } });
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  const data = await req.json();
  if (!data.fullName || !data.designation || !data.shift || !data.joiningDate) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
  }

  const employee = await prisma.employee.create({
    data: {
      fullName: data.fullName,
      age: Number(data.age) || 0,
      designation: data.designation,
      department: data.department || null,
      shift: data.shift,
      joiningDate: new Date(data.joiningDate),
      photoUrl: data.photoUrl || null,
      phone: data.phone || null,
      cnic: data.cnic || null,
      address: data.address || null,
    },
  });
  return NextResponse.json(employee);
}