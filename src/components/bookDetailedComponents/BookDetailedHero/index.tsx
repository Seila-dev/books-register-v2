'use client';

import {
  BookOpen,
  Pencil,
  Check,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { useBooks } from '@/hooks/useBooks';
import { BookRating } from '@/components/BookRating';
import { CategoriesEditor } from '@/components/CategoryEditor';
import BookExtrasSection from '../BookExtrasSection';
import { BookActionButtons } from '../BookActionsComponent';
import { StarRating } from '@/components/StarRating';

interface BookDetailHeroProps {
  bookId: string;
}

export default function BookDetailHero({ bookId }: BookDetailHeroProps) {
  const { useBookById, books, updateBookRating } = useBooks();
  const { data: book, isLoading, error } = useBookById(bookId);

  if (isLoading) {
    return (
      <section className="w-full text-white p-10 flex justify-center items-center">
        <div className="text-gray-400 text-sm">Carregando livro...</div>
      </section>
    );
  }

  if (error || !book) {
    return (
      <section className="w-full text-white p-10 flex justify-center items-center">
        <div className="text-red-500 text-sm">Erro ao carregar o livro.</div>
      </section>
    );
  }

  const similarBooks = (books || []).filter(
    (b) =>
      b.id !== book.id &&
      b.categories.some((cat) =>
        book.categories.map((c) => c.categoryId).includes(cat.categoryId)
      )
  );

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

  function formatDate(dateString?: string | null): string {
    if (!dateString) return 'Não informado';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  return (
    <section className="relative w-full bg-gradient-to-br from-[#0f0f0f] to-black text-white overflow-hidden rounded-xl shadow-2xl">
      {/* Fundo Blur com Capa */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-md scale-105"
        style={{ backgroundImage: `url(${book.coverImage || ''})` }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row px-8 py-10 gap-10">
        {/* Capa do livro */}
        <div className="flex-shrink-0 w-full lg:w-60 flex justify-center lg:justify-start">
          <div className="w-48 h-72 rounded-lg overflow-hidden shadow-lg ring-2 ring-white/10">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={`Capa de ${book.title}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <BookOpen size={48} />
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
              {book.title}
            </h1>
            <Link
              href={`/books/${book.id}/edit`}
              title="Editar conteúdo"
              className="text-gray-300 hover:text-blue-500 transition"
            >
              <Pencil size={28} />
            </Link>
          </div>

          {/* Status do livro */}
          {book.finishDate && (
            <div className="flex items-center gap-2 mb-4">
              <Check size={20} className="text-green-500" />
              <span className="text-green-400 font-medium">Terminou</span>
            </div>
          )}

          {/* Avaliação */}
          {book.rating !== null && (
            <div className="flex items-center gap-3 mb-4">
                            <BookRating bookId={book.id} initialRating={Number(book.rating)} size={32} />
              <span className="text-sm text-gray-300">{Number(book.rating).toFixed(1)} / 5</span>
            </div>
          )}

          {/* Descrição */}
          {book.description && (
            <p className="text-gray-300 mb-6 leading-relaxed text-base max-w-2xl">
              {book.description}
            </p>
          )}

          {/* Datas */}
          <div className="text-sm text-gray-400 mb-6">
            {formatDate(book.startDate)} – {formatDate(book.finishDate)}
          </div>

          {/* Categorias */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Categorias</h3>
            <div className="flex flex-wrap gap-2">
              {(book.categories || []).map((cat) => (
                <span
                  key={cat.categoryId}
                  className="px-3 py-1 bg-white flex justify-center items-center text-gray-800 rounded-md text-sm font-medium"
                >
                  {cat.category.name}
                </span>
              ))}
              <CategoriesEditor book={book} />
            </div>
          </div>

          {/* Ações */}
          <BookActionButtons book={book} />

          {/* Rodapé */}
          <div className="text-xs text-gray-500 flex flex-col md:flex-row md:justify-between mt-6">
            <span>ID: {book.id}</span>
            <span>
              Adicionado: {formatDate(book.createdAt)} | Atualizado: {formatDate(book.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Seções extras */}
      <BookExtrasSection book={book} similarBooks={similarBooks} />
    </section>
  );
}
