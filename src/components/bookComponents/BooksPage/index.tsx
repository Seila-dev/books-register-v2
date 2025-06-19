'use client';

import { useEffect, useState } from 'react';
import { Book } from '@/types/bookData';
import { useRouter } from 'next/navigation';
import { StarRating } from '../../StarRating';
import { useBooks } from '@/hooks/books/useBooks';
import { useSearch } from '@/contexts/SearchContext';
import { BookSkeleton } from '@/components/loaders/BookSkeleton'
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { QuickAddCard } from '../../QuickAddComponent';
import {
  BookOpen,
} from 'lucide-react'
import { getToken } from '@/hooks/useApi';

export default function BooksPage() {
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [starSize, setStarSize] = useState(10);

  const { books, isLoading, error, updateBookRating } = useBooks();
  const { searchTerm } = useSearch();
  const router = useRouter();

  useEffect(() => {
    const updateStarSize = () => {
      const width = window.innerWidth;
      if (width < 640) setStarSize(16);
      else if (width < 1024) setStarSize(26);
      else setStarSize(36);
    };

    updateStarSize();
    window.addEventListener('resize', updateStarSize);
    return () => window.removeEventListener('resize', updateStarSize);
  }, []);

  // Verificação de autenticação
  useEffect(() => {
    const token = getToken()
    if (!token) router.push('/login');
  }, [router]);

  // Controle de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRatingChange = async (bookId: string, newRating: number) => {
    const bookToUpdate = books.find((b) => b.id === bookId);
    if (!bookToUpdate) return;

    const originalRating = bookToUpdate.rating;
    bookToUpdate.rating = newRating;

    try {
      await updateBookRating({ bookId, rating: newRating });
    } catch (error) {
      bookToUpdate.rating = originalRating;
      console.error('Erro ao atualizar avaliação:', error);
    }
  };

  const handleBookClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) return null;
  
  if (error) router.push('/login');

  return (
    <main className="text-white w-full my-6" role="main">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div 
            className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"
            aria-hidden="true"
          >
            <BookOpen size={24} className="text-white" />
          </div>
          <div>
            <h1 className="lg:text-3xl md:text-2xl text-lg font-bold">
              Conteúdos Recentes
            </h1>
            <p className="text-gray-400 text-sm">
              Últimos conteúdos adicionados
            </p>
          </div>
        </div>

        <nav>
          <button
            type="button"
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            aria-label="Ver todos os conteúdos"
          >
            Ver todos
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </nav>
      </header>

      {!isLoading && filteredBooks.length === 0 && (
        <div 
          className="text-gray-500 mb-4 text-center"
          role="status"
          aria-live="polite"
        >
          {searchTerm && (
            <p className="text-sm mt-2">
              Tente ajustar sua pesquisa ou adicionar novos conteúdos.
            </p>
          )}
        </div>
      )}

      {error && (
        <div 
          className="text-red-400 mb-4 p-4 bg-red-900/20 rounded-lg border border-red-800/30"
          role="alert"
          aria-live="assertive"
        >
          <p>
            <strong>Erro:</strong> {error.message}
          </p>
        </div>
      )}

      {/* Grid de livros */}
      <section aria-label="Lista de conteúdos">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? (
            Array.from({ length: 6 }, (_, index) => (
              <BookSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            filteredBooks.map((book) => (
              <article
                key={book.id}
                className={`flex flex-col overflow-hidden shadow-md transform bg-gray-900 transition-all duration-300 ease-in-out rounded-xl ${
                  isAnimating 
                    ? 'scale-95 opacity-80' 
                    : 'hover:scale-[1.03] hover:shadow-blue-400/30'
                }`}
              >
                <Link
                  href={`/home/books/${book.id}`}
                  onClick={handleBookClick}
                  className="w-full aspect-[2/3] relative rounded-xl overflow-hidden bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label={`Ver detalhes de ${book.title}`}
                >
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={`Capa do livro ${book.title}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center md:text-xl text-xs justify-center text-gray-400 text-center p-2">
                      <span className="line-clamp-3">{book.title}</span>
                    </div>
                  )}
                </Link>

                <footer className="p-1 flex flex-col gap-2 text-center w-full items-center">
                  <div aria-label={`Avaliação atual: ${book.rating || 0} de 5 estrelas`}>
                    <StarRating
                      rating={book.rating || 0}
                      onRate={(newRating) => handleRatingChange(book.id, newRating)}
                      size={starSize}
                    />
                  </div>
                </footer>
              </article>
            ))
          )}

          <QuickAddCard />
        </div>
      </section>
    </main>
  );
}