'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { headers } from 'next/headers';

export function CreateCategoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

const cookie = document.cookie
  .split('; ')
  .find(c => c.startsWith('books-register.token='));

const token = cookie?.split('=')[1] ?? '';
console.log(`${process.env.NEXT_PUBLIC_API_URL}/categories`);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      setError('Erro ao criar categoria');
      return;
    }

    setIsOpen(false);
    setName('');
    setError('');
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-sm text-blue-400 hover:underline mt-2"
      >
        + Criar nova categoria
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-sm border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Nova Categoria</h2>
            
            {/* Não é mais <form> */}
            <div className="flex flex-col">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da categoria"
                required
                className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 text-white p-2 mb-4 outline-none placeholder-gray-400"
              />

              {error && <p className="text-sm text-red-400 mb-2">{error}</p>}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-sm px-4 py-1 text-gray-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
