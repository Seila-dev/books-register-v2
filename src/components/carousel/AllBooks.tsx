'use client'

import BooksCarousel from '@/components/bookComponents/BooksCarousel'
import { Book } from '@/types/bookData'
import { Library } from 'lucide-react'

interface FavoriteBooksCarouselProps {
  allBooks: Book[]
}

export default function AllBooksCarrousel({ allBooks }: FavoriteBooksCarouselProps) {

  return (
    <section className="space-y-6 mt-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg">
          <Library className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Biblioteca</h2>
          <p className="text-gray-400 text-sm">Todos seus conteúdos em um só lugar</p>
        </div>
      </div>

      <BooksCarousel books={allBooks} />
    </section>
  )
}
