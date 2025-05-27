'use client';

import { useEffect, useState } from 'react';
import { Book } from '@/types/bookData';
import api from '@/services/api';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { StarRating } from '../StarRating';
import { useBooks } from '@/contexts/useBooks';

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
      <h1 className="lg:text-3xl md:text-2xl text-base font-bold mb-6">Meus Livros</h1>

      <input
        type="text"
        placeholder="Buscar livro por título..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-2 w-full max-w-md border border-gray-700 bg-gray-800 rounded-md text-white placeholder-gray-400 text-xs"
      />

      {isLoading && <p className="text-gray-400">Carregando livros...</p>}
      {!isLoading && filteredBooks.length === 0 && (
        <p className="text-gray-500 mb-4">Nenhum livro encontrado.</p>
      )}

      {/* Aqui: sempre 3 colunas, sem responsividade */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => router.push(`/books/${book.id}`)}
            className="flex flex-col border border-gray-800 rounded-md shadow-md overflow-hidden max-h-[400px] h-full cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105"
          >

            <div className="h-36 md:h-[40rem] w-full bg-gray-800 relative">
              {book.coverImage ? (
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${book.coverImage})` }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Sem capa
                </div>
              )}
            </div>

            <div className="p-1 flex flex-col gap-2 border-t text-center items-center border-gray-800">
              <div onClick={(e) => e.stopPropagation()}>
                <StarRating
                  rating={book.rating || 0}
                  onRate={(newRating) => handleRatingChange(book.id, newRating)}
                />
              </div>
            </div>
          </div>
        ))}
        <div
          onClick={() => router.push('/books/create')}
          className="flex flex-col items-center justify-center border border-dashed border-gray-600 rounded-md shadow-md max-h-[400px] h-full cursor-pointer hover:border-white hover:scale-105 transition-transform"
        >
          <div className="h-36 md:h-[40rem] w-full bg-gray-800 flex items-center justify-center">
            <span className="md:text-5xl text-3xl text-gray-500">+</span>
          </div>
          <div className="p-2 text-center md:text-sm text-xs text-gray-400">
            Adicionar Livro
          </div>
        </div>
      </div>
    </div>
  );
}
