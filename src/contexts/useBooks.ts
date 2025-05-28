"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api'; // seu axios configurado
import { Book, CreateBookData, UpdateBookData } from '../types/bookData';
import { parseCookies } from 'nookies';

// Função para obter token dos cookies (client-side)
function getToken() {
  const { 'books-register.token': token } = parseCookies();
  return token;
}

// Fetcher para pegar todos os livros
async function fetchBooks(): Promise<Book[]> {
  const token = getToken();
  if (!token) throw new Error('Usuário não autenticado');
  
  const res = await api.get<Book[]>('/books', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// Fetch livros por categoria
async function fetchBooksByCategory(categoryId: string): Promise<Book[]> {
  const token = getToken();
  const res = await api.get<Book[]>(`/books/category/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// Fetch livro por ID
async function getBookById(id: string): Promise<Book> {
  const token = getToken();
  const res = await api.get<Book>(`/books/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// Criar livro
async function createBook(data: CreateBookData): Promise<Book> {
  const token = getToken();

  const formData = new FormData();
  formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.rating !== undefined) formData.append('rating', String(data.rating));
  if (data.startDate) formData.append('startDate', data.startDate);
  if (data.finishDate) formData.append('finishDate', data.finishDate);
if (data.coverImage) {
  formData.append('coverImage', data.coverImage);
}
  if (data.categoryIds && data.categoryIds.length > 0)
    formData.append('categoryIds', JSON.stringify(data.categoryIds));

  const res = await api.post<Book>('/books', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}

// Atualizar livro
async function updateBook(data: UpdateBookData): Promise<Book> {
  const token = getToken();

  const formData = new FormData();
  if (data.title) formData.append('title', data.title);
  if (data.description !== undefined) formData.append('description', data.description || '');
  if (data.rating !== undefined) formData.append('rating', String(data.rating));
  if (data.startDate !== undefined) formData.append('startDate', data.startDate || '');
  if (data.finishDate !== undefined) formData.append('finishDate', data.finishDate || '');
  if (data.coverImage) formData.append('coverImage', data.coverImage);
  if (data.categoryIds && data.categoryIds.length > 0) {
    formData.append('categoryIds', JSON.stringify(data.categoryIds));
  }

  const res = await api.put<Book>(`/books/${data.id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}

// Deletar livro
async function deleteBook(id: string): Promise<void> {
  const token = getToken();
  await api.delete(`/books/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Atualizar rating
async function updateBookRating(bookId: string, newRating: number): Promise<Book> {
  const token = getToken();
  const res = await api.patch<Book>(
    `/books/${bookId}/rating`,
    { rating: newRating },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

export function useBooks() {
  const queryClient = useQueryClient();
  const token = getToken();

  const booksQuery = useQuery<Book[], Error>({
    queryKey: ['books'],
    queryFn: fetchBooks,
    enabled: !!token, // Só roda a query se tiver token
  });

  const { data: books = [], isLoading, error, refetch } = booksQuery;

  // Criar livro mutation
  const createBookMutation = useMutation<Book, Error, CreateBookData>({
    mutationFn: createBook,
    onSuccess: (newBook) => {
      queryClient.setQueryData<Book[]>(['books'], (old) =>
        old ? [...old, newBook] : [newBook]
      );
    },
  });

  // Atualizar livro mutation
  const updateBookMutation = useMutation<Book, Error, UpdateBookData>({
    mutationFn: updateBook,
    onSuccess: (updatedBook) => {
      queryClient.setQueryData<Book[]>(['books'], (old) =>
        old ? old.map((b) => (b.id === updatedBook.id ? updatedBook : b)) : []
      );
    },
  });

  const deleteBookMutation = useMutation<void, Error, string>({
    mutationFn: deleteBook,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Book[]>(['books'], (old) =>
        old ? old.filter((b) => b.id !== id) : []
      );
    },
  });

  const updateRatingMutation = useMutation<Book, Error, { bookId: string; rating: number }>({
    mutationFn: ({ bookId, rating }) => updateBookRating(bookId, rating),
    onSuccess: (updatedBook) => {
      queryClient.setQueryData<Book[]>(['books'], (old) =>
        old ? old.map((b) => (b.id === updatedBook.id ? updatedBook : b)) : []
      );
    },
  });


  // Função para buscar livros por categoria - não cacheada para exemplo simples
  async function fetchByCategory(categoryId: string) {
    return fetchBooksByCategory(categoryId);
  }

  // Função para buscar livro por id - não cacheada para exemplo simples
  async function getById(id: string) {
    return getBookById(id);
  }

  function useBookById(id: string) {
    const token = getToken(); // você pode colocar isso dentro do fetcher também

    return useQuery<Book, Error>({
      queryKey: ['book', id],
      queryFn: async () => {
        const res = await api.get<Book>(`/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      },
      enabled: !!id,
    });
  }


  return {
    books,
    isLoading,
    error,
    refetch,
    createBook: createBookMutation.mutateAsync,
    updateBook: updateBookMutation.mutateAsync,
    deleteBook: deleteBookMutation.mutateAsync,
    updateBookRating: updateRatingMutation.mutateAsync,
    fetchBooksByCategory: fetchByCategory,
    getBookById: getById,
    useBookById
  };
}