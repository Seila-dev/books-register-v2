'use client';

import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { parseCookies, setCookie } from 'nookies';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function GoogleLoginButton() {
  const router = useRouter();
  const { user, reloadUser } = useContext(AuthContext);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const res = await fetch('https://books-register-api-production.up.railway.app/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!res.ok) {
        console.error('Erro no login com Google');
        return;
      }

      const data = await res.json();

      if (data.token) {
        setCookie(null, 'books-register.token', data.token, {
          maxAge: 60 * 60 * 12, // 12h
          path: '/',
        });
      }

      await reloadUser()

      router.push('/');
      toast.success('Usuário logado com sucesso')

    } catch (err) {
      console.error('Erro inesperado:', err);
      toast.error('Houve um erro inesperado. Tente novamente ou outra forma de login.')
    }
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />;
}
