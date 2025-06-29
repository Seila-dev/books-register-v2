// "use client"

// import React, { useState, useEffect } from 'react'
// import {
//   BookOpen,
//   Star,
//   ArrowRight,
//   Crown,
//   Trophy,
//   Award,
//   ChevronRight,
//   BarChart3,
//   Edit2,
//   Trash2,
//   Plus,
//   Search,
//   Filter,
//   MoreVertical,
//   Check,
//   X,
//   Grid3X3,
//   List,
//   SortAsc,
//   SortDesc
// } from 'lucide-react'
// import { useApi } from '@/hooks/useApi'
// import { toast } from 'sonner'

// interface Category {
//   id: string
//   name: string
//   books: Array<{
//     id: string
//     book: {
//       id: string
//       title: string
//       coverImage: string
//     }
//   }>
//   rank?: number
//   createdAt: string
// }

// export default function InteractiveCategoriesPage() {
//   const [categories, setCategories] = useState<Category[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
//   const [sortBy, setSortBy] = useState<'name' | 'books' | 'created'>('books')
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
//   const [editingId, setEditingId] = useState<string | null>(null)
//   const [newName, setNewName] = useState('')
//   // const [hoveredCard, setHoveredCard] = useState<string | null>(null)
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([])
//   const [showFilters, setShowFilters] = useState(false)
//     const api = useApi()



//    useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await api.get('/categories')
//         setCategories(res.data)
//       } catch (error) {
//         toast.error('Erro ao buscar categorias.')
//         console.error(error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchCategories()
//   }, [])

//     // Add ranks
//   // useEffect(() => {
//   //   const rankedCategories = categories.map((category, index) => ({
//   //     ...category,
//   //     rank: index + 1,
//   //   }))
//   //   setCategories(rankedCategories)
//   // }, [])

//   const getRankIcon = (rank: number) => {
//     switch (rank) {
//       case 1:
//         return <Crown className="text-yellow-300 drop-shadow-lg" size={20} fill="currentColor" />
//       case 2:
//         return <Trophy className="text-slate-300 drop-shadow-lg" size={20} />
//       case 3:
//         return <Award className="text-amber-500 drop-shadow-lg" size={20} />
//       default:
//         return <Star className="text-violet-400 drop-shadow-lg" size={20} />
//     }
//   }

//   const getRankBadgeStyle = (rank: number) => {
//     switch (rank) {
//       case 1:
//         return 'bg-yellow-800/20 border border-yellow-500/30 shadow-yellow-400/10'
//       case 2:
//         return 'bg-slate-700/20 border border-slate-400/30 shadow-slate-400/10'
//       case 3:
//         return 'bg-amber-700/20 border border-amber-500/30 shadow-amber-500/10'
//       default:
//         return 'bg-violet-700/20 border border-violet-500/30 shadow-violet-500/10'
//     }
//   }

//   const filteredAndSortedCategories = categories
//     .filter(category => 
//       category.name.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => {
//       let comparison = 0
//       switch (sortBy) {
//         case 'name':
//           comparison = a.name.localeCompare(b.name)
//           break
//         case 'books':
//           comparison = a.books.length - b.books.length
//           break
//         case 'created':
//           comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//           break
//       }
//       return sortOrder === 'asc' ? comparison : -comparison
//     })

//   const maxBooks = Math.max(...categories.map(c => c.books.length), 1)

//   const handleEdit = (category: Category) => {
//     setEditingId(category.id)
//     setNewName(category.name)
//   }

//   const handleSave = (id: string) => {
//     if (newName.trim() === '') return

//     setCategories(prev =>
//       prev.map(c => (c.id === id ? { ...c, name: newName } : c))
//     )
//     setEditingId(null)
//     setNewName('')
//   }

//   const handleCancel = () => {
//     setEditingId(null)
//     setNewName('')
//   }

//   const handleDelete = (id: string) => {
//     if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
//       setCategories(prev => prev.filter(c => c.id !== id))
//     }
//   }

