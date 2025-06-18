'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { parseCookies } from 'nookies'
import {
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { useApi } from '@/hooks/useApi'

interface Category {
  id: string
  name: string
  books: any[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const api = useApi()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { 'books-register.token': token } = parseCookies()
        const res = await api.get('/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setCategories(res.data)
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const maxBooks = Math.max(...categories.map(c => c.books.length), 1)

  return (
    <div className="text-white w-full mt-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Categorias</h1>
        <p className="text-gray-400 text-sm mt-1">Veja o progresso de cada categoria</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-md p-6 animate-pulse"
            >
              <div className="h-6 w-3/4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-700 rounded mb-4"></div>
              <div className="h-2 w-full bg-gray-700 rounded"></div>
            </div>
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-400 text-lg">Nenhuma categoria encontrada.</p>
            <p className="text-gray-500 text-sm mt-1">Adicione conteúdos para ver categorias aqui.</p>
          </div>
        ) : (
          categories.map((category) => (
  <div
    key={category.id}
    onClick={() => router.push(`/categories/${category.id}`)}
    className="cursor-pointer rounded-2xl p-5 border border-purple-500/20 bg-gradient-to-br from-purple-800/40 via-indigo-800/30 to-blue-800/20 shadow-lg hover:shadow-purple-600/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
  >
    <h3 className="text-lg font-bold text-white mb-1 truncate hover:text-purple-300 transition-colors duration-200">
      {category.name}
    </h3>

    <p className="text-sm text-gray-300 mb-3">
      {category.books.length} {category.books.length === 1 ? 'item' : 'itens'}
    </p>

    <div className="w-full bg-gray-700/40 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${(category.books.length / maxBooks) * 100}%` }}
      ></div>
    </div>
  </div>
))
        )}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200"
        >
          Voltar para o início
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}