'use client';

import { useEffect, useState } from 'react';
import { Book } from '@/types/bookData';
import api from '@/services/api';
import { parseCookies } from 'nookies';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar livros ao carregar
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

      // Atualiza a lista local
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err: any) {
      alert('Erro ao deletar livro.');
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-2">{book.title}</h2>

            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={`Capa de ${book.title}`}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleDelete(book.id)}
                className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Excluir
              </button>
              <button className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
                Visualizar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
