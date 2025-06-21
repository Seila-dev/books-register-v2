import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
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

  // Validar token no servidor
  try {
    const response = await fetch('https://books-register-api-production.up.railway.app/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Token inválido, redirecionar para login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      
      // Limpar cookie inválido
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.delete('books-register.token');
      
      return redirectResponse;
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Erro na validação do token:', error);
    
    // Em caso de erro, redirecionar para login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/home/:path*'],
};