'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ComponentArrowBack from '@/components/ui/ArrowBack';
import CategorySelector from '@/components/CategorySelector';
import { Category } from '@/types/categoryData';
import { Book } from '@/types/bookData';
import api from '@/services/api';

const editBookSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(50, 'Máximo de 50 caracteres'),
  description: z.string().optional(),
  coverImage: z.instanceof(File).optional(),
  startDate: z.string().optional(),
  finishDate: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
});

type EditBookFormData = z.infer<typeof editBookSchema>;

type Props = {
  params: { id: string };
};

export default function EditBookPage({ params }: Props) {
  const { id } = params;
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditBookFormData>({
    resolver: zodResolver(editBookSchema),
    mode: 'onBlur'
  });

  const coverImageFile = watch('coverImage');

  useEffect(() => {
    if (coverImageFile instanceof File) {
      const url = URL.createObjectURL(coverImageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [coverImageFile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { 'books-register.token': token } = parseCookies();
        const [bookRes, catRes] = await Promise.all([
          api.get<Book>(`/books/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get<Category[]>('/categories', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const book = bookRes.data;
        setCategories(catRes.data);
        setValue('title', book.title);
        setValue('description', book.description || '');
        setValue('startDate', book.startDate || '');
        setValue('finishDate', book.finishDate || '');
        setValue('categoryIds', book.categories?.map(c => c.categoryId) || []);
        setPreviewUrl(book.coverImage || null);
      } catch (err) {
        toast.error('Erro ao carregar dados do livro.');
        router.push('/');
      }
    };
    fetchData();
  }, [id, router, setValue]);

  const onSubmit = async (data: EditBookFormData) => {
    try {
      const { 'books-register.token': token } = parseCookies();
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.startDate) formData.append('startDate', data.startDate);
      if (data.finishDate) formData.append('finishDate', data.finishDate);
      if (data.coverImage) formData.append('coverImage', data.coverImage);
      (data.categoryIds || []).forEach(id => formData.append('categoryIds', id));

      await api.patch(`/books/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${parseCookies()['books-register.token']}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Livro atualizado com sucesso!');
      router.push(`/book/${id}`);
    } catch (err) {
      toast.error('Erro ao atualizar o livro.');
    }
  };

  return (
    <div className="w-full">
      <ComponentArrowBack />
      <h1 className="text-xl md:text-2xl my-4 font-bold mb-6">Editar Livro</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div>
          <label className="block mb-1 text-sm">Título *</label>
          <input
            type="text"
            {...register('title')}
            className={`w-full bg-transparent border-b p-2 outline-none text-white transition ${errors.title ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'}`}
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
                    <img src={previewUrl} alt="Prévia" className="object-contain max-h-60 rounded-md" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <span className="material-symbols-outlined text-5xl mb-2">image</span>
                      <p className="text-sm">Clique para trocar capa</p>
                    </div>
                  )}
                </label>
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPreviewUrl(URL.createObjectURL(file));
                      field.onChange(file);
                    }
                  }}
                />
              </>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm">Início da leitura</label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 transition p-2 outline-none text-white"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Fim da leitura</label>
            <input
              type="date"
              {...register('finishDate')}
              className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 transition p-2 outline-none text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 text-sm w-full flex">Categorias</label>
          <div className="flex flex-wrap w-full gap-2 mb-2">
            {(watch('categoryIds') || [])
              .map(id => categories.find(c => c.id === id))
              .filter(Boolean)
              .map(cat => (
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
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}