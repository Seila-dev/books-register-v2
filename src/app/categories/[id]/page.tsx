// src/app/categories/[id]/page.tsx

import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Book } from '@/types/bookData'
import ComponentArrowBack from '@/components/ArrowBack'

export default async function CategoryPage({ params }: any) {
  const { id } = params

  const headersList = headers()
  const cookie = (await headersList).get('cookie') ?? ''
  const token = cookie
    .split('; ')
    .find((c) => c.startsWith('books-register.token='))
    ?.split('=')[1] ?? ''

  const response = await fetch(`${process.env.API_URL}/books`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!response.ok) return notFound()

  const allBooks: Book[] = await response.json()

  const filteredBooks = allBooks.filter((book) =>
    book.categories?.some((cat) => cat.categoryId === id)
  )

  const categoryName = filteredBooks[0]?.categories.find(cat => cat.categoryId === id)?.category.name

  return (
    <div className="text-white w-full">
      <ComponentArrowBack />
      <h1 className="text-2xl font-bold my-6">
        Categoria: {categoryName ?? 'Categoria desconhecida'}
      </h1>

      {filteredBooks.length === 0 ? (
        <p className="text-gray-400">Nenhum livro nesta categoria.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <li key={book.id} className="bg-gray-800 p-4 rounded-xl shadow-md">
              <Link href={`/books/${book.id}`} className="flex items-center gap-4">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-16 h-24 object-cover rounded" />
                ) : (
                  <div className="w-16 h-24 flex items-center justify-center bg-gray-600 text-white rounded">
                    <BookOpen size={24} />
                  </div>
                )}
                <div>
                  <h3 className="font-bold">{book.title}</h3>
                  <p className="text-sm text-gray-400">
                    {book.categories?.map(cat => cat.category.name).join(', ')}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
