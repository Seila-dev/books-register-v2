import { BookCategory } from "./categoryData";

export interface Book {
  id: string;
  title: string;
  coverImage?: string | null;
  description?: string | null;
  rating?: number | null;
  startDate?: string | null;
  finishDate?: string | null;
  userId: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
  book?: Book;
  categories: BookCategory[];
}

export interface CreateBookData {
  title: string;
  coverImage?: File;
  description?: string;
  rating?: number;
  startDate?: string | null;
  finishDate?: string | null;
  categoryIds?: string[];
  isFavorite?: boolean;
}

export interface UpdateBookData extends Partial<CreateBookData> {
  id: string;
}

export const StepDetails = [
  {
    number: 1,
    title: 'Informações Básicas',
    description: 'Título e imagem de capa',
    icon: '📖',
  },
  {
    number: 2,
    title: 'Detalhes da Leitura',
    description: 'Datas e anotações',
    icon: '📝',
  },
  {
    number: 3,
    title: 'Categorias',
    description: 'Organize seu conteúdo',
    icon: '🏷️',
  },
];

import * as z from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'No máximo 50 caracteres'),
  description: z.string().max(500, 'No máximo 500 caracteres').optional(),
  coverImage: z.instanceof(File).optional(),
  startDate: z.string().optional(),
  finishDate: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
});

export type CreateBookFormData = z.infer<typeof createBookSchema>;