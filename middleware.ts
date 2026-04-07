import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;

  // Bypass: halaman login dan api login tidak perlu dicek
  if (url === '/admin/login' || url.startsWith('/api/admin/auth')) {
    return NextResponse.next();
  }

  // Lindungi semua /admin dan /api/admin
  if (!url.startsWith('/admin') && !url.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get('admin_session');

  if (!sessionCookie || sessionCookie.value !== process.env.ADMIN_SESSION_SECRET) {
    // Redirect ke halaman login custom
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
