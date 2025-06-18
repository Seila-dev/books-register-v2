import { createContext, useState, useEffect, useCallback } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { User } from "@/types/userData";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
  password: string;
};

type FormDataRegister = {
  email: string;
  password: string;
  username: string;
};

type authContextType = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  signIn: (data: FormData) => Promise<void>;
  registerAccount: (data: FormDataRegister) => Promise<void>;
  signOut: () => void;
  reloadUser: () => Promise<void>;
};

export const AuthContext = createContext({} as authContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  const signIn = async ({ email, password }: FormData) => {
    const url = 'https://books-register-api-production.up.railway.app/users/login';

    try {
      const request = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const response = await request.json();

      if (!request.ok) {
        throw new Error(response.message || "Invalid email or password");
      }

      setCookie(null, 'books-register.token', response.token, {
        maxAge: 60 * 60 * 12, // 12h
        path: '/',
      });

      setUser(response.user);

      router.push('/');

    } catch (error: any) {
      console.error('Something went wrong on sign in', error);
      throw error;
    }
  };

  const registerAccount = async ({ email, password, username }: FormDataRegister) => {
    const url = 'https://books-register-api-production.up.railway.app/users/';

    try {
      const request = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (!request.ok) {
        const error = await request.json();
        throw new Error(error);
      }

      const response = await request.json();

      setCookie(null, 'books-register.token', response.token, {
        maxAge: 60 * 60 * 4,
        path: '/',
      });

      setUser(response.user);

      router.push('/login');
    } catch (error: any) {
      console.error('Error on sign up', error);
    }
  };

  const signOut = useCallback(() => {
    destroyCookie(null, 'books-register.token');
    setUser(null);
    router.push("/login");
  }, []);

  const loadUserFromCookies = async () => {
    const { 'books-register.token': token } = parseCookies();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://books-register-api-production.up.railway.app/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        destroyCookie(null, 'books-register.token');
      }
    } catch (err) {
      console.error('Erro ao carregar usuário', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromCookies()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, signIn, registerAccount, signOut, reloadUser: loadUserFromCookies, }}>
      {children}
    </AuthContext.Provider>
  );
};
