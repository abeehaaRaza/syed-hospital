import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });

  const { id } = await params;
  const { message } = await req.json();

  if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 });

  const notification = await prisma.licenseNotification.create({
    data: { licenseId: id, message },
  });
  return NextResponse.json(notification);
}