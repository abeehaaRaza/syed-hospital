import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });

  const notifications = await prisma.licenseNotification.findMany({
    where: { isRead: false },
    include: { license: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(notifications);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  const { id } = await req.json();
  await prisma.licenseNotification.update({ where: { id }, data: { isRead: true } });
  return NextResponse.json({ success: true });
}