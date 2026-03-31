import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { getSessionCookie } from 'better-auth/cookies';

import { routing } from './i18n/routing';

const protectedRoutes = ['/admin', '/profile'];
const authRoutes = ['/login', '/register'];

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // 1. Apply i18n middleware first to set locale
  const intlResponse = intlMiddleware(request);
  if (intlResponse.status !== 200) {
    return intlResponse;
  }

  const path = request.nextUrl.pathname;
  const sessionCookie = getSessionCookie(request);

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to home
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
