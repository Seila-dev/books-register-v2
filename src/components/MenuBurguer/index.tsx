'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContent'

interface MenuBurguerProps {
  active: boolean;
  toggleMenu: () => void;
}

export const MenuBurguer = ({ active, toggleMenu }: MenuBurguerProps) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-16 right-4 bg-white shadow-lg rounded-md p-4 flex flex-col gap-3 w-56 z-50 md:hidden"
        >
          <Link href="/todos" onClick={toggleMenu} className="text-gray-700 hover:text-blue-600">
            Todos
          </Link>
          <Link href="/livros" onClick={toggleMenu} className="text-gray-700 hover:text-blue-600">
            Livros
          </Link>
          <Link href="/filmes" onClick={toggleMenu} className="text-gray-700 hover:text-blue-600">
            Filmes
          </Link>
          <Link href="/series" onClick={toggleMenu} className="text-gray-700 hover:text-blue-600">
            Séries
          </Link>
          <Link href="/categorias" onClick={toggleMenu} className="text-gray-700 hover:text-blue-600">
            Categorias
          </Link>
          {isAuthenticated && user?.username ? (
            <Link href="/user" onClick={toggleMenu} className="text-gray-800 hover:text-blue-600">
              {user.username}
            </Link>
          ) : (
            <Link href="/login" onClick={toggleMenu} className="text-gray-800 hover:text-blue-600">
              Sign In
            </Link>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
