// CreateCategoryAndAssignModal.tsx
'use client';

import { useState } from 'react';
import { useBooks } from '@/hooks/books/useBooks';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props {
  bookId: string;
  currentCategoryIds: string[];
  onAssign: (newIds: string[]) => void;
}

export default function CreateCategoryAndAssignModal({
  bookId,
  currentCategoryIds,
  onAssign,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { createBook, updateBook } = useBooks();
  const { updateBook: assignCategoryToBook } = useBooks();
  const router = useRouter()

  async function createCategory(name: string) {
    const token = document.cookie
      .split('; ')
      .find(c => c.startsWith('books-register.token='))!
      .split('=')[1];
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      }
    );
    if (!res.ok) throw new Error('Erro ao criar categoria');
    return (await res.json()) as { id: string; name: string };
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    try {
      const newCat = await createCategory(name.trim());
      const updatedIds = [...currentCategoryIds, newCat.id];
      await assignCategoryToBook({ id: bookId, categoryIds: updatedIds });
      onAssign(updatedIds);
      setIsOpen(false);
      setName('');
      setError('');
      toast.success(`Categoria "${newCat.name}" adicionada ao livro!`);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar categoria');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-gray-800 text-white text-xl px-4 py-2 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-700 cursor-pointer"
      >
        +
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-sm border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              Nova Categoria
            </h2>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome da categoria"
              className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 text-white p-2 mb-4 outline-none"
            />
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm px-4 py-1 text-gray-300 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
              >
                Criar & Associar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
