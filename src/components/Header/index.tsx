'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import { ButtonSkeleton } from '../loaders/ButtonSkeleton';
import { MobileMenu } from '../mobile/MobileMenu';
import { Book } from '@/types/bookData';
import { useRouter } from 'next/navigation';
import { getToken } from '@/hooks/useApi';

export const Header = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthenticated, user, loading, signOut } = useContext(AuthContext);
  const { searchTerm, setSearchTerm } = useSearch();
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const router = useRouter()

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        return;
      }

      try {
        const token = getToken()
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books?search=${debouncedSearchTerm}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        if (!res.ok) throw new Error('Erro ao buscar livros');
        const data = await res.json();
        setSearchResults(data)
      } catch (error) {
        console.error(error);
        setSearchResults([]);
      }
    };

    fetchBooks();
  }, [debouncedSearchTerm]);

  const handleSelectBook = (bookId: string) => {
    setSearchTerm('');
    setSearchResults([]);
    router.push(`/books/${bookId}`);
  };

  return (
    <header className="w-full bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="mx-auto flex justify-between items-center px-2 py-2 md:p-4 relative">
        <div className="flex justify-between w-full items-center">
          <button onClick={handleOpenMenu} className="mr-2 mt-1 md:hidden">
            <span className="material-symbols-outlined text-xs text-white">menu</span>
          </button>

          <Link href="/" className="hidden md:flex items-center w-fit">
            <span className="material-symbols-outlined text-xs text-blue-400">menu_book</span>
            <h1 className="ml-2 font-semibold text-base text-white">Watchlist</h1>
          </Link>

          <div className="relative px-2.5 mx-3 md:mx-4 rounded-2xl md:rounded-md bg-gray-800 flex items-center text-white w-full max-w-[25rem]">
            <span className="material-symbols-outlined mr-2 text-gray-400 !text-[14px] !md:text-base">search</span>
            <input
              type="text"
              placeholder="Buscar conteúdo por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent p-2 md:p-2 text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none"
            />

            {searchResults.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded-md mt-1 max-h-64 overflow-y-auto shadow-lg z-50">
                {searchResults.map((book) => (
                  <li
                    key={book.id}
                    onClick={() => handleSelectBook(book.id)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-700 transition cursor-pointer"
                  >
                    <img
                      src={book.coverImage || '/placeholder.jpg'}
                      alt={book.title}
                      className="w-8 h-10 object-cover rounded-sm"
                    />
                    <span className="text-sm">{book.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <nav className="flex gap-6 items-center">
          {loading ? (
            <ButtonSkeleton />
          ) : isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold focus:outline-none cursor-pointer"
              >
                {user?.username?.charAt(0).toUpperCase()}
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 p-2">
                  <ul className="text-sm text-white">
                    <li className="px-2 pt-4 text-xs md:text-sm">{user?.username}</li>
                    <li className="px-2 pb-4 text-[0.7rem] md:text-xs opacity-50">{user?.email}</li>
                    <hr className="text-gray-500" />
                    <li>
                      <Link
                        href="/user"
                        className="block px-2 py-2 rounded-md my-2 hover:bg-gray-700 transition"
                        onClick={() => setShowMenu(false)}
                      >
                        Configurações
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          signOut();
                        }}
                        className="w-full text-left block rounded-md my-2 px-2 py-2 text-red-500 cursor-pointer hover:bg-gray-700 transition"
                      >
                        Sair
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-white border-2 border-blue-400 px-3.5 py-1 rounded-xl font-medium hover:bg-blue-400 hover:text-gray-900 transition w-fit text-[0.8rem] m-2"
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      <MobileMenu isOpen={openMenu} onClose={() => setOpenMenu(false)} />
    </header>
  );
};
