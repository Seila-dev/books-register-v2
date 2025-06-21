import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('books-register.token')?.value;
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/home');

  // Se não é rota protegida, continuar
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Se não tem token, redirecionar para login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se tem token, deixar o AuthContext lidar com a validação no cliente
  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*'],
};