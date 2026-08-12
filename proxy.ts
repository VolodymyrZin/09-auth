import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    return NextResponse.next();
  }

  if (refreshToken) {
    try {
      const response = await checkSession();

      const nextResponse = NextResponse.redirect(new URL(request.url));

      const setCookies = response.headers['set-cookie'];

      if (setCookies) {
        const cookies = Array.isArray(setCookies) ? setCookies : [setCookies];

        cookies.forEach(cookie => {
          nextResponse.headers.append('set-cookie', cookie);
        });
      }

      return nextResponse;
    } catch {
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }

      return NextResponse.next();
    }
  }

  if (isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
