import { DefaultSession } from 'next-auth';
import { Role, DoctorSpecialty } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      specialty?: DoctorSpecialty | null;
      qualification?: string | null;
      pmdcNumber?: string | null;
    } & DefaultSession['user'];
  }
  interface User {
    role: Role;
    specialty?: DoctorSpecialty | null;
    qualification?: string | null;
    pmdcNumber?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role;
    id: string;
    specialty?: DoctorSpecialty | null;
    qualification?: string | null;
    pmdcNumber?: string | null;
  }
}