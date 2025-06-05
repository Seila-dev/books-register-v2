import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { useContext } from "react";

export default function PainelHeader() {
    const { user } = useContext(AuthContext)

    return (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 md:p-6 text-white flex items-center justify-between shadow-md w-full mb-6 mt-1">
            <div>
                <p className="text-base md:text-2xl font-bold ">Bem-vindo de volta, {user?.username}! 👋</p>
                <p className="text-xs md:text-sm mt-1">Estamos atualizando o website para o melhor design e experiência pro usuário. Aproveite o site atual enquanto isso :D</p>
            </div>
            <Link href={'/books/create'} className="bg-white text-purple-600 px-4 py-2 rounded-md font-semibold shadow hover:bg-gray-100 hidden md:flex cursor-pointer">
                + Adicionar Conteúdo
            </Link>
        </div>
    )
}