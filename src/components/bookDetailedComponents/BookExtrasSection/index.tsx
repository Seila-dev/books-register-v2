// components/BookExtrasSection.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book } from '@/types/bookData';

export default function BookExtrasSection({
  book,
  similarBooks,
}: {
  book: Book;
  similarBooks: Book[];
}) {
  const [notes, setNotes] = useState('');

  function handleSaveNotes() {
    console.log('Salvando anotações:', notes);
  }

  return (
    <div className="mt-4 space-y-16 p-6 relative z-10">
      {/* 📝 Anotações pessoais */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Anotações Pessoais</h2>
        <textarea
          className="w-full h-40 bg-black/50 border border-gray-700 rounded-md p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Escreva aqui suas anotações, reflexões ou trechos marcantes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="mt-3 text-right">
          <button
            onClick={handleSaveNotes}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold transition"
          >
            Salvar
          </button>
        </div>
      </section>

      {/* 📚 Leituras similares */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Conteúdos Similares</h2>

        {similarBooks.length === 0 ? (
          <p className="text-gray-400">Nenhum livro semelhante encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-6 min-w-full p-1">
              {similarBooks.map((item) => (
                <div
                  key={item.id}
                  className="w-36 flex-shrink-0 flex flex-col overflow-hidden bg-gray-900 rounded-xl shadow-md"
                >
                  <Link
                    href={`/books/${item.id}`}
                    className="block w-full h-52 relative rounded-t-xl overflow-hidden bg-gray-800"
                  >
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs md:text-sm text-gray-400 text-center px-2">
                        {item.title}
                      </div>
                    )}
                  </Link>
                  <div className="p-2 text-white text-sm font-medium text-center truncate">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
