import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('books-register.token')?.value;

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/home');

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
  matcher: ['/home/:path*'], // Agora garantido que só age em rotas protegidas
};
