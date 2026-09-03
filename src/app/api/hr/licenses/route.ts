import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });

  const licenses = await prisma.hospitalLicense.findMany({
    orderBy: { name: 'asc' },
    include: { history: { orderBy: { recordedAt: 'desc' }, take: 5 } },
  });
  return NextResponse.json(licenses);
}