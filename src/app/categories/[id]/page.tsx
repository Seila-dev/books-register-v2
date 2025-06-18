import { notFound } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Book } from '@/types/bookData'
import { Metadata } from 'next';
import { Category } from '@/types/categoryData'

export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('books-register.token')?.value;

    if (!token) {
      console.log('Token não encontrado, retornando metadata padrão');
      return {
        title: 'Conteúdo não encontrado',
        description: 'Não foi possível carregar os dados do conteúdo.',
      };
    }

    const apiUrl = process.env.API_URL || 'https://books-register-api-production.up.railway.app';

    const response = await fetch(`${apiUrl}/categories/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Erro na API:', response.status, errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const category: Category = await response.json();

    return {
      title: `${category.name}`,
      description: `Explore os livros, séries e filmes da categoria "${category.name}" no Watchlist.`,
      openGraph: {
        title: `${category.name}`,
        description: `Veja o conteúdo salvo na categoria "${category.name}".`,
        url: `/categories/${params.id}`,
        type: 'website',
        siteName: 'Watchlist',
      },
    };
  } catch (err) {
    return {
      title: 'Categoria não encontrada',
      description: 'Não foi possível carregar essa categoria.',
    };
  }
}


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
    <div className="text-white w-full p-6">
      <h1 className="text-2xl font-bold my-6">
        Categoria: {categoryName ?? 'Categoria desconhecida'}
      </h1>

      {filteredBooks.length === 0 ? (
        <p className="text-gray-400">Nenhum conteúdo nesta categoria.</p>
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
