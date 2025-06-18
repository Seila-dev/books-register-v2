"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Note, CreateNoteData, UpdateNoteData } from '@/types/noteData';
import { useApi } from '../useApi';

// Hook principal para gerenciar notas
export function useNotes() {
  const api = useApi();
  const queryClient = useQueryClient();

  // Busca todas as notas
  const notesQuery = useQuery<Note[], Error>({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await api.get<Note[]>('/notes');
      return res.data;
    },
  });

  const { data: notes = [], isLoading, error, refetch } = notesQuery;

  // Criação de nota
  const createNoteMutation = useMutation<Note, Error, CreateNoteData>({
    mutationFn: async (data) => {
      const res = await api.post<Note>('/notes', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    },
    onSuccess: (newNote) => {
      queryClient.setQueryData<Note[]>(['notes'], (old) =>
        old ? [...old, newNote] : [newNote]
      );

      queryClient.setQueryData<Note[]>(['notes', 'book', newNote.bookId], (old) =>
        old ? [...old, newNote] : [newNote]
      );
    },
  });

  // Atualização de nota
  const updateNoteMutation = useMutation<Note, Error, UpdateNoteData>({
    mutationFn: async (data) => {
      const res = await api.put<Note>(`/notes/${data.id}`, { content: data.content }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    },
    onSuccess: (updatedNote) => {
      queryClient.setQueryData<Note[]>(['notes'], (old) =>
        old ? old.map((n) => (n.id === updatedNote.id ? updatedNote : n)) : []
      );

      queryClient.setQueryData<Note[]>(['notes', 'book', updatedNote.bookId], (old) =>
        old ? old.map((n) => (n.id === updatedNote.id ? updatedNote : n)) : []
      );

      queryClient.setQueryData<Note>(['note', updatedNote.id], updatedNote);
    },
  });

  // Exclusão de nota
  const deleteNoteMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/notes/${id}`);
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Note[]>(['notes'], (old) =>
        old ? old.filter((note) => note.id !== deletedId) : []
      );

      const noteToDelete = queryClient.getQueryData<Note[]>(['notes'])?.find((n) => n.id === deletedId);
      const bookId = noteToDelete?.bookId;

      if (bookId) {
        queryClient.setQueryData<Note[]>(['notes', 'book', bookId], (old) =>
          old ? old.filter((note) => note.id !== deletedId) : []
        );
      }

      queryClient.removeQueries({ queryKey: ['note', deletedId] });
    },
  });

  return {
    notes,
    isLoading,
    error,
    refetch,

    createNote: createNoteMutation.mutateAsync,
    updateNote: updateNoteMutation.mutateAsync,
    deleteNote: deleteNoteMutation.mutateAsync,

    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
  };
}