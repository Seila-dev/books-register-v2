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
  createdAt: string;
  updatedAt: string;
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
}

export interface UpdateBookData extends Partial<CreateBookData> {
  id: string;
}