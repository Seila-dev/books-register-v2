'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Star,
  ArrowRight,
  Crown,
  Trophy,
  Award,
  ChevronRight,
  ChartColumnIncreasingIcon
} from 'lucide-react'
import { Category } from '@/types/categoryData'
import Link from 'next/link'
import { getToken, useApi } from '@/hooks/useApi'
import axios from 'axios'

export default function TopCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [_, setHoveredCard] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getToken()
        const api = axios.create({
          baseURL: 'https://books-register-api-production.up.railway.app/',
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        })

        const res = await api.get('/categories')

        const sorted = res.data
          .sort((a: Category, b: Category) => b.books.length - a.books.length)
          .slice(0, 3)
          .map((category: Category, index: number) => ({
            ...category,
            rank: index + 1,
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
        return <Crown className="text-yellow-300 drop-shadow-lg" size={22} fill="currentColor" />
      case 2:
        return <Trophy className="text-slate-300 drop-shadow-lg" size={22} />
      case 3:
        return <Award className="text-amber-500 drop-shadow-lg" size={22} />
      default:
        return <Star className="text-violet-400 drop-shadow-lg" size={22} />
    }
  }

  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-800/20 border border-yellow-500/30 shadow-yellow-400/10'
      case 2:
        return 'bg-slate-700/20 border border-slate-400/30 shadow-slate-400/10'
      case 3:
        return 'bg-amber-700/20 border border-amber-500/30 shadow-amber-500/10'
      default:
        return 'bg-violet-700/20 border border-violet-500/30 shadow-violet-500/10'
    }
  }

  const maxBooks = Math.max(...categories.map((c) => c.books.length), 1)


  return (
    <section className="w-full text-white space-y-6 mb-12 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gradient-to-r from-green-800 to-blue-600 rounded-lg">
            <ChartColumnIncreasingIcon size={24} className="text-white" />
          </div>
          <div>
            <h2 className="lg:text-2xl md:text-xl text-base font-bold">
              Categorias Populares
            </h2>
            <p className="text-gray-400 text-sm">Categorias com mais conteúdos</p>
          </div>
        </div>

        <Link
          href="/home/categories"
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200 text-sm cursor-pointer">
          Ver todos
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-gray-800 backdrop-blur-xl border border-white/5"
            >
              <div className="p-6 lg:p-8 space-y-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gray-700/50 rounded-2xl"></div>
                  <div className="w-16 h-8 bg-gray-700/50 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="w-3/4 h-7 bg-gray-700/50 rounded-lg"></div>
                  <div className="w-1/2 h-5 bg-gray-700/50 rounded-lg"></div>
                </div>
                <div className="w-full h-2 bg-gray-700/50 rounded-full"></div>
              </div>
            </div>
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-16 lg:py-24">
            <div className="relative inline-flex mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
              <div className="relative p-4 bg-gray-800 rounded-full border border-white/10">
                <BookOpen className="text-gray-400" size={48} />
              </div>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-300 mb-2">
              Nenhuma categoria encontrada
            </h3>
            <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
              Adicione alguns conteúdos para descobrir suas categorias mais populares e ver estatísticas detalhadas.
            </p>
          </div>
        ) : (
          categories.map((category, index) => {
            const coverImage = category.books[0]?.book?.coverImage || 'https://via.placeholder.com/400x600';
            return (
              <div
                key={category.id}
                onClick={() => router.push(`/home/categories/${category.id}`)}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onFocus={() => setHoveredCard(category.id)}  // acessibilidade: foco tbm ativa
                onBlur={() => setHoveredCard(null)}
                tabIndex={0} // torna focável por teclado
                className={`group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:scale-[1.02] bg-gray-800 backdrop-blur-xl border border-white/5 hover:bg-gray-700 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                }}
              >
                {/* Background Blur com capa da categoria */}
                <div
                  className={`absolute inset-0 bg-cover bg-center pointer-events-none`}
                  style={{
                    backgroundImage: `url(${coverImage})`,
                    filter: 'blur(0px) brightness(0.35)',  // filtro menos agressivo
                    opacity: 1,  // imagem sempre visível
                    zIndex: 5,
                    transition: 'opacity 0.5s ease',
                  }}
                />

                {/* Rank Badge */}
                <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-20">
                  <div className={`flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-2xl backdrop-blur-xl transition-all duration-300 ${getRankBadgeStyle(category.rank!)}`}>
                    {getRankIcon(category.rank!)}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col justify-between min-h-[200px] lg:min-h-[240px]">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl lg:text-2xl font-bold text-white transition-all duration-300 leading-tight">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm lg:text-base text-gray-400">
                        <span className="font-medium">#{category.rank}</span>
                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                        <span className="font-bold text-white">{category.books.length}</span>
                        <span>{category.books.length === 1 ? 'conteúdo' : 'conteúdos'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="w-full bg-white/5 rounded-full h-2 lg:h-3 overflow-hidden">
                        <div
                          className="bg-white/30 h-full rounded-full transition-all duration-700 ease-out shadow-lg relative"
                          style={{
                            width: `${(category.books.length / maxBooks) * 100}%`,
                          }}
                        >
                          <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>Popularidade</span>
                        <span>{Math.round((category.books.length / maxBooks) * 100)}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                      <span>Explorar categoria</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="lg:hidden mt-8 text-center">
        <button
          onClick={() => router.push('/home/categories')}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gray-800 hover:bg-gray-700 backdrop-blur-xl rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 font-medium shadow-lg hover:shadow-xl group"
        >
          <span>Ver todas as categorias</span>
          <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
