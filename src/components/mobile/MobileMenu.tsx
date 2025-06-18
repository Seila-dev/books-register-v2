'use client';

import { useEffect, useRef, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  X,
  Book,
  LayoutGrid,
  UserIcon,
  Tag
} from 'lucide-react';
import { AuthContext } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { Category } from '@/types/categoryData';
import { getToken, useApi } from '@/hooks/useApi';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [_, setLoading] = useState(true);

  const token = getToken()
  const api = useApi()

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
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

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setLoading(false)
    }
  };

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
            className="fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-700 shadow-xl z-50 flex flex-col p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-semibold">Watchlist</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-400 transition"
                aria-label="Fechar menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-2 mb-3">
              <Link
                href="/"
                onClick={onClose}
                className={`py-2 rounded-md text-white hover:bg-purple-600 transition flex items-center gap-3 text-xs px-2 
                ${pathname === '/' ? 'font-bold bg-purple-500' : ''}`}
              >
                <Book size={16} />
                Biblioteca
              </Link>
              <Link
                href="/categories"
                onClick={onClose}
                className={`py-2 rounded-md text-white hover:bg-purple-600 transition flex items-center gap-3 text-xs px-2 
                ${pathname === '/categories' ? 'font-bold bg-purple-500' : ''}`}
              >
                <LayoutGrid size={16} />
                Categorias
              </Link>

              {categories.map(category => (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  onClick={onClose}
                  className={`py-2 rounded-md text-white hover:bg-purple-600 transition flex items-center gap-3 text-xs px-4  
                  ${pathname === `/categories/${category.id}` ? 'font-bold bg-purple-500' : ''}`}
                >
                  <Tag size={16} />
                  {category.name}
                </Link>
              ))}
            </nav>

            <div className="border-t border-gray-700 mt-auto pt-4">
              {isAuthenticated ? (
                <Link
                  href="/user"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 text-white font-bold hover:text-white hover:bg-purple-600 rounded-lg transition"
                >
                  <UserIcon size={18} className="text-white" />
                  {user?.username}
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 text-white hover:text-white hover:bg-purple-600 rounded-lg transition"
                >
                  <UserIcon size={18} className="text-white" />
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