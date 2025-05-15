'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '@/contexts/AuthContent';
import { MenuBurguer } from '@/components/MenuBurguer';

export const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <header className="flex justify-between items-center p-4 md:p-6 bg-gray-100 shadow-md relative">
      <div className="flex items-center">
        <button onClick={handleOpenMenu} className="mr-2 md:hidden">
          <span className="material-symbols-outlined text-2xl text-gray-800">menu</span>
        </button>
        <span className="material-symbols-outlined text-2xl text-gray-800">menu_book</span>
        <h1 className="ml-2 text-xl text-gray-800 font-semibold md:text-2xl">Books Register</h1>
      </div>

      <nav className="hidden md:flex gap-6 items-center">
        <Link href="/todos" className="flex items-center text-gray-700 hover:text-blue-600 transition">
          <span className="material-symbols-outlined text-base mr-1">menu_book</span>
          Todos
        </Link>
        <Link href="/livros" className="flex items-center text-gray-700 hover:text-blue-600 transition">
          <span className="material-symbols-outlined text-base mr-1">menu_book</span>
          Livros
        </Link>
        <Link href="/filmes" className="flex items-center text-gray-700 hover:text-blue-600 transition">
          <span className="material-symbols-outlined text-base mr-1">movie</span>
          Filmes
        </Link>
        <Link href="/series" className="flex items-center text-gray-700 hover:text-blue-600 transition">
          <span className="material-symbols-outlined text-base mr-1">tv</span>
          Séries
        </Link>
        <Link href="/categorias" className="flex items-center text-gray-700 hover:text-blue-600 transition">
          <span className="material-symbols-outlined text-base mr-1">search</span>
          Categorias
        </Link>
        {isAuthenticated && user?.username ? (
          <Link href="/user" className="text-gray-800 font-medium hover:text-blue-600">
            {user.username}
          </Link>
        ) : (
          <Link href="/login" className="text-gray-800 font-medium hover:text-blue-600">
            Sign In
          </Link>
        )}
      </nav>

      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-4 bg-white shadow-lg rounded-md p-4 flex flex-col gap-3 w-56 z-50 md:hidden"
          >
            <Link href="/todos" className="text-gray-700 hover:text-blue-600">Todos</Link>
            <Link href="/livros" className="text-gray-700 hover:text-blue-600">Livros</Link>
            <Link href="/filmes" className="text-gray-700 hover:text-blue-600">Filmes</Link>
            <Link href="/series" className="text-gray-700 hover:text-blue-600">Séries</Link>
            <Link href="/categorias" className="text-gray-700 hover:text-blue-600">Categorias</Link>
            {isAuthenticated && user?.username ? (
              <Link href="/user" className="text-gray-800 hover:text-blue-600">{user.username}</Link>
            ) : (
              <Link href="/login" className="text-gray-800 hover:text-blue-600">Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};