import { BookOpen, Bookmark, Share2, Pencil } from 'lucide-react';
import Link from 'next/link';
import { BookRating } from '@/components/BookRating';
import { CategoriesEditor } from '@/components/CategoryEditor';
import { Book } from '@/types/bookData';
import { cookies } from 'next/headers';
import BookExtrasSection from '../BookExtrasSection';

export default async function BookDetailHero({ book }: { book: Book }) {
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

  const cookieStore = await cookies();
  const token = cookieStore.get('books-register.token')?.value;

  const responseBooks = await fetch(`${process.env.API_URL}/books`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const allBooks: Book[] = await responseBooks.json();

  const similarBooks = allBooks.filter(
    (b) =>
      b.id !== book.id &&
      b.categories.some((cat) =>
        book.categories.map((c) => c.categoryId).includes(cat.categoryId)
      )
  );

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

          {/* Avaliação */}
          {book.rating !== null && (
            <div className="flex items-center gap-3 mb-4">
              <BookRating bookId={book.id} initialRating={Number(book.rating)} size={28} />
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
                  className="px-3 py-1 bg-white flex justify-center items-center text-gray-800 rounded-full text-sm font-medium"
                >
                  {cat.category.name}
                </span>
              ))}
              <CategoriesEditor book={book} />
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-4 text-sm mb-6">
            <button className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-lg font-semibold">
              Marcar como Lido
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
              <Bookmark size={18} /> Favoritar
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
              <Share2 size={18} /> Compartilhar
            </button>
          </div>

          {/* Rodapé */}
          <div className="text-xs text-gray-500 flex flex-col md:flex-row md:justify-between">
            <span>ID: {book.id}</span>
            <span>
              Adicionado: {formatDate(book.createdAt)} | Atualizado: {formatDate(book.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Seções extras: sugestões, anotações etc */}
      <BookExtrasSection book={book} similarBooks={similarBooks} />
    </section>
  );
}
