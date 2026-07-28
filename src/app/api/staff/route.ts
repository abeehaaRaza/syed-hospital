import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Only an administrator can create accounts' }, { status: 403 });
  }

  try {
    const { fullName, username, email, password, role } = await req.json();

    if (!fullName || !username || !email || !password || password.length < 8) {
      return NextResponse.json(
        { error: 'All fields required; password min 8 characters' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: 'That username is already taken' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        passwordHash,
        role: role === 'ADMIN' ? Role.ADMIN : Role.RECEPTIONIST,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'STAFF_CREATE',
        entityType: 'User',
        entityId: user.id,
      },
    });

    return NextResponse.json({ success: true, username: user.username });
  } catch (error) {
    console.error('Create staff error:', error);
    return NextResponse.json({ error: 'Could not create account' }, { status: 500 });
  }
}