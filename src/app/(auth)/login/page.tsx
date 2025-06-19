"use client"

import { useRouter } from "next/navigation";

import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import Link from 'next/link'
import { GoogleLoginButton } from "@/components/GoogleLoginButton";

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

    const { signIn, reloadUser } = useContext(AuthContext)

    const onSubmit: SubmitHandler<signInUserFormData> = async (data) => {
        try {
            await signIn(data);
            await reloadUser()
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
        <main className="flex w-full h-full mt-1 md:mt-4 justify-center bg-transparent  text-white md:px-4">
            <div className="flex  max-w-md w-full flex-col h-fit p-4 bg-transparent md:p-8 rounded-lg shadow-lg">
                <h1 className="mb-2 flex justify-center text-3xl font-semibold">
                    Entrar
                </h1>

                <p className="mb-4 text-gray-300 text-center">
          Faça login para acessar sua coleção personalizada de livros, armazenada com segurança na nuvem. Seus dados são criptografados e sincronizados em todos os seus dispositivos.
        </p>

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
                        className="mt-8 flex cursor-pointer items-center justify-center gap-2 rounded bg-secondary px-4 py-2 font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-100 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">login</span> Entrar
                    </button>
                </form>

                <p className="text-center text-sm mt-6">
                    Não tem uma conta?{" "}
                    <Link href="/signup" className="font-semibold text-secondary hover:underline">
                        Fazer cadastro
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
