'use client';

import { useEffect, useState } from 'react';
import { Book } from '@/types/bookData';
import api from '@/services/api';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { StarRating } from '../StarRating';
import { useBooks } from '@/contexts/useBooks';
import { useSearch } from '@/contexts/SearchContext';
import { BookSkeleton } from '@/components/loaders/BookSkeleton'

export default function BooksPage() {
  const { books, isLoading, error, updateBookRating } = useBooks();
  const { searchTerm } = useSearch();
  const router = useRouter();
  const [starSize, setStarSize] = useState(20);
  // const [books, setBooks] = useState<Book[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const { searchTerm } = useSearch();
  // const { updateBookRating } = useBooks();
  // const router = useRouter();
  // const [starSize, setStarSize] = useState(20);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640) setStarSize(20);
      else if (width < 1024) setStarSize(28);
      else setStarSize(36);
    };

    updateSize()
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // const handleDelete = async (id: string) => {
  //   const confirm = window.confirm('Deseja realmente excluir este livro?');
  //   if (!confirm) return;

  //   try {
  //     const { 'books-register.token': token } = parseCookies();
  //     await api.delete(`/books/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     setBooks((prev) => prev.filter((book) => book.id !== id));
  //   } catch (err: any) {
  //     alert('Erro ao deletar livro.');
  //   }
  // };

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
      <h1 className="lg:text-3xl md:text-2xl text-lg font-bold mb-4">Meus Livros</h1>

      {!isLoading && filteredBooks.length === 0 && (
        <p className="text-gray-500 mb-4">Nenhum livro encontrado.</p>
      )}
      {error && (
        <p className="text-red-400 mb-4">{error.message}</p>
      )}

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <BookSkeleton key={index} />)
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => router.push(`/books/${book.id}`)}
              className="flex flex-col overflow-hidden shadow-md hover:shadow-blue-400/30 transform hover:scale-[1.03] transition duration-300 cursor-pointer bg-gray-900"
            >
              {/* Imagem com aspect-ratio */}
              <div className="w-full rounded-xl aspect-[2/3] relative bg-gray-800">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full rounded-xl h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center text-xs justify-center text-gray-400">
                    Sem capa
                  </div>
                )}
              </div>

              {/* Conteúdo (estrelas, etc) */}
              <div className="p-1 flex flex-col gap-2 text-center w-full items-center backdrop-blur-sm">
                <div onClick={(e) => e.stopPropagation()}>
                  <StarRating
                    rating={book.rating || 0}
                    onRate={(newRating) => handleRatingChange(book.id, newRating)}
                    size={starSize}
                  />
                </div>
              </div>
            </div>
          ))
        )}

        <div
          onClick={() => router.push('/books/create')}
          className="flex flex-col items-center justify-center border-2 border-solid border-blue-500 rounded-md shadow-lg max-h-[300px] h-full cursor-pointer
    bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 hover:from-blue-900 hover:to-blue-700
    transition-transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden"
        >
          <div className="h-20 md:h-[40rem] w-full flex items-center justify-center">
            <span className="md:text-6xl text-4xl text-blue-400 group-hover:animate-bounce transition-all">+</span>
          </div>

          {/* Glow efeito no fundo */}
          <div className="absolute -inset-1 bg-blue-500 opacity-20 blur-lg rounded-xl z-[-1] group-hover:opacity-30 transition-opacity duration-400" />
        </div>
      </div>
    </div>
  );
}
