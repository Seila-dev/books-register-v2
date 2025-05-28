'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useContext(AuthContext);

  // Detecta clique fora do menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    { href: '/', label: 'Todos' },
    { href: '/livros', label: 'Livros' },
    { href: '/filmes', label: 'Filmes' },
    { href: '/series', label: 'Séries' },
    { href: '/categorias', label: 'Categorias' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Side menu */}
          <motion.div
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-64 bg-gray-900 border-l border-gray-700 shadow-xl z-50 flex flex-col p-6 gap-4"
          >
            {menuItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="text-white hover:text-blue-400 transition"
              >
                {label}
              </Link>
            ))}

            {isAuthenticated ? (
              <Link
                href="/user"
                className="text-blue-400 border-t border-gray-700 pt-4 mt-auto"
                onClick={onClose}
              >
                {user?.username}
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-white hover:text-blue-400 border-t border-gray-700 pt-4 mt-auto"
                onClick={onClose}
              >
                Login
              </Link>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};