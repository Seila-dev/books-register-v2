// app/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import api from '@/services/api';
import CategoryLoading from './loading';
import ComponentArrowBack from '@/components/ArrowBack';

type Category = {
  id: string;
  name: string;
};

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { 'books-register.token': token } = parseCookies();
        const res = await api.get('/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategories(res.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <main className=" text-white w-full">
      <ComponentArrowBack />

      <h1 className="text-2xl font-bold my-6">Todas as Categorias</h1>

      {loading ? (
        <CategoryLoading />
      ) : categories.length === 0 ? (
        <p className="text-gray-400">Nenhuma categoria encontrada.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categories/${category.id}`}
                className="block px-4 py-2 bg-gray-800 rounded hover:bg-purple-600 text-white transition"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
