"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { parseCookies } from 'nookies';

export interface Note {
    id: string;
    content: string;
    createdAt: string;
    bookId: string;
    userId: number;
    book: {
        id: string;
        title: string;
        coverImage?: string;
    };
}

export interface CreateNoteData {
    content: string;
    bookId: string;
}

export interface UpdateNoteData {
    id: string;
    content: string;
}

// Função para obter token dos cookies
function getToken() {
    const { 'books-register.token': token } = parseCookies();
    return token;
}

// Buscar todas as anotações do usuário
async function fetchNotes(): Promise<Note[]> {
    const token = getToken();
    if (!token) throw new Error('Usuário não autenticado');

    const res = await api.get<Note[]>('/notes', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

// Buscar anotações por livro
async function fetchNotesByBook(bookId: string): Promise<Note[]> {
    const token = getToken();
    if (!token) throw new Error('Usuário não autenticado');

    const res = await api.get<Note[]>(`/notes/book/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

// Buscar anotação por ID
async function fetchNoteById(id: string): Promise<Note> {
    const token = getToken();
    if (!token) throw new Error('Usuário não autenticado');

    const res = await api.get<Note>(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

// Criar anotação
async function createNote(data: CreateNoteData): Promise<Note> {
    const token = getToken();
    if (!token) throw new Error('Usuário não autenticado');

    const res = await api.post<Note>('/notes', data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return res.data;
}

// Atualizar anotação
async function updateNote(data: UpdateNoteData): Promise<Note> {
    const token = getToken();
    if (!token) throw new Error('Usuário não autenticado');

    const res = await api.put<Note>(`/notes/${data.id}`, {
        content: data.content,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return res.data;
}

// Deletar anotação
async function deleteNote(id: string): Promise<void> {
    const token = getToken();
    if (!token) throw new Error('Usuário não autenticado');

    await api.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

// Buscar anotações por termo
async function searchNotes(search: string): Promise<Note[]> {
    const token = getToken();
    if (!token) throw new Error('Usuário não autenticado');

    const res = await api.get<Note[]>(`/notes?search=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export function useNotes() {
    const queryClient = useQueryClient();
    const token = getToken();

    // Query para todas as anotações
    const notesQuery = useQuery<Note[], Error>({
        queryKey: ['notes'],
        queryFn: fetchNotes,
        enabled: !!token,
    });

    // Hook para anotações por livro
    function useNotesByBook(bookId: string) {
        return useQuery<Note[], Error>({
            queryKey: ['notes', 'book', bookId],
            queryFn: () => fetchNotesByBook(bookId),
            enabled: !!token && !!bookId,
        });
    }

    // Hook para anotação específica
    function useNoteById(id: string) {
        return useQuery<Note, Error>({
            queryKey: ['notes', id],
            queryFn: () => fetchNoteById(id),
            enabled: !!token && !!id,
        });
    }

    // Mutation para criar anotação
    const createNoteMutation = useMutation<Note, Error, CreateNoteData>({
        mutationFn: createNote,
        onSuccess: (newNote) => {
            // Atualizar cache de todas as anotações
            queryClient.setQueryData<Note[]>(['notes'], (old) =>
                old ? [...old, newNote] : [newNote]
            );

            // Atualizar cache das anotações do livro específico
            queryClient.setQueryData<Note[]>(['notes', 'book', newNote.bookId], (old) =>
                old ? [...old, newNote] : [newNote]
            );
        },
    });

    // Mutation para atualizar anotação
    const updateNoteMutation = useMutation<Note, Error, UpdateNoteData>({
        mutationFn: updateNote,
        onSuccess: (updatedNote) => {
            // Atualizar cache de todas as anotações
            queryClient.setQueryData<Note[]>(['notes'], (old) =>
                old ? old.map((note) => (note.id === updatedNote.id ? updatedNote : note)) : []
            );

            // Atualizar cache das anotações do livro específico
            queryClient.setQueryData<Note[]>(['notes', 'book', updatedNote.bookId], (old) =>
                old ? old.map((note) => (note.id === updatedNote.id ? updatedNote : note)) : []
            );

            // Atualizar cache da anotação específica
            queryClient.setQueryData<Note>(['notes', updatedNote.id], updatedNote);
        },
    });

    // Mutation para deletar anotação
    const deleteNoteMutation = useMutation<void, Error, string>({
        mutationFn: deleteNote,
        onSuccess: (_, deletedId) => {
            // Remover das anotações gerais
            queryClient.setQueryData<Note[]>(['notes'], (old) =>
                old ? old.filter((note) => note.id !== deletedId) : []
            );

            // Remover dos caches de livros específicos
            queryClient.getQueryCache().findAll({ queryKey: ['notes', 'book']}).forEach((query) => {
                queryClient.setQueryData<Note[]>(query.queryKey, (old) =>
                    old ? old.filter((note) => note.id !== deletedId) : []
                );
            });

            // Remover cache da anotação específica
            queryClient.removeQueries({ queryKey: ['notes', deletedId] });
        },
    });

    // Função para busca
    async function handleSearch(search: string) {
        return searchNotes(search);
    }

    return {
        // Dados das queries
        notes: notesQuery.data || [],
        isLoading: notesQuery.isLoading,
        error: notesQuery.error,
        refetch: notesQuery.refetch,

        // Hooks específicos
        useNotesByBook,
        useNoteById,

        // Mutations
        createNote: createNoteMutation.mutateAsync,
        updateNote: updateNoteMutation.mutateAsync,
        deleteNote: deleteNoteMutation.mutateAsync,

        // Estados das mutations
        isCreating: createNoteMutation.isPending,
        isUpdating: updateNoteMutation.isPending,
        isDeleting: deleteNoteMutation.isPending,

        // Função de busca
        searchNotes: handleSearch,
    };
}