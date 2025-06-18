'use client'

import BooksCarousel from '@/components/BooksCarousel'
import { Book } from '@/types/bookData'
import { Star } from 'lucide-react'

interface FavoriteBooksCarouselProps {
  allBooks: Book[]
}

export default function FavoriteBooksCarousel({ allBooks }: FavoriteBooksCarouselProps) {
  const favoriteBooks = allBooks.filter((book) => book.isFavorite)

  return (
    <section className="space-y-6 mt-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Favoritos</h2>
          <p className="text-gray-400 text-sm">Seus conteúdos marcados como favoritos.</p>
        </div>
      </div>

      <BooksCarousel books={favoriteBooks} />
    </section>
  )
}