//   const toggleSelection = (id: string) => {
//     setSelectedCategories(prev =>
//       prev.includes(id)
//         ? prev.filter(cId => cId !== id)
//         : [...prev, id]
//     )
//   }

//   const GridView = () => (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//       {filteredAndSortedCategories.map((category, index) => {
//         const coverImage = category.books[0]?.book?.coverImage || 'https://placehold.co/600x400'
//         const isSelected = selectedCategories.includes(category.id)

//         return (
//           <div
//             key={category.id}
//             className={`group relative overflow-hidden rounded-3xl cursor-pointer bg-gray-800 border border-white/5 hover:bg-gray-700 shadow-xl hover:shadow-2xl ${
//               isSelected ? 'ring-2 ring-blue-500' : ''
//             }`}
//             style={{
//               animationDelay: `${index * 50}ms`,
//               animation: 'fadeInUp 0.6s ease-out forwards',
//             }}
//             // onMouseEnter={() => setHoveredCard(category.id)}
//             // onMouseLeave={() => setHoveredCard(null)}
//           >
//             {/* Background Image */}
//             <div
//               className="absolute inset-0 bg-cover bg-center"
//               style={{
//                 backgroundImage: `url(${coverImage})`,
//                 filter: 'blur(0px) brightness(0.3)',
//                 opacity: 1,
//                 zIndex: 1,
//               }}
//             />

//             {/* Selection Checkbox */}
//             <div className="absolute top-4 left-4 z-20">
//               <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={() => toggleSelection(category.id)}
//                 className="w-5 h-5 rounded border-2 border-white/30 bg-black/20 backdrop-blur-sm"
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </div>

//             {/* Rank Badge */}
//             <div className="absolute top-4 right-4 z-20">
//               <div className={`flex items-center justify-center w-10 h-10 rounded-2xl backdrop-blur-xl transition-all duration-300 ${getRankBadgeStyle(category.rank!)}`}>
//                 {getRankIcon(category.rank!)}
//               </div>
//             </div>

//             {/* Actions Menu */}
//             {editingId !== category.id && (
//               <div className="absolute top-16 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                 <DropdownMenu
//                   onEdit={() => handleEdit(category)}
//                   onDelete={() => handleDelete(category.id)}
//                 />
//               </div>
//             )}

//             {/* Content */}
//             <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[240px]">
//               {editingId === category.id ? (
//                 <div className="space-y-4">
//                   <input
//                     type="text"
//                     value={newName}
//                     onChange={(e) => setNewName(e.target.value)}
//                     className="w-full bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400"
//                     placeholder="Nome da categoria"
//                     autoFocus
//                   />
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleSave(category.id)}
//                       className="flex items-center gap-1 px-3 py-1 bg-green-600/80 hover:bg-green-600 rounded-lg text-sm transition-colors"
//                     >
//                       <Check size={14} /> Salvar
//                     </button>
//                     <button
//                       onClick={handleCancel}
//                       className="flex items-center gap-1 px-3 py-1 bg-gray-600/80 hover:bg-gray-600 rounded-lg text-sm transition-colors"
//                     >
//                       <X size={14} /> Cancelar
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <h3 className="text-xl font-bold text-white leading-tight">
//                         {category.name}
//                       </h3>
//                       <div className="flex items-center gap-2 text-sm text-gray-400">
//                         <span className="font-medium">#{category.rank}</span>
//                         <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
//                         <span className="font-bold text-white">{category.books.length}</span>
//                         <span>{category.books.length === 1 ? 'conteúdo' : 'conteúdos'}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="relative">
//                       <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
//                         <div
//                           className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out"
//                           style={{
//                             width: `${(category.books.length / maxBooks) * 100}%`,
//                           }}
//                         />
//                       </div>
//                       <div className="mt-2 flex justify-between text-xs text-gray-500">
//                         <span>Popularidade</span>
//                         <span>{Math.round((category.books.length / maxBooks) * 100)}%</span>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
//                       <span>Explorar categoria</span>
//                       <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )

