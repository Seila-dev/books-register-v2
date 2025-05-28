import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Category } from '@/types/categoryData';

type Props = {
  open: boolean;
  onClose: () => void;
  selectedCategoryIds: string[];
  onChange: (ids: string[]) => void;
  token: string;
};

export default function CategoriesModal({ open, onClose, selectedCategoryIds, onChange, token }: Props) {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // Buscar todas as categorias
      api.get<Category[]>('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setAllCategories(res.data));
    }
  }, [open, token]);

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    setLoading(true);
    try {
      const res = await api.post<Category>('/categories', { name: newCategoryName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllCategories(prev => [...prev, res.data]);
      setNewCategoryName('');
    } catch (error) {
      alert('Erro ao adicionar categoria');
    } finally {
      setLoading(false);
    }
  }

  function toggleCategory(id: string) {
    if (selectedCategoryIds.includes(id)) {
      onChange(selectedCategoryIds.filter(cid => cid !== id));
    } else {
      onChange([...selectedCategoryIds, id]);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Editar Categorias</h2>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Nova categoria"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            className="flex-1 border p-2 rounded"
            disabled={loading}
          />
          <button onClick={handleAddCategory} disabled={loading} className="bg-blue-600 text-white px-4 rounded">
            Adicionar
          </button>
        </div>

        <div className="max-h-60 overflow-auto border rounded p-2 mb-4">
          {allCategories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategoryIds.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
        </div>
      </div>
    </div>
  );
}
