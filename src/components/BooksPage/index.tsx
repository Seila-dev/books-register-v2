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
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import { QuickAddCard } from '../QuickAddComponent';
import {
  BookOpen,
  TrendingUp,
  Crown,
  Trophy,
} from 'lucide-react'

export default function BooksPage() {
  const [mounted, setMounted] = useState(false);


  const { books, isLoading, error, updateBookRating } = useBooks();
  const { searchTerm } = useSearch();
  const router = useRouter();
  const [starSize, setStarSize] = useState(10);

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
      if (width < 640) setStarSize(16);
      else if (width < 1024) setStarSize(26);
      else setStarSize(36);
    };



    updateSize()
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const { 'books-register.token': token } = parseCookies();
    if (!token) router.push('/login');
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddBook = () => {
    console.log('Add book manually');
  };

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

  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
  };

  if (!mounted) return null;
  if (error) router.push('/login')

  return (
    <div className="text-white w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
            <BookOpen size={24} className="text-white" />
          </div>
          <div>
            <h2 className="lg:text-3xl md:text-2xl text-lg font-bold">
              Livros Recentes
            </h2>
            <p className="text-gray-400 text-sm">
              Últimos livros adicionados
            </p>
          </div>
        </div>

        <button
          // onClick={() => router.push('/books')}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200 text-sm"
        >
          Ver todas
          <ArrowRight size={16} />
        </button>
      </div>

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
              className={`flex flex-col overflow-hidden shadow-md transform bg-gray-900 transition-all duration-300 ease-in-out rounded-xl ${isAnimating ? 'scale-95 opacity-80' : 'hover:scale-[1.03] hover:shadow-blue-400/30'
                }`}
            >
              <Link
                onClick={handleClick}
                href={`/books/${book.id}`}
                className="w-full aspect-[2/3] relative rounded-xl overflow-hidden bg-gray-800"
              >
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center md:text-xl text-xs justify-center text-gray-400 text-center">
                    {book.title}
                  </div>
                )}
              </Link>

              <div className="p-1 flex flex-col gap-2 text-center w-full items-center">
                <StarRating
                  rating={book.rating || 0}
                  onRate={(newRating) => handleRatingChange(book.id, newRating)}
                  size={starSize}
                />
              </div>
            </div>
          ))
        )}

        <QuickAddCard />

        <Link
          href={`/books/create`}
          className={`
            fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl 
            bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
            border-0 transition-all duration-300 ease-out z-20 flex justify-center items-center
          `}
        >
          <Plus className={`h-6 w-6 transition-transform duration-300`} />
        </Link>
      </div>
    </div>
  );
}
