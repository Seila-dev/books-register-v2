'use client';

import { useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, List, Book, Film, Tv, LayoutGrid } from 'lucide-react';
import { AuthContext } from '@/contexts/AuthContext';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';        // Impede scroll
      document.body.style.touchAction = 'none';       // Impede toque em mobile
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    { href: '/', label: 'Todos', icon: List },
    { href: '/livros', label: 'Livros', icon: Book },
    { href: '/filmes', label: 'Filmes', icon: Film },
    { href: '/series', label: 'Séries', icon: Tv },
    { href: '/categorias', label: 'Categorias', icon: LayoutGrid },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          <motion.div
            ref={menuRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-700 shadow-xl z-50 flex flex-col p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-semibold">BooksRegister</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-400 transition"
                aria-label="Fechar menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {menuItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className=" py-2 rounded-lg text-gray-200 hover:bg-blue-600 transition flex items-center gap-3 text-xs"
                >
                  <Icon size={16} className="text-white" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            <div className="border-t border-gray-700 mt-auto pt-4">
              {isAuthenticated ? (
                <Link
                  href="/user"
                  onClick={onClose}
                  className="block px-4 py-2 text-blue-400 hover:text-white hover:bg-blue-600 rounded-lg transition"
                >
                  {user?.username}
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="block px-4 py-2 text-white hover:text-white hover:bg-blue-600 rounded-lg transition"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
