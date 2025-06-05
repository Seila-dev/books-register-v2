'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Book } from '@/types/bookData';
import { useNotes, Note } from '@/hooks/useNotes';
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

interface BookExtrasSectionProps {
  similarBooks: Book[];
  book: Book;
}

export default function BookExtrasSection({ similarBooks, book }: BookExtrasSectionProps) {
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

  const carouselRef = useRef<HTMLDivElement>(null);
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

  function scroll(direction: 'left' | 'right') {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }

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
    <div className="mt-8 space-y-12 p-6 relative z-0">
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
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
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
                className="bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>

              <button
                onClick={handleCreateNote}
                disabled={!newNote.trim() || isCreating}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>

                      <button
                        onClick={() => handleUpdateNote(note.id)}
                        disabled={!editContent.trim() || isUpdating}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
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

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(note)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors"
                          title="Editar anotação"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={isDeleting}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
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
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Conteúdos Similares</h2>
            <p className="text-gray-400 text-sm">Descubra livros relacionados</p>
          </div>
        </div>

        {similarBooks.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto" />
            <p className="text-gray-400">Nenhum livro semelhante encontrado.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Botão esquerdo */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full hidden md:flex cursor-pointer transition-all duration-200 backdrop-blur-sm border border-gray-700"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Lista rolável */}
            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-6 scrollbar-hide scroll-smooth px-1 py-4"
            >
              {similarBooks.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-44 md:w-52 group"
                >
                  <Link
                    href={`/books/${item.id}`}
                    className="block w-full aspect-[2/3] relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                  >
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center text-sm p-4 font-medium">
                        {item.title}
                      </div>
                    )}

                    {/* Overlay no hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <h3 className="text-white font-medium text-sm line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Botão direito */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full hidden md:flex cursor-pointer transition-all duration-200 backdrop-blur-sm border border-gray-700"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}