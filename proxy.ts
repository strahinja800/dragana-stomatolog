import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { getSessionCookie } from 'better-auth/cookies';

import { routing } from './i18n/routing';

const protectedRoutes = ['/admin', '/profile'];
const authRoutes = ['/login', '/register'];

const intlMiddleware = createMiddleware(routing);

function getLocaleAwarePath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const hasLocale = routing.locales.includes(
    firstSegment as (typeof routing.locales)[number]
  );
  const locale = hasLocale ? firstSegment : routing.defaultLocale;
  const pathWithoutLocale = hasLocale
    ? `/${segments.slice(1).join('/')}`
    : pathname;

  return {
    locale,
    pathWithoutLocale:
      pathWithoutLocale === '/' || pathWithoutLocale === ''
        ? '/'
        : pathWithoutLocale.replace(/\/$/, ''),
  };
}

export function proxy(request: NextRequest) {
  // 1. Apply i18n middleware first to set locale
  const intlResponse = intlMiddleware(request);
  if (intlResponse.status !== 200) {
    return intlResponse;
  }

  const path = request.nextUrl.pathname;
  const { locale, pathWithoutLocale } = getLocaleAwarePath(path);
  const sessionCookie = getSessionCookie(request);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to home
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
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
