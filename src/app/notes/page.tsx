'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useNotes } from '@/hooks/useNotes';
import { 
  Search, 
  Filter, 
  Calendar, 
  BookOpen, 
  Edit3, 
  Trash2, 
  MessageSquare,
  ChevronDown,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function NotesPage() {
  const { notes, isLoading, deleteNote, isDeleting } = useNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'book'>('newest');
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const uniqueBooks = Array.from(
    new Map(notes.map(note => [note.book.id, note.book])).values()
  );

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = searchTerm === '' || 
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.book.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBook = selectedBook === 'all' || note.book.id === selectedBook;
      
      return matchesSearch && matchesBook;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return a.book.title.localeCompare(b.book.title);
      }
    });

  const groupedNotes = sortBy === 'book' 
    ? filteredNotes.reduce((acc, note) => {
        const bookId = note.book.id;
        if (!acc[bookId]) {
          acc[bookId] = {
            book: note.book,
            notes: []
          };
        }
        acc[bookId].notes.push(note);
        return acc;
      }, {} as Record<string, { book: any; notes: typeof notes }>)
    : null;

  async function handleDeleteNote(noteId: string) {
    if (!confirm('Tem certeza que deseja excluir esta anotação?')) return;
    
    try {
      await deleteNote(noteId);
    } catch (error) {
      console.error('Erro ao excluir anotação:', error);
    }
  }

  function toggleNoteExpansion(noteId: string) {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  }

  function truncateText(text: string, maxLength: number = 200) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-white">
        <div className="max-w-6xl mx-auto animate-pulse space-y-6">
          <div className="h-10 bg-gray-700 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg">
              <div className="h-5 bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10 max-w-6xl mx-auto">
      {/* Removed Header as requested */}

      {/* Filters and Search */}
      <div className="mb-8 bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar anotações ou livros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Book Filter */}
          <div className="relative">
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os livros</option>
              {uniqueBooks.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'book')}
              className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigas</option>
              <option value="book">Por livro</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <MessageSquare className="w-20 h-20 mx-auto mb-6 text-gray-600" />
          <h3 className="text-2xl font-semibold mb-2">
            {searchTerm || selectedBook !== 'all' 
              ? 'Nenhuma anotação encontrada' 
              : 'Você ainda não tem anotações'
            }
          </h3>
          <p className="mb-6 max-w-md mx-auto">
            {searchTerm || selectedBook !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando sua primeira anotação'
            }
          </p>
          {(!searchTerm && selectedBook === 'all') && (
            <Link 
              href="/notes/new"
              className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg px-6 py-3 text-white font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Criar primeira anotação</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {sortBy === 'book' && groupedNotes ? (
            Object.values(groupedNotes).map(({ book, notes: bookNotes }) => (
              <div key={book.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold">{book.title}</h2>
                    <span className="text-sm text-gray-400">({bookNotes.length} anotações)</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-700">
                  {bookNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      isExpanded={expandedNotes.has(note.id)}
                      onToggleExpansion={() => toggleNoteExpansion(note.id)}
                      onDelete={() => handleDeleteNote(note.id)}
                      isDeleting={isDeleting}
                      truncateText={truncateText}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                isExpanded={expandedNotes.has(note.id)}
                onToggleExpansion={() => toggleNoteExpansion(note.id)}
                onDelete={() => handleDeleteNote(note.id)}
                isDeleting={isDeleting}
                truncateText={truncateText}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function NoteCard({
  note,
  isExpanded,
  onToggleExpansion,
  onDelete,
  isDeleting,
  truncateText,
}: {
  note: any;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  truncateText: (text: string, maxLength?: number) => string;
}) {
  return (
    <div className="p-6 hover:bg-gray-700 transition-colors cursor-pointer">
      <div className="flex justify-between items-start space-x-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1 text-sm text-blue-400 font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>{note.book.title}</span>
          </div>
          <p className="text-gray-200 whitespace-pre-wrap">
            {isExpanded ? note.content : truncateText(note.content, 150)}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpansion();
            }}
            className="mt-2 text-xs text-blue-400 hover:underline focus:outline-none"
            aria-label={isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
          >
            {isExpanded ? 'Mostrar menos ▲' : 'Mostrar mais ▼'}
          </button>
        </div>
        <div className="flex flex-col space-y-2">
          <Link 
            href={`/notes/${note.id}/edit`} 
            className="p-1 rounded hover:bg-blue-600 transition-colors"
            onClick={e => e.stopPropagation()}
            aria-label="Editar anotação"
          >
            <Edit3 className="w-5 h-5 text-blue-400" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
            className="p-1 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
            aria-label="Excluir anotação"
          >
            <Trash2 className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        Criado em {format(new Date(note.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
      </div>
    </div>
  );
}
