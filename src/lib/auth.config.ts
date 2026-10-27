import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  pages: { signIn: '/login' },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.specialty = user.specialty;
        token.qualification = user.qualification;
        token.pmdcNumber = user.pmdcNumber;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as any;
      session.user.id = token.id as string;
      session.user.specialty = token.specialty as any;
      session.user.qualification = token.qualification as string | null;
      session.user.pmdcNumber = token.pmdcNumber as string | null;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;