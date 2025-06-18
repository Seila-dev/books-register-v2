'use client'

import BooksCarousel from '@/components/bookComponents/BooksCarousel'
import { Book } from '@/types/bookData'
import { CheckCircle } from 'lucide-react'

interface ReadBooksCarouselProps {
  allBooks: Book[]
}

export default function ReadBooksCarousel({ allBooks }: ReadBooksCarouselProps) {
  const readBooks = allBooks.filter((book) => !!book.finishDate)

  return (
    <section className="space-y-6 mt-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Finalizados</h2>
          <p className="text-gray-400 text-sm">Conteúdos que você já concluiu</p>
        </div>
      </div>

      <BooksCarousel books={readBooks}/>
    </section>
  )
}