//   const ListView = () => (
//     <div className="space-y-4">
//       {filteredAndSortedCategories.map((category, index) => {
//         const isSelected = selectedCategories.includes(category.id)

//         return (
//           <div
//             key={category.id}
//             className={`group flex items-center justify-between p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-white/5 hover:bg-gray-700/50 transition-all duration-300 ${
//               isSelected ? 'ring-2 ring-blue-500' : ''
//             }`}
//             style={{
//               animationDelay: `${index * 50}ms`,
//               animation: 'fadeInUp 0.6s ease-out forwards',
//             }}
//           >
//             <div className="flex items-center gap-4 flex-1">
//               <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={() => toggleSelection(category.id)}
//                 className="w-5 h-5 rounded border-2 border-white/30"
//               />

//               <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${getRankBadgeStyle(category.rank!)}`}>
//                 {getRankIcon(category.rank!)}
//               </div>

//               {editingId === category.id ? (
//                 <div className="flex items-center gap-3 flex-1">
//                   <input
//                     type="text"
//                     value={newName}
//                     onChange={(e) => setNewName(e.target.value)}
//                     className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
//                     autoFocus
//                   />
//                   <button
//                     onClick={() => handleSave(category.id)}
//                     className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
//                   >
//                     <Check size={14} /> Salvar
//                   </button>
//                   <button
//                     onClick={handleCancel}
//                     className="flex items-center gap-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm transition-colors"
//                   >
//                     <X size={14} /> Cancelar
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex-1">
//                   <h3 className="text-lg font-bold text-white">{category.name}</h3>
//                   <p className="text-sm text-gray-400">
//                     {category.books.length} {category.books.length === 1 ? 'conteúdo' : 'conteúdos'}
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="w-32">
//                 <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
//                   <div
//                     className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-700"
//                     style={{
//                       width: `${(category.books.length / maxBooks) * 100}%`,
//                     }}
//                   />
//                 </div>
//               </div>

//               {editingId !== category.id && (
//                 <DropdownMenu
//                   onEdit={() => handleEdit(category)}
//                   onDelete={() => handleDelete(category.id)}
//                 />
//               )}
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
//               <BarChart3 size={28} className="text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold">Todas as Categorias</h1>
//               <p className="text-gray-400">Gerencie suas categorias de conteúdo</p>
//             </div>
//           </div>

//           {/* Search and Controls */}
//           <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
//             <div className="flex-1 max-w-md">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Buscar categorias..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               {/* View Mode Toggle */}
//               <div className="flex bg-gray-800/50 rounded-lg p-1">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded-md transition-colors ${
//                     viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
//                   }`}
//                 >
//                   <Grid3X3 size={18} />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded-md transition-colors ${
//                     viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
//                   }`}
//                 >
//                   <List size={18} />
//                 </button>
//               </div>

//               {/* Sort Controls */}
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value as any)}
//                 className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm"
//               >
//                 <option value="books">Por quantidade</option>
//                 <option value="name">Por nome</option>
//                 <option value="created">Por data</option>
//               </select>

//               <button
//                 onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
//                 className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 transition-colors"
//               >
//                 {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
//               </button>

//               <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
//                 <Plus size={18} />
//                 Nova Categoria
//               </button>
//             </div>
//           </div>

