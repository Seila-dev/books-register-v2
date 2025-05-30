'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import { ButtonSkeleton } from '../loaders/ButtonSkeleton';
import { MobileMenu } from '../mobile/MobileMenu';

export const Header = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthenticated, user, loading, signOut } = useContext(AuthContext);
  const { searchTerm, setSearchTerm } = useSearch();

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu); 
  };

  return (
    <header className="w-full bg-gray-900 text-white shadow-lg relative">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-2 py-2 md:p-4">
        <div className="flex justify-between w-full items-center">
          {/* Botão do menu (mobile) */}
          <button onClick={handleOpenMenu} className="mr-2 mt-1 md:hidden">
            <span className="material-symbols-outlined text-xs text-white">menu</span>
          </button>

          {/* MOBILE: nome do usuário ou login */}
          {/* <div className="flex md:hidden">
            {loading ? (
              <ButtonSkeleton />
            ) : isAuthenticated ? (
              <></>
            ) : (
              <Link
                href="/login"
                className="text-white border-2 border-blue-400 px-3.5 py-1 rounded-xl font-medium hover:bg-blue-400 hover:text-gray-900 transition w-fit text-[0.8rem] m-2"
              >
                Login
              </Link>
            )}
          </div> */}

          {/* DESKTOP: título */}
          <Link href="/" className="hidden md:flex items-center w-fit">
            <span className="material-symbols-outlined text-xs text-blue-400">menu_book</span>
            <h1 className="ml-2 font-semibold text-base text-white w-full">BooksRegister</h1>
          </Link>
          <div className="px-2.5 mx-3 md:mx-4 rounded-md bg-gray-800 border border-gray-600 flex items-center text-white w-full max-w-[25rem]">
            <span className="material-symbols-outlined mr-2 text-gray-400 !text-[14px] !md:text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar livro por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent p-1 md:p-2 text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* MENU DESKTOP */}
        <nav className="flex gap-6 items-center">
          {[
            { href: '/', icon: 'menu_book', label: 'Todos' },
            { href: '/livros', icon: 'menu_book', label: 'Livros' },
            { href: '/filmes', icon: 'movie', label: 'Filmes' },
            { href: '/series', icon: 'tv', label: 'Séries' },
            { href: '/categorias', icon: 'search', label: 'Categorias' },
          ].map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpenMenu(false)}
              className="items-center md:flex hidden text-white hover:text-blue-400 text-xs transition"
            >
              <span className="material-symbols-outlined mr-1 !text-xs">{icon}</span>
              {label}
            </Link>
          ))}

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
                    <li className='px-2 pt-4 text-xs md:text-sm'>
                      {user?.username}
                    </li>
                    <li className='px-2 pb-4 text-[0.7rem] md:text-xs opacity-50'>
                      {user?.email}
                    </li>
                    <hr className='text-gray-500' />
                    <li>
                      <Link
                        href="/user"
                        className="block px-2 py-2 rounded-md my-1 hover:bg-gray-700 transition"
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
                        className="w-full text-left block rounded-md my-1 px-2 py-2 text-red-500 cursor-pointer hover:bg-gray-700 transition"
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
