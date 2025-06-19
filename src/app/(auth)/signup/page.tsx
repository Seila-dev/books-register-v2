"use client"

import { useRouter } from "next/navigation";

import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import Link from 'next/link'
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { Metadata } from "next";

const signUpUserFormSchema = z.object({
    username: z.string().nonempty("O nome é obrigatório"),
    email: z.string().email("Email Inválido").nonempty("Email é obrigatório"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").nonempty("Senha é obrigatória")
})

type signUpUserFormData = z.infer<typeof signUpUserFormSchema>;

export default function SignUp() {

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<signUpUserFormData>({
        resolver: zodResolver(signUpUserFormSchema),
        mode: 'onBlur'
    })

    const { registerAccount } = useContext(AuthContext)

    const router = useRouter()

    const onSubmit: SubmitHandler<signUpUserFormData> = async (data) => {
        try {
            await registerAccount(data);  // só isso
            router.push('/login');
        } catch (error: any) {
            console.error('Error on sign up', error);
            throw error;
        }
    };

    return (
        <main className="flex w-full h-full mt-1 md:mt-4 justify-center bg-transparent  text-white md:px-4">
      <div className="flex max-w-md w-full flex-col h-fit p-4 bg-transparent md:p-8 rounded-lg shadow-lg">
        <h1 className="mb-2 flex justify-center text-3xl font-semibold">
          Criar conta
        </h1>

        <p className="mb-4 text-gray-300 text-center">
          Crie sua conta para salvar e acessar sua coleção de livros de forma segura na nuvem. Seus dados são criptografados e sincronizados em todos os seus dispositivos.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <label htmlFor="username" className="mt-4 text-left">Nome</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Seu nome"
                        {...register("username")}
                        className="mt-1 mb-1 rounded border border-gray-300 bg-transparent px-3 py-2 text outline-none focus:border-secondary"
                    />
                    {errors.username && (
                        <p className="text-left text-sm text-red-600">{errors.username.message}</p>
                    )}

                    <label htmlFor="email" className="mt-4 text-left">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="seu@email.com"
                        {...register("email")}
                        className="mt-1 mb-1 rounded border border-gray-300 bg-transparent px-3 py-2 text outline-none focus:border-secondary"
                    />
                    {errors.email && (
                        <p className="text-left text-sm text-red-600">{errors.email.message}</p>
                    )}

                    <label htmlFor="password" className="mt-4 text-left">Senha</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="******"
                        {...register("password")}
                        className="mt-1 mb-1 rounded border border-gray-300 bg-transparent px-3 py-2 text outline-none focus:border-secondary"
                    />
                    {errors.password && (
                        <p className="text-left text-sm text-red-600">{errors.password.message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-8 flex cursor-pointer items-center justify-center gap-2 rounded bg-secondary px-4 py-2 font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200 disabled disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">login</span> Criar
                    </button>
                </form>

                <p className="text-center text-sm mt-6">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="font-semibold text-secondary hover:underline">
                        Fazer login
                    </Link>
                </p>

                <div className="my-4 flex items-center gap-3">
                    <hr className="flex-grow border border-gray-300" />
                    <span className="text-gray-500">ou</span>
                    <hr className="flex-grow border border-gray-300" />
                </div>

                <div className="w-full flex justify-center items-center">
                    <GoogleLoginButton />
                </div>
            </div>
        </main>
    )
}
