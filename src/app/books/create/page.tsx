'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { toast } from 'sonner';
import CategorySelector from '@/components/CategorySelector';
import { Category } from '@/types/categoryData';
import { useBooks } from '@/contexts/useBooks';
import api from '@/services/api';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const createBookSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  coverImage: z
    .any()
    .refine((file) => file instanceof File || file === undefined, 'Arquivo inválido')
    .optional(),
  startDate: z.string().optional(),
  finishDate: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
});

type CreateBookFormData = z.infer<typeof createBookSchema>;

export default function CreateBookPage() {
  const router = useRouter();
  const { createBook, isLoading: loading } = useBooks();
  const [categories, setCategories] = useState<Category[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isLoading },
  } = useForm<CreateBookFormData>({
    resolver: zodResolver(createBookSchema),
  });

  // Pega o arquivo do input para preview
  const coverImageFile = watch('coverImage');

  useEffect(() => {
    if (coverImageFile && coverImageFile instanceof File) {
      const url = URL.createObjectURL(coverImageFile);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [coverImageFile]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { 'books-register.token': token } = parseCookies();
      const res = await api.get(`/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: CreateBookFormData) => {
    try {
      await createBook(data);
      toast.success('Livro adicionado para a biblioteca');
      router.push('/');
    } catch (err) {
      toast.error('Erro ao criar livro.');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto text-white">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm mb-6 text-blue-400 hover:text-white transition duration-100 flex items-center gap-1 cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Voltar
      </button>

      <h1 className="text-xl md:text-3xl font-bold mb-6">Adicionar Novo Livro</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div>
          <label className="block mb-1 text-sm">Título *</label>
          <input
            type="text"
            {...register('title')}
            className={`w-full bg-transparent border-b p-2 outline-none text-white transition ${errors.title ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
              }`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm">Descrição</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 transition p-2 outline-none text-white resize-none"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm">Capa (imagem)</label>
          <input
            type="file"
            accept="image/*"
            {...register('coverImage')}
            className="text-white text-xs border-y-indigo-900"
          />
          {errors.coverImage?.message && (
            <p className="text-red-500 text-xs mt-1">{String(errors.coverImage.message)}</p>
          )}
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="mt-2 max-h-40 object-contain rounded-md" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm">Início da leitura</label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 transition p-2 outline-none text-white"
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm">Fim da leitura</label>
            <input
              type="date"
              {...register('finishDate')}
              className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 transition p-2 outline-none text-white"
            />
            {errors.finishDate && (
              <p className="text-red-500 text-xs mt-1">{errors.finishDate.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 text-sm w-full flex">Categorias</label>

          <div className="flex flex-wrap w-full gap-2 mb-2">
            {(watch('categoryIds') || [])
              .map((id) => categories.find((c) => c.id === id))
              .filter(Boolean)
              .map((cat) => (
                <span
                  key={cat!.id}
                  className="bg-white flex items-center text-gray-800 text-sm px-4 py-2 rounded-lg font-medium border border-gray-300 shadow-sm cursor-pointer"
                >
                  {cat!.name}
                </span>
              ))}
            <Controller
              control={control}
              name="categoryIds"
              render={({ field }) => (
                <CategorySelector
                  categories={categories}
                  selectedCategoryIds={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
          </div>


        </div>


        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? 'Salvando...' : 'Salvar Livro'}
        </button>
      </form>
    </div>
  );
}