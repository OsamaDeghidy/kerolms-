import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isProtectedPage = 
    req.nextUrl.pathname.includes('/dashboard') || 
    req.nextUrl.pathname.includes('/checkout') || 
    req.nextUrl.pathname.includes('/admin') ||
    req.nextUrl.pathname.includes('/learn');

  const pathname = req.nextUrl.pathname;
  const segments = pathname.split('/');
  const locale = ['ar', 'en'].includes(segments[1]) ? segments[1] : 'ar';

  // If user is not authenticated and trying to access protected page
  if (!req.auth && isProtectedPage) {
    const loginUrl = new URL(`/${locale}/auth/login`, req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  // Admin role check
  if (req.auth && pathname.includes('/admin')) {
    // @ts-ignore
    if (req.auth.user?.role !== 'admin') {
      const dashboardUrl = new URL(`/${locale}/dashboard`, req.nextUrl.origin);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/', 
    '/(ar|en)/:path*',
    // Enable redirection for non-prefixed pathnames
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
