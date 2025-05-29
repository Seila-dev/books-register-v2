"use client"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ComponentArrowBack() {
    const router = useRouter()

    return (
        <button onClick={() => router.back()} className="inline-flex items-center text-white hover:text-blue-400 transition duration-100 cursor-pointer">
            <ArrowLeft size={18} className="mr-2" />
            Voltar
        </button>
    )
}

