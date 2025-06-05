// components/BookExtrasSection.tsx
'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Book } from '@/types/bookData';
import { ChevronLeft, ChevronRight, Pointer } from 'lucide-react';


export default function BookExtrasSection({
  similarBooks,
  book
}: {
  similarBooks: Book[];
  book: Book;
}) {
  const [notes, setNotes] = useState('');

  const carouselRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 'left' | 'right') {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }


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

        {similarBooks.length === 0 ? (
          <p className="text-gray-400">Nenhum livro semelhante encontrado.</p>
        ) : (
          <div className="relative">
            {/* Botão esquerdo */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full hidden md:flex cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Lista rolável */}
            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth px-1"
            >
              {similarBooks.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-40 md:w-48 flex flex-col overflow-hidden shadow-md bg-gray-900 rounded-xl"
                >
                  <Link
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
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center text-xs md:text-xl">
                        {item.title}
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </div>

            {/* Botão direito */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full hidden md:flex cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
