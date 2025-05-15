'use client';

import Link from 'next/link';
import { useBooks } from '../../contexts/useBooks';
import { StarRating } from '@/components/StarRating';
// import { useRouter } from 'next/router';

export const Books = () => {
    const { books, error, deleteBook, updateBookRating } = useBooks();

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este livro?')) {
            try {
                await deleteBook(id);
            } catch (err) {
                // Erro tratado no context
            }
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
    //   if (loading)
    //     return <div className="p-5 text-base text-gray-300">Carregando livros...</div>;
    //   if (error)
    //     return <div className="p-5 text-base text-red-500">Erro: {error}</div>;
    //   if (books.length === 0)
    //     return <div className="p-5 text-base text-gray-300">Nenhum livro encontrado. Adicione seu primeiro livro!</div>;

    return (
        <div className="flex flex-col min-h-full w-full">
            <h2 className="mb-5 text-2xl font-semibold md:text-xl">Meus Livros</h2>
            <div className="flex flex-wrap gap-5">
                {books.map((book: any) => (
                    <div
                        key={book.id}
                        className="w-[280px] border border-gray-800 rounded-md p-4 bg-transparent flex flex-col gap-2 shadow-md"
                    >
                        <h3 className="text-lg font-semibold">{book.title}</h3>

                        {book.coverImage && (
                            <img
                                src={book.coverImage}
                                alt={`Capa de ${book.title}`}
                                className="w-full h-auto rounded-sm"
                            />
                        )}

                        <StarRating
                            rating={book.rating || 0}
                            onRate={(newRating) => handleRatingChange(book.id, newRating)}
                        />

                        <div className="flex justify-start gap-3 mt-2">
                            <button
                                onClick={() => handleDelete(book.id)}
                                className="px-3 py-1 bg-red-700 text-white rounded-md text-sm hover:bg-red-800 transition"
                            >
                                Excluir
                            </button>

                            <Link
                                href={`/book/${book.id}`}
                                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition text-center w-full"
                            >
                                Visualizar
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
