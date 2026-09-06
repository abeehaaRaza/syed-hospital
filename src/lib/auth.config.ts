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
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as any;
      session.user.id = token.id as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After sign in, redirect based on role stored in the URL or default
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;