// components/BookExtrasSection.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book } from '@/types/bookData';
import { StarRating } from '@/components/StarRating';

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
    <div className="mt-4 space-y-16 p-6 relative z-0">
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

              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {similarBooks.length === 0 ? (
          <p className="text-gray-400">Nenhum livro semelhante encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-6 min-w-full p-1">
              {similarBooks.map((item) => (
                <div
              key={item.id}
              className={`flex flex-col overflow-hidden shadow-md w-full transform bg-gray-900 transition-all duration-300 ease-in-out rounded-xl`}
            >
              <Link
                // onClick={handleClick}
                href={`/books/${item.id}`}
                className="w-full aspect-[2/3] relative rounded-xl overflow-hidden bg-gray-800"
              >
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center md:text-xl text-xs justify-center text-gray-400 text-center">
                    {item.title}
                  </div>
                )}
              </Link>

              {/* <div className="p-1 flex flex-col gap-2 text-center w-full items-center">
                <StarRating
                  rating={book.rating || 0}
                  onRate={(newRating) => handleRatingChange(book.id, newRating)}
                  size={starSize}
                />
              </div> */}
            </div>
          ))}
            </div>
          </div>
        )}
        </div>
      </section>
    </div>
  );
}
