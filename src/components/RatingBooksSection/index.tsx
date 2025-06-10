'use client'

import BooksCarousel from '@/components/BooksCarousel'
import { Star } from 'lucide-react'
import { Book } from '@/types/bookData'

interface RatingBooksSectionProps {
  books: Book[]
}

export default function RatingBooksSection({ books }: RatingBooksSectionProps) {
  const groupedBooks = groupBooksByRating(books)

  return (
    <div className="space-y-12 mt-10">
      {[5, 4, 3, 2, 1].map((rating) => {
        const booksForRating = groupedBooks[rating] || []

        if (booksForRating.length === 0) return null

        return (
          <section key={rating} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{rating} Estrela{rating > 1 ? 's' : ''}</h2>
                <p className="text-gray-400 text-sm">
                  {booksForRating.length} livro{booksForRating.length > 1 ? 's' : ''} com avaliação {rating}
                </p>
              </div>
            </div>

            <BooksCarousel books={booksForRating} />
          </section>
        )
      })}
    </div>
  )
}

// Função auxiliar
function groupBooksByRating(books: Book[]) {
  const grouped: Record<number, Book[]> = {}
  books.forEach((book) => {
    const rating = Math.floor(book.rating || 0)
    if (!grouped[rating]) grouped[rating] = []
    grouped[rating].push(book)
  })
  return grouped
}
