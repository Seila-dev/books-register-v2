'use client'

import BooksCarousel from '@/components/bookComponents/BooksCarousel'
import { Book } from '@/types/bookData'
import { BookPlus } from 'lucide-react'

interface SimilarBooksCarouselProps {
  allBooks: Book[]
  currentBook: Book
}

export default function SimilarBooksCarousel({ allBooks, currentBook }: SimilarBooksCarouselProps) {
  const currentCategoryIds = currentBook.categories?.map((c) => c.categoryId) || []

  const similarBooks = allBooks.filter((book) => {
    if (book.id === currentBook.id) return false

    const bookCategoryIds = book.categories?.map((c) => c.categoryId) || []
    return bookCategoryIds.some((id) => currentCategoryIds.includes(id))
  })

  return (
    <section className="space-y-6 mt-6">

      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
          <BookPlus className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Recomendados</h2>
          <p className="text-gray-400 text-sm">Conteúdos relacionados</p>
        </div>
      </div>
      <BooksCarousel books={similarBooks} />
    </section>
  )
}
