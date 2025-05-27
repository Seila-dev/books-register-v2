'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';

export const Header = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const { isAuthenticated, user } = useContext(AuthContext);
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
          <div className="flex md:hidden">
            {/* <span className="material-symbols-outlined text-xs text-blue-400">menu_book</span> */}
            {isAuthenticated ? (
              <Link href="/user" className="ml-2 font-semibold text-base text-white">
                {user?.username}
              </Link>
            ) : (
              <Link href="/login" className="text-white border-2 border-blue-400 px-3.5 py-1 rounded-xl font-medium hover:bg-blue-400 hover:text-gray-900 transition w-fit text-[0.8rem] m-2">
                Login
              </Link>
            )}
          </div>

          {/* DESKTOP: título */}
          <div className="hidden md:flex items-center w-full">
            <span className="material-symbols-outlined text-xs text-blue-400">menu_book</span>
            <h1 className="ml-2 font-semibold text-base text-white w-full">Books Register</h1>
          </div>
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
        <nav className="hidden md:flex gap-6 items-center">
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
              className="flex items-center text-white hover:text-blue-400 text-xs transition"
            >
              <span className="material-symbols-outlined mr-1 text-[0.2rem]">{icon}</span>
              {label}
            </Link>
          ))}

          {isAuthenticated && user?.username ? (
            <Link href="/user" className="text-white text-base hover:text-blue-400">
              {user.username}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-white border-2 border-blue-400 px-3.5 py-1.5 rounded-xl font-medium hover:bg-blue-400 hover:text-gray-900 transition w-fit text-[1rem]"
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 right-4 bg-gray-800 border border-gray-700 text-white shadow-lg rounded-md p-4 flex flex-col gap-3 w-56 z-50 md:hidden"
          >
            {[
              { href: '/', label: 'Todos' },
              { href: '/livros', label: 'Livros' },
              { href: '/filmes', label: 'Filmes' },
              { href: '/series', label: 'Séries' },
              { href: '/categorias', label: 'Categorias' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setOpenMenu(false)} className="hover:text-blue-400">
                {label}
              </Link>
            ))}

            {isAuthenticated && user?.username ? (
              <Link href="/user" className="hover:text-blue-400" onClick={() => setOpenMenu(false)}>
                {user.username}
              </Link>
            ) : (
              <Link href="/login" className="hover:text-blue-400" onClick={() => setOpenMenu(false)}>
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
