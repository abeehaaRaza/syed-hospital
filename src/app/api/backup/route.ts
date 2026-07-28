import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  try {
    const [patients, departments, counters] = await Promise.all([
      prisma.patient.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.department.findMany({ orderBy: { displayOrder: 'asc' } }),
      prisma.mRCounter.findMany(),
    ]);

    const backup = {
      hospital: 'Syed Hospital',
      generatedAt: new Date().toISOString(),
      generatedBy: session.user.name,
      counts: { patients: patients.length, departments: departments.length },
      patients,
      departments,
      mrCounters: counters,
    };

    const stamp = new Date().toISOString().slice(0, 10);

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="syed-hospital-backup-${stamp}.json"`,
      },
    });
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json({ error: 'Backup failed' }, { status: 500 });
  }
}