'use client';

import Link from 'next/link';
import { useBooks } from '../../contexts/useBooks';
import { StarRating } from '@/components/StarRating';

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

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.25rem',
                width: '100%',
                minHeight: '500px'
            }}
        >
            {books.map((book: any) => (
                <div
                    key={book.id}
                    className="flex flex-col bg-gray-900 border border-gray-800 rounded-md shadow-md overflow-hidden h-[500px]"
                >
                    <div className="p-4 border-b border-gray-800">
                        <h3 className="text-lg font-semibold truncate">{book.title}</h3>
                    </div>

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

                    <div className="p-4 flex flex-col gap-2 border-t border-gray-800">
                        <StarRating
                            rating={book.rating || 0}
                            onRate={(newRating) => handleRatingChange(book.id, newRating)}
                        />
                        <div className="flex justify-between gap-2 mt-2">
                            <button
                                onClick={() => handleDelete(book.id)}
                                className="px-2 py-1 bg-red-700 text-white rounded-md text-sm hover:bg-red-800 transition whitespace-nowrap"
                            >
                                Excluir
                            </button>
                            <Link
                                href={`/book/${book.id}`}
                                className="px-2 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition text-center flex-1"
                            >
                                Visualizar
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};