import { auth } from '@/lib/auth-edge';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuth = !!req.auth;
  const role = req.auth?.user?.role;

  // Already logged in and tries to visit login page → redirect to their portal
  if (pathname === '/login' && isAuth) {
    if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    if (role === 'HR') return NextResponse.redirect(new URL('/hr/dashboard', req.url));
    return NextResponse.redirect(new URL('/reception/dashboard', req.url));
  }

  // Admin routes — only ADMIN allowed
  if (pathname.startsWith('/admin')) {
    if (!isAuth) return NextResponse.redirect(new URL('/login', req.url));
    if (role !== 'ADMIN') {
      if (role === 'HR') return NextResponse.redirect(new URL('/hr/dashboard', req.url));
      return NextResponse.redirect(new URL('/reception/dashboard', req.url));
    }
  }

  // HR routes — only HR and ADMIN allowed
  if (pathname.startsWith('/hr')) {
    if (!isAuth) return NextResponse.redirect(new URL('/login', req.url));
    if (role !== 'HR' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/reception/dashboard', req.url));
    }
  }

  // Reception routes — must be logged in
  if (pathname.startsWith('/reception') && !isAuth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: ['/admin/:path*', '/reception/:path*', '/hr/:path*', '/login'],
};