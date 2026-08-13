// import { NextRequest, NextResponse } from 'next/server';
// import { checkSession } from './lib/api/serverApi';

// const privateRoutes = ['/profile', '/notes'];
// const publicRoutes = ['/sign-in', '/sign-up'];

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const accessToken = request.cookies.get('accessToken')?.value;
//   const refreshToken = request.cookies.get('refreshToken')?.value;

//   const isPrivateRoute = privateRoutes.some(route =>
//     pathname.startsWith(route)
//   );

//   const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

//   if (accessToken) {
//     if (isPublicRoute) {
//       return NextResponse.redirect(new URL('/profile', request.url));
//     }

//     return NextResponse.next();
//   }

//   if (refreshToken) {
//     try {
//       const response = await checkSession();

//       const nextResponse = isPublicRoute
//         ? NextResponse.redirect(new URL('/profile', request.url))
//         : NextResponse.next();

//       const setCookies = response.headers['set-cookie'];

//       if (setCookies) {
//         const cookies = Array.isArray(setCookies) ? setCookies : [setCookies];

//         cookies.forEach(cookie => {
//           nextResponse.headers.append('set-cookie', cookie);
//         });
//       }

//       return nextResponse;
//     } catch {
//       if (isPrivateRoute) {
//         return NextResponse.redirect(new URL('/sign-in', request.url));
//       }

//       return NextResponse.next();
//     }
//   }

//   if (isPrivateRoute) {
//     return NextResponse.redirect(new URL('/sign-in', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
// };

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkSession } from './lib/api/serverApi';
const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );
  if (!accessToken) {
    if (refreshToken) {
      const data = await checkSession();
      const setCookie = data.headers['set-cookie'];
      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);
          if (parsed.value) {
            cookieStore.set(parsed.name, parsed.value, parsed);
          }
        }
        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url), {
            headers: { Cookie: cookieStore.toString() },
          });
        }
        if (isPrivateRoute) {
          return NextResponse.next({
            headers: { Cookie: cookieStore.toString() },
          });
        }
      }
    }
    if (isPublicRoute) {
      return NextResponse.next();
    }
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  if (isPrivateRoute) {
    return NextResponse.next();
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
