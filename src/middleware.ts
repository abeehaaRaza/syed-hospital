import { auth } from '@/lib/auth-edge';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuth = !!req.auth;
  const role = req.auth?.user?.role;

  if (pathname === '/login' && isAuth) {
    const dest = role === 'ADMIN' ? '/admin/dashboard' : '/reception/dashboard';
    return NextResponse.redirect(new URL(dest, req.url));
  }
  if (pathname.startsWith('/admin')) {
    if (!isAuth) return NextResponse.redirect(new URL('/login', req.url));
    if (role !== 'ADMIN') return NextResponse.redirect(new URL('/reception/dashboard', req.url));
  }
  if (pathname.startsWith('/reception') && !isAuth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});

export const config = { matcher: ['/admin/:path*', '/reception/:path*', '/login'] };