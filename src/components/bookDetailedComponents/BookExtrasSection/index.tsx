'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Book } from '@/types/bookData';
import { useNotes } from '@/hooks/useNotes';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Calendar,
  MessageSquare,
  BookOpen,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import BooksCarousel from '@/components/BooksCarousel';
import { Note } from '@/types/noteData';
import SimilarBooksCarousel from '@/components/carousel/SimilarBooksCarousel';

interface BookExtrasSectionProps {
  allBooks: Book[];
  book: Book;
}

export default function BookExtrasSection({ allBooks, book }: BookExtrasSectionProps) {
  const { useNotesByBook, createNote, updateNote, deleteNote, isCreating, isUpdating, isDeleting } = useNotes();
  const { data: notes = [], isLoading: notesLoading, refetch } = useNotesByBook(book.id);

  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const newNoteRef = useRef<HTMLTextAreaElement>(null);

  // Filtrar e ordenar notas
  const filteredNotes = notes
    .filter(note =>
      searchTerm === '' ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Focar no textarea quando começar a adicionar nota
  useEffect(() => {
    if (isAddingNote && newNoteRef.current) {
      newNoteRef.current.focus();
    }
  }, [isAddingNote]);


  async function handleCreateNote() {
    if (!newNote.trim()) return;

    try {
      await createNote({
        content: newNote,
        bookId: book.id,
      });
      setNewNote('');
      setIsAddingNote(false);
      refetch();
    } catch (error) {
      console.error('Erro ao criar anotação:', error);
    }
  }

  async function handleUpdateNote(noteId: string) {
    if (!editContent.trim()) return;

    try {
      await updateNote({
        id: noteId,
        content: editContent,
      });
      setEditingNote(null);
      setEditContent('');
      refetch();
    } catch (error) {
      console.error('Erro ao atualizar anotação:', error);
    }
  }

  async function handleDeleteNote(noteId: string) {
    if (!confirm('Tem certeza que deseja excluir esta anotação?')) return;

    try {
      await deleteNote(noteId);
      refetch();
    } catch (error) {
      console.error('Erro ao excluir anotação:', error);
    }
  }

  function startEdit(note: Note) {
    setEditingNote(note.id);
    setEditContent(note.content);
  }

  function cancelEdit() {
    setEditingNote(null);
    setEditContent('');
  }

  if (!mounted) return null

  return (
    <div className="mt-8 space-y-12 px-4 py-8 relative z-0">
      {/* 📝 Seção de Anotações */}
      <section className="space-y-6">
        {/* Header da seção */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Minhas Anotações</h2>
              <p className="text-gray-400 text-sm">
                {notes.length} {notes.length === 1 ? 'anotação' : 'anotações'}
              </p>
            </div>
          </div>

          {!isAddingNote && (
            <button
              onClick={() => setIsAddingNote(true)}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nova Anotação
            </button>
          )}
        </div>

        {/* Filtros e busca */}
        {notes.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar nas anotações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="newest">Mais recentes</option>
                <option value="oldest">Mais antigas</option>
              </select>
            </div>
          </div>
        )}

        {/* Form para nova anotação */}
        {isAddingNote && (
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-medium">
              <Edit3 className="w-4 h-4" />
              Nova Anotação
            </div>

            <textarea
              ref={newNoteRef}
              className="w-full h-32 bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Escreva aqui suas reflexões, citações marcantes, insights ou qualquer observação sobre o livro..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote('');
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>

              <button
                onClick={handleCreateNote}
                disabled={!newNote.trim() || isCreating}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {isCreating ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        )}

        {/* Lista de anotações */}
        <div className="space-y-4">
          {notesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto" />
              <p className="text-gray-400">
                {searchTerm ? 'Nenhuma anotação encontrada' : 'Nenhuma anotação ainda'}
              </p>
              {!searchTerm && !isAddingNote && (
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Clique aqui para criar sua primeira anotação
                </button>
              )}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6 space-y-4 group hover:border-gray-600 transition-all duration-200"
              >
                {editingNote === note.id ? (
                  // Modo de edição
                  <div className="space-y-4">
                    <textarea
                      className="w-full h-32 bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>

                      <button
                        onClick={() => handleUpdateNote(note.id)}
                        disabled={!editContent.trim() || isUpdating}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        {isUpdating ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modo de visualização
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-gray-100 leading-relaxed flex-1 whitespace-pre-wrap">
                        {note.content}
                      </p>

                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(note)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                          title="Editar anotação"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={isDeleting}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                          title="Excluir anotação"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t border-gray-800">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(note.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* 📚 Leituras similares */}
      <SimilarBooksCarousel allBooks={allBooks} currentBook={book} />
    </div>
  );
}