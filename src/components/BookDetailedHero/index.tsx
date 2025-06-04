// components/BookDetailHero.tsx
'use client';
import { BookOpen, Bookmark, Share2, Pencil } from 'lucide-react';
import Link from 'next/link';
import { BookRating } from '@/components/BookRating';
import { CategoriesEditor } from '@/components/CategoryEditor';
import { Book } from '@/types/bookData';

export default function BookDetailHero({ book }: { book: Book }) {
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
    <section className="relative bg-black text-white overflow-hidden w-full min-h-full rounded-xl shadow-xl">
      {/* Banner de fundo com overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${book.coverImage || ''})`,
          filter: 'blur(8px)',
          opacity: 0.2,
        }}
      />
      <div className="relative z-10 px-8 py-10 md:flex gap-10">
        {/* Capa do livro */}
        <div className="w-full md:w-1/4 flex justify-center md:justify-start">
          <div className="w-52 h-72 rounded-lg overflow-hidden shadow-md">
            {book.coverImage ? (
              <img src={book.coverImage} alt={`Capa de ${book.title}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <BookOpen size={48} />
              </div>
            )}
          </div>
        </div>

        {/* Informações */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-4xl font-bold leading-tight">{book.title}</h1>
            <Link href={`/books/${book.id}/edit`} title="Editar conteúdo" className="hover:text-blue-500">
              <Pencil size={28} />
            </Link>
          </div>

          {/* Avaliação */}
          {book.rating !== null && (
            <div className="my-3">
              <BookRating bookId={book.id} initialRating={Number(book.rating)} size={28} />
              <span className="ml-3 text-sm text-gray-300">{Number(book.rating).toFixed(1)} / 5</span>
            </div>
          )}

          {/* Descrição */}
          {book.description && (
            <p className="text-gray-200 mb-6 leading-relaxed text-base">{book.description}</p>
          )}

          {/* Datas */}
          <div className="text-sm text-gray-400 mb-6">
            {formatDate(book.startDate)} – {formatDate(book.finishDate)}
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-2">Categorias</h3>
            <div className="flex flex-wrap gap-2">
              {(book.categories || []).map((cat) => (
                <span key={cat.categoryId} className="px-3 py-1 bg-white text-gray-800 rounded-full text-sm font-medium">
                  {cat.category.name}
                </span>
              ))}
              <CategoriesEditor book={book} />
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-4 mt-6 text-sm text-white">
            <button className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-lg font-semibold">
              Marcar como Lido
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-1">
              <Bookmark size={18} /> Favoritar
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-1">
              <Share2 size={18} /> Compartilhar
            </button>
          </div>

          {/* Rodapé */}
          <div className="mt-8 text-xs text-gray-500 flex flex-col md:flex-row md:justify-between">
            <span>ID: {book.id}</span>
            <span>
              Adicionado: {formatDate(book.createdAt)} | Atualizado: {formatDate(book.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
