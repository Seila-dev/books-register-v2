import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('books-register.token')?.value;
  
  const protectedPaths = [
    '/',         
    '/books',    
    '/categories',  
  ];
  
  const isProtectedRoute = protectedPaths.some(path => {
    if (path === '/') {
      return request.nextUrl.pathname === '/';
    }
    return request.nextUrl.pathname.startsWith(path);
  });
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  if (!token) {
    const loginUrl = new URL('/login', request.url);

    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, register (páginas de auth)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
};