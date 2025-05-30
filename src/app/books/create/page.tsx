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
import ComponentArrowBack from '@/components/ArrowBack';

const createBookSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(50, 'Máximo de 50 caracteres'),
  description: z.string().optional(),
  coverImage: z
    .instanceof(File)
    .optional(),
  startDate: z.string().optional(),
  finishDate: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
});

type CreateBookFormData = z.infer<typeof createBookSchema>;

export default function CreateBookPage() {
  const router = useRouter();
  const { createBook } = useBooks();
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
    mode: 'onBlur'
  });

  const coverImageFileList = watch('coverImage');

  useEffect(() => {
    if (typeof window !== 'undefined' && coverImageFileList instanceof File) {
      const url = URL.createObjectURL(coverImageFileList);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [coverImageFileList]);

  const fetchCategories = async () => {
    try {
      const { 'books-register.token': token } = parseCookies();
      const res = await api.get<Category[]>('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      toast.error('Erro ao carregar categorias');
    }
  };

  useEffect(() => {
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
    <div className="w-full">
      <ComponentArrowBack />

      <h1 className="text-xl md:text-2xl my-4 font-bold mb-6">Adicionar Novo Livro</h1>

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
            rows={5}
            className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 transition p-2 outline-none text-white resize-none"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm">Capa (imagem)</label>

          <Controller
            name="coverImage"
            control={control}
            render={({ field }) => (
              <>
                <label
                  htmlFor="coverImage"
                  className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-500 hover:border-blue-500 rounded-md p-6 cursor-pointer transition hover:bg-gray-800"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Prévia da capa"
                      className="object-contain max-h-60 rounded-md"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <span className="material-symbols-outlined text-5xl mb-2">image</span>
                      <p className="text-sm">Clique para adicionar capa</p>
                      <p className="text-xs text-gray-500">Formatos aceitos: .jpg, .png, .webp</p>
                    </div>
                  )}
                </label>

                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const file = files[0];
                      setPreviewUrl(URL.createObjectURL(file));
                      field.onChange(file); // passa só o arquivo, não a FileList
                    }
                  }}
                />
              </>
            )}
          />
          {errors.coverImage?.message && (
            <p className="text-red-500 text-xs mt-1">{String(errors.coverImage.message)}</p>
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
                  onCategoryCreated={fetchCategories}
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
