import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { z } from 'zod';
import { authConfig } from './auth.config';

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { username: {}, password: {} },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { username: parsed.data.username },
        });
        if (!user || !user.isActive) return null;

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });
        
        await prisma.auditLog.create({
          data: { userId: user.id, action: 'LOGIN', entityType: 'User', entityId: user.id },
        });

        return { 
          id: user.id, 
          name: user.fullName, 
          email: user.email, 
          role: user.role,
          specialty: user.specialty,
          qualification: user.qualification,
          pmdcNumber: user.pmdcNumber
        };
      },
    }),
  ],
});