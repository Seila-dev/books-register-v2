'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { parseCookies } from 'nookies'
import api from '@/services/api'

type Category = {
  id: string
  name: string
  books: any[] // ou tipo Book[], se você tiver tipado
}

export default function TopCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { 'books-register.token': token } = parseCookies()
        const res = await api.get('/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const sorted = res.data
          .sort((a: Category, b: Category) => b.books.length - a.books.length)
          .slice(0, 3)

        setCategories(sorted)
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

  return (
    <div className="text-white w-full mt-10">
      <h2 className="lg:text-3xl md:text-2xl text-lg font-bold mb-6">
        Categorias mais usadas
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 bg-gray-800 animate-pulse rounded-xl"
            />
          ))
        ) : categories.length === 0 ? (
          <p className="text-gray-500 col-span-3">Nenhuma categoria encontrada.</p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              onClick={() => router.push(`/categories/${category.id}`)}
              className="flex flex-col items-center justify-center border-2 border-solid border-blue-500 rounded-md shadow-lg h-50 cursor-pointer text-center
              bg-black hover:from-blue-900 hover:to-blue-700
              transition-transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden"
            >
              <span className="text-base md:text-xl font-semibold text-blue-400 group-hover:text-blue-200">
                {category.name}
              </span>
              <span className="text-sm text-gray-400 mt-1">
                Usada {category.books.length}x
              </span>

              <div className="absolute -inset-1 bg-blue-500 opacity-20 blur-lg rounded-xl z-[-1] group-hover:opacity-30 transition-opacity duration-400" />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
