'use client';

import { useEffect, useState } from 'react';
import { Book } from '@/types/bookData';
import api from '@/services/api';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { StarRating } from '../StarRating';
import { useBooks } from '@/contexts/useBooks';
import Link from 'next/link';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { updateBookRating } = useBooks();
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { 'books-register.token': token } = parseCookies();
        const response = await api.get<Book[]>('/books', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao buscar livros');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Deseja realmente excluir este livro?');
    if (!confirm) return;

    try {
      const { 'books-register.token': token } = parseCookies();
      await api.delete(`/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err: any) {
      alert('Erro ao deletar livro.');
    }
  };

  const handleRatingChange = async (bookId: string, newRating: number) => {
    const bookToUpdate = books.find((b) => b.id === bookId);
    if (!bookToUpdate) return;

    const originalRating = bookToUpdate.rating;
    bookToUpdate.rating = newRating;

    try {
      updateBookRating({ bookId, rating: newRating });
    } catch (error) {
      bookToUpdate.rating = originalRating;
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 my-4 text-white w-full max-w-screen-xl">
      <h1 className="text-3xl font-bold mb-6">📚 Todos os Livros</h1>

      <input
        type="text"
        placeholder="Buscar livro por título..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-2 w-full max-w-md border border-gray-700 bg-gray-800 rounded-md text-white placeholder-gray-400"
      />

      {isLoading && <p className="text-gray-400">Carregando livros...</p>}
      {!isLoading && filteredBooks.length === 0 && (
        <p className="text-gray-500">Nenhum livro encontrado.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="flex flex-col bg-gray-900 border border-gray-800 rounded-md shadow-md overflow-hidden h-[500px]"
          >
            {/* Título */}
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold truncate">{book.title}</h3>
            </div>

            {/* Imagem com altura total e object-contain */}
            <div className="flex-1 relative bg-gray-800">
              {book.coverImage ? (
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img
                    src={book.coverImage}
                    alt={`Capa de ${book.title}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-gray-400">
                  Sem capa
                </div>
              )}
            </div>

            {/* Rating + Ações */}
            <div className="p-4 flex flex-col gap-2 border-t border-gray-800">
              <div onClick={(e) => e.stopPropagation()}>
                <StarRating
                  rating={book.rating || 0}
                  onRate={(newRating) => handleRatingChange(book.id, newRating)}
                />
              </div>
              <div className="flex justify-between gap-2 mt-2">
                <button
                  onClick={() => handleDelete(book.id)}
                  className="px-2 py-1 bg-red-700 text-white rounded-md text-sm hover:bg-red-800 transition whitespace-nowrap"
                >
                  Excluir
                </button>
                <Link
                  href={`/books/${book.id}`}
                  className="px-2 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition text-center flex-1"
                >
                  Visualizar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}