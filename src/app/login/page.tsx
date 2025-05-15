"use client"

import { useRouter } from "next/navigation";

import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import api from "../../services/api"
import Link from 'next/link'

const signInUserFormSchema = z.object({
    email: z.string().email("Email Inválido").nonempty("Email é obrigatório"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").nonempty("Senha é obrigatória")
})

type signInUserFormData = z.infer<typeof signInUserFormSchema>;

export default function SignIn() {

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(signInUserFormSchema),
        mode: 'onBlur'
    })

    const { signIn } = useContext(AuthContext)

    const onSubmit: SubmitHandler<signInUserFormData> = async (data) => {
        try {
            await signIn(data);
        } catch (error: any) {
            setError("email", {
                type: "manual",
                message: "Invalid email or password",
            });
            setError("password", {
                type: "manual",
                message: "Invalid email or password",
            });
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-transparent  text-white px-4">
            <div className="flex max-w-md w-full flex-col bg-blue-950 p-8 rounded-lg shadow-lg border-t-[10px] border-2">
                <h1 className="mb-6 flex justify-center text-3xl font-semibold">
                    Login
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

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
                        className="mt-8 flex cursor-pointer items-center justify-center gap-2 rounded bg-secondary px-4 py-2 font-bold text-white disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">login</span> Entrar
                    </button>
                </form>

                <div className="my-8 flex items-center gap-3">
                    <hr className="flex-grow border border-gray-300" />
                    <span className="text-gray-500">ou</span>
                    <hr className="flex-grow border border-gray-300" />
                </div>

                <p className="text-center text-sm">
                    Não tem uma conta?{" "}
                    <Link href="/signup" className="font-semibold text-secondary hover:underline">
                        Fazer cadastro
                    </Link>
                </p>
            </div>
        </main>
    )
}
