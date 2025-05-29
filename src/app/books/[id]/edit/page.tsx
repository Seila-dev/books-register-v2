'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import ComponentArrowBack from '@/components/ArrowBack';
import CategorySelector from '@/components/CategorySelector';
import { Category } from '@/types/categoryData';
import { Book, UpdateBookData } from '@/types/bookData';
import api from '@/services/api';
import { useBooks } from '@/contexts/useBooks';

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
  params: Promise<{ id: string }>;
};

export default function EditBookPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [initialBook, setInitialBook] = useState<Book | null>(null);
  const { updateBook, deleteBook } = useBooks();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditBookFormData>({
    resolver: zodResolver(editBookSchema),
    mode: 'onBlur',
  });

  const coverImageFile = watch('coverImage');

  // Fixed image preview with proper cleanup
  useEffect(() => {
    let objectUrl: string | null = null;
    
    if (coverImageFile instanceof File) {
      objectUrl = URL.createObjectURL(coverImageFile);
      setPreviewUrl(objectUrl);
    }

    // Cleanup function
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [coverImageFile]);

  // Fetch book data and categories with better error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { 'books-register.token': token } = parseCookies();
        
        if (!token) {
          toast.error('Token de autenticação não encontrado.');
          router.push('/login');
          return;
        }

        const [bookRes, catRes] = await Promise.all([
          api.get<Book>(`/books/${id}`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          api.get<Category[]>('/categories', { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
        ]);

        const book = bookRes.data;
        setInitialBook(book);
        setCategories(catRes.data);

        // Set form values
        setValue('title', book.title);
        setValue('description', book.description || '');
        setValue('startDate', book.startDate || '');
        setValue('finishDate', book.finishDate || '');
        setValue('categoryIds', book.categories?.map(c => c.categoryId) || []);
        
        // Set initial preview URL if book has cover image
        if (book.coverImage) {
          setPreviewUrl(book.coverImage);
        }
      } catch (error: any) {
        console.error('Error fetching book data:', error);
        
        // More specific error handling
        if (error.response?.status === 404) {
          toast.error('Livro não encontrado.');
        } else if (error.response?.status === 401) {
          toast.error('Não autorizado. Faça login novamente.');
          router.push('/login');
        } else if (error.response?.status === 403) {
          toast.error('Você não tem permissão para editar este livro.');
          router.push('/');
        } else {
          toast.error('Erro ao carregar dados do livro.');
        }
        
        router.push('/');
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, router, setValue]);

  // Prepare update data
  const prepareUpdateData = (data: EditBookFormData): UpdateBookData => ({
    id,
    title: data.title,
    description: data.description,
    startDate: data.startDate,
    finishDate: data.finishDate,
    coverImage: data.coverImage,
    categoryIds: data.categoryIds || [],
  });

  const onSubmit = async (data: EditBookFormData) => {
    try {
      const updateData = prepareUpdateData(data);
      await updateBook(updateData);

      toast.success('Livro atualizado com sucesso!');
      router.push(`/books/${id}`);
    } catch (error: any) {
      console.error('Error updating book:', error);
      
      // More specific error messages
      if (error.response?.status === 400) {
        toast.error('Dados inválidos. Verifique os campos preenchidos.');
      } else if (error.response?.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        router.push('/login');
      } else if (error.response?.status === 403) {
        toast.error('Você não tem permissão para editar este livro.');
      } else if (error.response?.status === 413) {
        toast.error('Imagem muito grande. Escolha uma imagem menor.');
      } else {
        toast.error('Erro ao atualizar o livro. Tente novamente.');
      }
    }
  };

  const handleDelete = async () => {
    // Better confirmation dialog
    const confirmMessage = `Tem certeza que deseja excluir o livro "${initialBook?.title}"?\n\nEsta ação não pode ser desfeita.`;
    const confirmed = window.confirm(confirmMessage);
    
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteBook(id);
      
      toast.success('Livro deletado com sucesso!');
      router.push('/');
    } catch (error: any) {
      console.error('Error deleting book:', error);
      
      // Specific error handling for delete
      if (error.response?.status === 404) {
        toast.error('Livro não encontrado.');
        router.push('/');
      } else if (error.response?.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        router.push('/login');
      } else if (error.response?.status === 403) {
        toast.error('Você não tem permissão para excluir este livro.');
      } else if (error.response?.status === 409) {
        toast.error('Não é possível excluir este livro. Ele pode estar sendo usado em outras partes do sistema.');
      } else {
        toast.error('Erro ao deletar livro. Tente novamente.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state while fetching data
  if (!initialBook && !categories.length) {
    return (
      <div className="w-full mt-8">
        <ComponentArrowBack />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400">Carregando dados do livro...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-8">
      <ComponentArrowBack />
      <h1 className="text-xl md:text-2xl my-4 font-bold mb-6">Editar Livro</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div>
          <label className="block mb-1 text-sm">Título *</label>
          <input
            type="text"
            {...register('title')}
            className={`w-full bg-transparent border-b p-2 outline-none text-white transition ${
              errors.title ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
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
                    <div className="relative">
                      <img 
                        src={previewUrl} 
                        alt="Prévia da capa" 
                        className="object-contain max-h-60 rounded-md" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center rounded-md transition-opacity">
                        <span className="text-white text-sm">Clique para alterar</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <span className="material-symbols-outlined text-5xl mb-2">image</span>
                      <p className="text-sm">Clique para adicionar capa</p>
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
                      // Validate file size (5MB limit)
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error('Imagem muito grande. Máximo 5MB permitido.');
                        return;
                      }
                      
                      // Validate file type
                      if (!file.type.startsWith('image/')) {
                        toast.error('Por favor, selecione apenas arquivos de imagem.');
                        return;
                      }
                      
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

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || isSubmitting}
            className={`bg-red-600 hover:bg-red-700 text-xs md:text-base text-white font-semibold cursor-pointer py-2 px-3 md:px-8 rounded-md transition ${
              (isDeleting || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isDeleting ? 'Deletando...' : 'Deletar'}
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isDeleting}
            className={`bg-blue-500 hover:bg-blue-600 text-xs md:text-base text-white font-semibold py-2 px-3 md:px-8 rounded-md transition cursor-pointer ${
              (isSubmitting || isDeleting) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}