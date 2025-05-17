import { createContext, useState, useEffect, useCallback } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { User } from "@/types/userData";
import { useRouter } from "next/navigation";

type FormData = {
    email: string
    password: string
}

type FormDataRegister = {
    email: string
    password: string
    username: string
}

type authContextType = {
    isAuthenticated: boolean
    user: User | null
    signIn: (data: FormData) => Promise<void>
    registerAccount: (data: FormDataRegister) => Promise<void>
    signOut: () => void
}

export const AuthContext = createContext({} as authContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)

    const isAuthenticated = !!user

    useEffect(() => {
        const { 'books-register.token': token } = parseCookies();

        if (!token) return;

        const fetchUser = async () => {
            try {
                const response = await fetch('https://books-register-api-production.up.railway.app/users', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error();

                const userData = await response.json();
                setUser(userData);
            } catch {
                destroyCookie(null, 'books-register.token'); // limpa token inválido
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const router = useRouter()

    const signIn = async ({ email, password }: FormData) => {
        const url = 'https://books-register-api-production.up.railway.app/users/login'

        try {
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            if (!request.ok) {
                const error = await request.json()
                throw new Error(error.message || "Invalid email or password")
            }

            const response = await request.json()

            setCookie(response, 'books-register.token', response.token, {
                maxAge: 60 * 60 * 12, // 12h
                path: '/',
            })

            setUser(response.user)

            router.push('/')

        } catch (error: any) {
            console.error('Something went wrong on sign up', error)
            throw error;
        }
    }

    const registerAccount = async ({ email, password, username }: FormDataRegister) => {
        const url = 'https://books-register-api-production.up.railway.app/users/'

        try {
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, username })
            })

            if (!request.ok) {
                const error = await request.json()
                throw new Error(error)
            }

            const response = await request.json()

            setCookie(response, 'books-register.token', response.token, {
                maxAge: 60 * 60 * 4 // 4h
            })

            setUser(response.user)

            router.push('/login')

        } catch (error: any) {
            console.error('Error on sign up', error)
        }
    }

    const signOut = useCallback(() => {
        destroyCookie(null, 'books-register.token')
        setUser(null)

        router.push("/login")
    }, [])


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, registerAccount, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}