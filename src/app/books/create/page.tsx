'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { parseCookies } from 'nookies';
import { toast } from 'sonner';
import CategorySelector from '@/components/CategorySelector';
import { Category } from '@/types/categoryData';

export default function CreateBookPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { 'books-register.token': token } = parseCookies();
      const res = await api.get('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    };

    fetchCategories();
  }, []);

  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { 'books-register.token': token } = parseCookies();

      const formData = new FormData();
      formData.append('title', title);
      if (description) formData.append('description', description);
      if (coverImage) formData.append('coverImage', coverImage);
      if (startDate) formData.append('startDate', startDate);
      if (finishDate) formData.append('finishDate', finishDate);
      categoryIds.forEach((id) => formData.append('categoryIds', id));

      await api.post('/books', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Livro adicionado para a biblioteca')
      router.push('/');
    } catch (err: any) {
      toast.error('Erro ao criar livro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto text-white">
      {/* Botão de voltar */}
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm mb-6 text-blue-400 hover:text-white transition duration-100 flex items-center gap-1 cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Voltar
      </button>

      <h1 className="text-xl md:text-3xl font-bold mb-6">Adicionar Novo Livro</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Título */}
        <div>
          <label className="block mb-1 text-sm">Título *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 transition p-2 outline-none text-white"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block mb-1 text-sm">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 transition p-2 outline-none text-white resize-none"
            rows={3}
          />
        </div>

        {/* Capa */}
        <div>
          <label className="block mb-1 text-sm">Capa (imagem)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-white text-xs"
          />
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="mt-2 max-h-40 object-contain rounded-md" />
          )}
        </div>

        {/* Datas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm">Início da leitura</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 transition p-2 outline-none text-white"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Fim da leitura</label>
            <input
              type="date"
              value={finishDate}
              onChange={(e) => setFinishDate(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 transition p-2 outline-none text-white"
            />
          </div>
        </div>

        {/* Categorias */}
         <CategorySelector categories={categories} />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Livro'}
        </button>
      </form>
    </div>
  );
}
