import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Allow switching users via ?user=email query param for testing
  const userParam = request.nextUrl.searchParams.get('user');

  if (userParam && (userParam === 'maheen@example.com' || userParam === 'reviewer@example.com')) {
    response.cookies.set('mock-user', userParam, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  // Set default user if no cookie exists
  if (!request.cookies.get('mock-user')) {
    response.cookies.set('mock-user', 'maheen@example.com', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