//           {/* Selected Actions */}
//           {selectedCategories.length > 0 && (
//             <div className="mt-4 p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm">
//                   {selectedCategories.length} categoria{selectedCategories.length !== 1 ? 's' : ''} selecionada{selectedCategories.length !== 1 ? 's' : ''}
//                 </span>
//                 <div className="flex gap-2">
//                   <button className="px-3 py-1 bg-red-600/80 hover:bg-red-600 rounded-lg text-sm transition-colors">
//                     Excluir selecionadas
//                   </button>
//                   <button
//                     onClick={() => setSelectedCategories([])}
//                     className="px-3 py-1 bg-gray-600/80 hover:bg-gray-600 rounded-lg text-sm transition-colors"
//                   >
//                     Cancelar
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         {isLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {Array.from({ length: 8 }).map((_, index) => (
//               <div
//                 key={index}
//                 className="rounded-3xl bg-gray-800/30 backdrop-blur-sm p-6 animate-pulse min-h-[240px]"
//               >
//                 <div className="space-y-4">
//                   <div className="flex justify-between">
//                     <div className="w-12 h-12 bg-gray-700/50 rounded-2xl"></div>
//                     <div className="w-10 h-10 bg-gray-700/50 rounded-2xl"></div>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="w-3/4 h-6 bg-gray-700/50 rounded-lg"></div>
//                     <div className="w-1/2 h-4 bg-gray-700/50 rounded-lg"></div>
//                   </div>
//                   <div className="w-full h-2 bg-gray-700/50 rounded-full"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : filteredAndSortedCategories.length === 0 ? (
//           <div className="text-center py-24">
//             <div className="relative inline-flex mb-6">
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
//               <div className="relative p-6 bg-gray-800 rounded-full border border-white/10">
//                 <BookOpen className="text-gray-400" size={48} />
//               </div>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-300 mb-2">
//               {searchTerm ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
//             </h3>
//             <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
//               {searchTerm 
//                 ? `Não encontramos categorias com o termo "${searchTerm}"`
//                 : 'Comece criando sua primeira categoria de conteúdo'
//               }
//             </p>
//           </div>
//         ) : (
//           <div>
//             {viewMode === 'grid' ? <GridView /> : <ListView />}

//             {/* Stats Footer */}
//             <div className="mt-12 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/5">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
//                 <div>
//                   <div className="text-2xl font-bold text-white">{categories.length}</div>
//                   <div className="text-sm text-gray-400">Total de Categorias</div>
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-white">
//                     {categories.reduce((acc, cat) => acc + cat.books.length, 0)}
//                   </div>
//                   <div className="text-sm text-gray-400">Total de Conteúdos</div>
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-white">
//                     {Math.round(categories.reduce((acc, cat) => acc + cat.books.length, 0) / categories.length) || 0}
//                   </div>
//                   <div className="text-sm text-gray-400">Média por Categoria</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   )
// }

// function DropdownMenu({
//   onEdit,
//   onDelete,
// }: {
//   onEdit: () => void
//   onDelete: () => void
// }) {
//   const [isOpen, setIsOpen] = useState(false)

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//       >
//         <MoreVertical size={18} className="text-gray-400" />
//       </button>

//       {isOpen && (
//         <>
//           <div
//             className="fixed inset-0 z-10"
//             onClick={() => setIsOpen(false)}
//           />
//           <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
//             <button
//               onClick={() => {
//                 setIsOpen(false)
//                 onEdit()
//               }}
//               className="flex items-center w-full px-4 py-3 text-sm text-left hover:bg-gray-700 transition-colors"
//             >
//               <Edit2 className="mr-3" size={16} />
//               Editar
//             </button>
//             <button
//               onClick={() => {
//                 setIsOpen(false)
//                 onDelete()
//               }}
//               className="flex items-center w-full px-4 py-3 text-sm text-left text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
//             >
//               <Trash2 className="mr-3" size={16} />
//               Excluir
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

//~
//
//
//
//
//
//
//
//

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Star,
  Crown,
  Trophy,
  Award,
  BookOpen,
  Trash2,
  Edit2,
  MoreVertical,
  Check,
  X,
  BarChart3,
  Search,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Plus,
} from 'lucide-react'
import { Category } from '@/types/categoryData'
import { getToken, useApi } from '@/hooks/useApi'
import axios from 'axios'
import { toast } from 'sonner'
import { CreateCategoryModal } from '@/components/categoryActions/CreateCategoryModal'

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [mounted, setMounted] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'books' | 'created'>('books')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [newName, setNewName] = useState('')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const router = useRouter()
  const api = useApi()

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

  useEffect(() => setMounted(true), [])

  const filteredAndSortedCategories = categories
    .filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'books':
          comparison = a.books.length - b.books.length
          break
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null)
    }

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdown])

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Tem certeza que deseja excluir esta categoria?')
    if (!confirm) return

    try {
      await api.delete(`/categories/${id}`)
      setCategories(prev => prev.filter(c => c.id !== id))
      toast.success('Categoria excluída com sucesso.')
    } catch (error) {
      toast.error('Erro ao excluir categoria.')
      console.error(error)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setNewName(category.name)
    setOpenDropdown(null)
  }

  const handleSave = async (id: string) => {
    if (newName.trim() === '') {
      toast.error('Nome da categoria não pode estar vazio.')
      return
    }

    try {
      await api.put(`/categories/${id}`, { name: newName })
      setCategories(prev =>
        prev.map(c => (c.id === id ? { ...c, name: newName } : c))
      )
      toast.success('Categoria atualizada.')
      setEditingId(null)
      setNewName('')
    } catch (error) {
      toast.error('Erro ao atualizar categoria.')
      console.error(error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setNewName('')
  }

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to category page
    router.push(`/home/categories/${categoryId}`)
  }

  const handleDropdownToggle = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation()
    setOpenDropdown(openDropdown === categoryId ? null : categoryId)
  }

  const handleKeyDown = (e: React.KeyboardEvent, categoryId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCategoryClick(categoryId)
    }
  }

  if (!mounted) return null

  const maxBooks = Math.max(...categories.map((c) => c.books.length), 1)

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {filteredAndSortedCategories.map((category, index) => {
        const coverImage = category.books[0]?.book?.coverImage

        return (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`group relative overflow-hidden rounded-3xl cursor-pointer bg-gray-800 border border-white/5 hover:bg-gray-700 md:h-[300px] shadow-xl transition-colors duration-200 hover:shadow-2xl`}
            style={{
              animationDelay: `${index * 50}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards',
            }}
          // onMouseEnter={() => setHoveredCard(category.id)}
          // onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${coverImage})`,
                filter: 'blur(0px) brightness(0.3)',
                opacity: 1,
                zIndex: 1,
              }}
            />


            {/* Actions Menu */}
            {editingId !== category.id && (
              <div className="absolute top-4 right-4 z-20 opacity-100 md:opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                <DropdownMenu
                  onEdit={() => handleEdit(category)}
                  onDelete={() => handleDelete(category.id)}
                />
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[240px]">
              {editingId === category.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value)
                      e.stopPropagation()
                    }}
                    className="w-full bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                    placeholder="Nome da categoria"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => 
                        {
                          handleSave(category.id);
                          e.stopPropagation()
                        }}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600/80 hover:bg-green-600 rounded-lg text-sm transition-colors cursor-pointer"
                    >
                      <Check size={14} /> Salvar
                    </button>
                    <button
                      onClick={(e) => {
                        handleCancel;
                        e.stopPropagation()
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-600/80 hover:bg-gray-600 rounded-lg text-sm transition-colors cursor-pointer"
                    >
                      <X size={14} /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="font-medium">#{category.rank}</span>
                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                        <span className="font-bold text-white">{category.books.length}</span>
                        <span>{category.books.length === 1 ? 'conteúdo' : 'conteúdos'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${(category.books.length / maxBooks) * 100}%`,
                          }}
                        />
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
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  const ListView = () => (
    <div className="space-y-4">
      {filteredAndSortedCategories.map((category, index) => {

        return (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`group flex items-center justify-between p-6 rounded-2xl bg-gray-800/50  border border-white/5 hover:bg-gray-700/50 transition-all cursor-pointer duration-300`}
            style={{
              animationDelay: `${index * 50}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards',
            }}
          >
            <div className="flex items-center gap-4 flex-1">
              {editingId === category.id ? (
                <div className="flex items-center gap-3 flex-1 mx-4">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => { 
                      setNewName(e.target.value)
                      e.stopPropagation()
                    }}
                    className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    autoFocus
                  />
                  <button
                    onClick={(e) => {
                      handleSave(category.id)
                      e.stopPropagation()
                    }}
                    className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    <Check size={14} /> Salvar
                  </button>
                  <button
                    onClick={(e) => {
                      handleCancel
                      e.stopPropagation()
                    }}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    <X size={14} /> Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{category.name}</h3>
                  <p className="text-sm text-gray-400">
                    {category.books.length} {category.books.length === 1 ? 'conteúdo' : 'conteúdos'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32">
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(category.books.length / maxBooks) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {editingId !== category.id && (
                <DropdownMenu
                  onEdit={() => handleEdit(category)}
                  onDelete={() => handleDelete(category.id)}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen w-full text-white p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div>
              <h2 className="lg:text-2xl md:text-xl text-lg font-bold">
                Todas as categorias
              </h2>
              <p className="text-gray-400 text-sm">Gerencie suas categorias, personalize e procure</p>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar categorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <List size={18} />
                </button>
              </div>

              {/* Sort Controls */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-800/50 border border-gray-700/50 cursor-pointer rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="books">Por quantidade</option>
                <option value="name">Por nome</option>
                <option value="created">Por data</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
              </button>

              <div>
                <CreateCategoryModal />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl bg-gray-800/30 backdrop-blur-sm p-6 animate-pulse min-h-[240px]"
              >
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="w-12 h-12 bg-gray-700/50 rounded-2xl"></div>
                    <div className="w-10 h-10 bg-gray-700/50 rounded-2xl"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-3/4 h-6 bg-gray-700/50 rounded-lg"></div>
                    <div className="w-1/2 h-4 bg-gray-700/50 rounded-lg"></div>
                  </div>
                  <div className="w-full h-2 bg-gray-700/50 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24">
            <div className="relative inline-flex mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
              <div className="relative p-6 bg-gray-800 rounded-full border border-white/10">
                <BookOpen className="text-gray-400" size={48} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              {searchTerm ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
              {searchTerm
                ? `Não encontramos categorias com o termo "${searchTerm}"`
                : 'Comece criando sua primeira categoria de conteúdo'
              }
            </p>
          </div>
        ) : (
          <div>
            {viewMode === 'grid' ? <GridView /> : <ListView />}

            {/* Stats Footer */}
            <div className="mt-12 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{categories.length}</div>
                  <div className="text-sm text-gray-400">Total de Categorias</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {categories.reduce((acc, cat) => acc + cat.books.length, 0)}
                  </div>
                  <div className="text-sm text-gray-400">Total de Conteúdos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {Math.round(categories.reduce((acc, cat) => acc + cat.books.length, 0) / categories.length) || 0}
                  </div>
                  <div className="text-sm text-gray-400">Média por Categoria</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DropdownMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
    const handleWrapperClick = (e: React.MouseEvent) => {
    e.stopPropagation() // <-- Isso impede o clique de "vazar" para o card
  }

  return (
    <div className="relative" onClick={handleWrapperClick}>
<button
  onClick={(e) => {
    e.stopPropagation(); // <-- ISSO aqui é o que você precisa
    setIsOpen(!isOpen);
  }}
  className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
>
        <MoreVertical size={22} className="text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false)
                onEdit()
              }}
              className="flex items-center w-full px-4 py-3 text-sm text-left hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Edit2 className="mr-3" size={16} />
              Editar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false)
                onDelete()
              }}
              className="flex items-center w-full px-4 py-3 text-sm text-left text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors cursor-pointer"
            >
              <Trash2 className="mr-3" size={16} />
              Excluir
            </button>
          </div>
        </>
      )}
    </div>
  )
}