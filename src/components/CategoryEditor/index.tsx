"use client"

import { useEffect, useState } from 'react';
import CategorySelector from '../CategorySelector';
import { Book } from '@/types/bookData';
import { Category } from '@/types/categoryData';
import { useBooks } from '@/contexts/useBooks';
import { useRouter } from 'next/navigation';

export function CategoriesEditor({ book }: { book: Book }) {
  const { updateBook } = useBooks();
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string[]>(book.categories.map(c => c.categoryId));
  const router = useRouter();

  useEffect(() => {
    // Buscar todas categorias da API
    async function fetchCategories() {
      const token = document.cookie
        .split('; ')
        .find(c => c.startsWith('books-register.token='))?.split('=')[1] ?? '';

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setAllCategories(data);
      }
    }
    fetchCategories();
  }, []);

  const onChange = async (newIds: string[]) => {
    setSelected(newIds);
    await updateBook({ id: book.id, categoryIds: newIds });
    router.refresh();
  };

  return (
    <CategorySelector
      categories={allCategories}
      selectedCategoryIds={selected}
      onChange={onChange}
    />
  );
}
