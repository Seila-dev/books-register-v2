'use client';

import { useEffect, useState, useRef } from 'react';
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { 'books-register.token': token } = parseCookies();

  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Se o menu estiver aberto e o clique for fora do menu, fecha o menu
      if (openMenuId) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await api.get('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(id: string) {
    if (!editName.trim()) {
      setError('Nome não pode ser vazio');
      return;
    }
    setError('');
    try {
      await api.put(
        `/categories/${id}`,
        { name: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditName('');
      fetchCategories();
      setOpenMenuId(null);
    } catch (err) {
      setError('Erro ao editar categoria');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que quer deletar esta categoria?')) return;

    try {
      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
      setOpenMenuId(null);
    } catch (err) {
      alert('Erro ao deletar categoria');
    }
  }

  return (
    <main className="text-white w-full">
      <ComponentArrowBack />

      <h1 className="text-2xl font-bold my-6">Todas as Categorias</h1>

      {loading ? (
        <CategoryLoading />
      ) : categories.length === 0 ? (
        <p className="text-gray-400">Nenhuma categoria encontrada.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between rounded relative my-2"
            >
              {editingId === category.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-white w-full outline-0 border-b border-b-blue-500 px-2 py-1 rounded"
                    autoFocus
                  />
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(category.id)}
                      className="bg-green-600 px-8 py-2 rounded cursor-pointer"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditName('');
                        setError('');
                      }}
                      className="bg-gray-600 px-2 py-2 rounded cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <div className='w-full flex items-center justify-between'>
                  <Link href={`/categories/${category.id}`} className="flex-1 px-4 py-2 bg-gray-600 cursor-pointer hover:bg-gray-700 transition duration-100 rounded-sm w-full h-full ">
                    {category.name}
                  </Link>

                  {/* Botão 3 pontinhos */}
                  <div className="relative" ref={(el) => {
                    menuRefs.current[category.id] = el;
                  }}>
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === category.id ? null : category.id)
                      }
                      className="p-2 ml-2 transition rounded-full duration-200 hover:bg-gray-700 cursor-pointer "
                      aria-label="Abrir menu de ações"
                    >
                      :
                    </button>

                    {/* Menu dropdown */}
                    {openMenuId === category.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10 p-2 ">
                        <button
                          onClick={() => {
                            setEditingId(category.id);
                            setEditName(category.name);
                            setOpenMenuId(null);
                            setError('');
                          }}
                          className="w-full text-left block rounded-md my-2 px-2 py-2 text-white cursor-pointer hover:bg-gray-700 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="w-full text-left block rounded-md my-2 px-2 py-2 text-red-500 cursor-pointer hover:bg-gray-700 transition"
                        >
                          Deletar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </ul>
      )}
    </main>
  );
}