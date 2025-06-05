'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { parseCookies } from 'nookies'
import api from '@/services/api'
import {
  BookOpen,
  TrendingUp,
  Star,
  ArrowRight,
  Crown,
  Trophy,
  Award
} from 'lucide-react'

type Category = {
  id: string
  name: string
  books: any[]
  color?: string
  rank?: number
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
          .map((category: Category, index: number) => ({
            ...category,
            rank: index + 1,
            color: ['from-amber-500 to-orange-600', 'from-gray-400 to-gray-600', 'from-amber-600 to-yellow-700'][index] || 'from-purple-500 to-blue-600'
          }))

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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={20} fill="currentColor" />
      case 2:
        return <Trophy className="text-gray-300" size={20} />
      case 3:
        return <Award className="text-amber-600" size={20} />
      default:
        return <Star className="text-purple-400" size={20} />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-400/50 hover:border-yellow-400'
      case 2:
        return 'border-gray-400/50 hover:border-gray-400'
      case 3:
        return 'border-amber-600/50 hover:border-amber-600'
      default:
        return 'border-purple-500/50 hover:border-purple-500'
    }
  }

  return (
    <div className="text-white w-full mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gradient-to-r from-orange-600 to-blue-600 rounded-lg">
            <TrendingUp size={24} className="text-white" />
          </div>
          <div>
            <h2 className="lg:text-3xl md:text-2xl text-lg font-bold">
              Categorias em destaque
            </h2>
            <p className="text-gray-400 text-sm">
              Suas categorias mais utilizadas
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push('/categories')}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200 text-sm"
        >
          Ver todas
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-3 gap-x-[6px] gap-y-3 md:gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm"
            >
              <div className="p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
                  <div className="w-12 h-6 bg-gray-700 rounded-full"></div>
                </div>
                <div className="w-3/4 h-6 bg-gray-700 rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-400 text-lg">Nenhuma categoria encontrada.</p>
            <p className="text-gray-500 text-sm mt-1">Adicione alguns conteúdos para ver suas categorias populares.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              onClick={() => router.push(`/categories/${category.id}`)}
              className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${getRankColor(category.rank!)} bg-gray-800/30 backdrop-blur-sm hover:bg-gray-700/40 min-w-[90px] p-1.5 sm:p-3`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>

              {/* Rank Badge */}
              <div className="absolute top-1.5 right-1.5 z-10 hidden md:flex">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${category.rank === 1
                  ? 'bg-yellow-400/20'
                  : category.rank === 2
                    ? 'bg-gray-400/20'
                    : 'bg-amber-600/20'
                  } backdrop-blur-sm`}>
                  {getRankIcon(category.rank!)}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 w-full h-full text-center sm:text-left flex flex-col justify-between">
                {/* Título */}
                <h3 className="text-white font-bold text-[0.65rem] sm:text-sm md:text-lg truncate mb-2 group-hover:text-yellow-300 transition-colors">
                  {category.name}
                </h3>

                {/* Stats */}
                <div className="hidden sm:flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <span>#{category.rank}</span>
                    <div className="text-orange-400">{category.books.length}</div>
                    <div>{category.books.length === 1 ? 'Conteúdo' : 'Conteúdos'}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 sm:mt-4 relative">
                  <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                    <div
                      className={`bg-gradient-to-r ${category.color} h-1.5 rounded-full transition-all duration-500 group-hover:shadow-lg`}
                      style={{
                        width: `${Math.min(
                          (category.books.length / Math.max(...categories.map((c) => c.books.length))) * 100,
                          100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 blur-lg rounded-xl transition-opacity duration-400 -z-10`}></div>
            </div>
          )))}
      </div>

      {/* Mobile "Ver todas" Button */}
      <div className="md:hidden mt-6 text-center">
        <button
          onClick={() => router.push('/categories')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200"
        >
          Ver todas as categorias
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}