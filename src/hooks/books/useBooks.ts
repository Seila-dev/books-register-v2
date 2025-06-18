"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Book, CreateBookData, UpdateBookData } from '../../types/bookData';
import { useApi } from '../useApi';

export function useBooks() {
  const api = useApi();
  const queryClient = useQueryClient();

  // Helper function to build FormData for book operations
  const buildBookFormData = (data: CreateBookData | UpdateBookData): FormData => {
    const formData = new FormData();
    
    if ('title' in data && data.title) formData.append('title', data.title);
    if (data.description !== undefined) {
      formData.append('description', data.description || '');
    }
    if (data.rating !== undefined) {
      formData.append('rating', String(data.rating));
    }
    if (data.startDate !== undefined) {
      formData.append('startDate', data.startDate || '');
    }
    if (data.finishDate !== undefined) {
      formData.append('finishDate', data.finishDate === null ? '' : (data.finishDate || ''));
    }
    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }
    if (data.categoryIds && data.categoryIds.length > 0) {
      formData.append('categoryIds', JSON.stringify(data.categoryIds));
    }
    if (data.isFavorite !== undefined) {
      formData.append('isFavorite', String(data.isFavorite));
    }
    
    return formData;
  };

  // Fetch all books
  const booksQuery = useQuery<Book[], Error>({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await api.get<Book[]>('/books');
      return res.data;
    },
  });

  const { data: books = [], isLoading, error, refetch } = booksQuery;

  // Create book mutation
  const createBookMutation = useMutation<Book, Error, CreateBookData>({
    mutationFn: async (data) => {
      const formData = buildBookFormData(data);
      const res = await api.post<Book>('/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (newBook) => {
      queryClient.setQueryData<Book[]>(['books'], (old) =>
        old ? [...old, newBook] : [newBook]
      );
    },
  });

  // Update book mutation
  const updateBookMutation = useMutation<Book, Error, UpdateBookData>({
    mutationFn: async (data) => {
      const formData = buildBookFormData(data);
      const res = await api.put<Book>(`/books/${data.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (updatedBook) => {
      queryClient.setQueryData<Book[]>(['books'], (old) =>
        old ? old.map((b) => (b.id === updatedBook.id ? updatedBook : b)) : []
      );
      queryClient.invalidateQueries({ queryKey: ['book', updatedBook.id] });
    },
  });

  // Delete book mutation
  const deleteBookMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/books/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Book[]>(['books'], (old) =>
        old ? old.filter((b) => b.id !== id) : []
      );
      // Also invalidate the individual book query
      queryClient.removeQueries({ queryKey: ['book', id] });
    },
  });

  // Update rating mutation
  const updateRatingMutation = useMutation<Book, Error, { bookId: string; rating: number }>({
    mutationFn: async ({ bookId, rating }) => {
      const res = await api.patch<Book>(
        `/books/${bookId}/rating`,
        { rating },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return res.data;
    },
    onSuccess: (updatedBook) => {
      queryClient.setQueryData<Book[]>(['books'], (old) =>
        old ? old.map((b) => (b.id === updatedBook.id ? updatedBook : b)) : []
      );
      queryClient.invalidateQueries({ queryKey: ['book', updatedBook.id] });
    },
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation<Book, Error, { book: Book }>({
    mutationFn: async ({ book }) => {
      const updatedData: UpdateBookData = {
        id: book.id,
        isFavorite: !book.isFavorite,
      };
      const formData = buildBookFormData(updatedData);
      const res = await api.put<Book>(`/books/${book.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (updatedBook) => {
      queryClient.setQueryData<Book[]>(['books'], (old) =>
        old ? old.map((b) => (b.id === updatedBook.id ? updatedBook : b)) : []
      );
      queryClient.invalidateQueries({ queryKey: ['book', updatedBook.id] });
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation<Book, Error, { book: Book }>({
    mutationFn: async ({ book }) => {
      const updatedData: UpdateBookData = {
        id: book.id,
        finishDate: book.finishDate ? null : new Date().toISOString(),
      };
      const formData = buildBookFormData(updatedData);
      const res = await api.put<Book>(`/books/${book.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (updatedBook) => {
      queryClient.setQueryData<Book[]>(['books'], (old) =>
        old ? old.map((b) => (b.id === updatedBook.id ? updatedBook : b)) : []
      );
      queryClient.invalidateQueries({ queryKey: ['book', updatedBook.id] });
    },
  });

  return {
    books,
    isLoading,
    error,
    refetch,
    createBook: createBookMutation.mutateAsync,
    updateBook: updateBookMutation.mutateAsync,
    deleteBook: deleteBookMutation.mutateAsync,
    updateBookRating: updateRatingMutation.mutateAsync,
    toggleFavorite: toggleFavoriteMutation.mutateAsync,
    markAsRead: markAsReadMutation.mutateAsync,
    // Mutation states for loading/error handling
    isCreating: createBookMutation.isPending,
    isUpdating: updateBookMutation.isPending,
    isDeleting: deleteBookMutation.isPending,
  };
}