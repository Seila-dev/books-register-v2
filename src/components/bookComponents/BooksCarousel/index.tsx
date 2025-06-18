"use client";

import { getToken } from "@/hooks/useApi";
import { ChevronLeft, ChevronRight, Popcorn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface Book {
  id: string;
  title: string;
  coverImage?: string | null;
}

interface BooksCarouselProps {
  books: Book[];
}

export default function BooksCarousel({ books }: BooksCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  function scroll(direction: "left" | "right") {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }
  useEffect(() => {
      const token = getToken()
      if (!token) router.push('/login');
  }, []);

  return (
    <section className="space-y-6 mb-12 mt-6">

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-6 max-w-xl mx-auto mt-20">
     <div className="text-5xl mb-4"><Popcorn/></div>
     <h2 className="text-2xl font-semibold text-white mb-2">Sua biblioteca está vazia</h2>
     <p className="text-sm text-gray-400 mb-6">
       Adicione filmes, séries, livros ou mangás para começar sua jornada. Tudo organizado em um só lugar.
     </p>
     <button
        onClick={() => router.push("/books/create")}
       className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2 rounded-md cursor-pointer shadow-lg transition"
     >
       + Adicionar conteúdo
     </button>
   </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full hidden md:flex cursor-pointer transition-all duration-200 backdrop-blur-sm border border-gray-700"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-4 px-1 max-w-full"
          >
            {books.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-44 md:w-52 group">
                <Link
                  href={`/books/${item.id}`}
                  className="block w-full aspect-[2/3] relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                >
                  {item.coverImage ? (
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center text-sm p-4 font-medium">
                      {item.title}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <h3 className="text-white font-medium text-sm line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full hidden md:flex cursor-pointer transition-all duration-200 backdrop-blur-sm border border-gray-700"
            aria-label="Scroll Right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
}
