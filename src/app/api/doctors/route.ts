import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const doctors = await prisma.user.findMany({
      where: { role: Role.DOCTOR, isActive: true },
      select: {
        id: true,
        fullName: true,
        specialty: true,
        qualification: true,
      },
      orderBy: { fullName: 'asc' },
    });

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Fetch doctors error:', error);
    return NextResponse.json({ error: 'Could not fetch doctors' }, { status: 500 });
  }
}