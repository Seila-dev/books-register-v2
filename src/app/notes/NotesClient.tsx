'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useNotes } from '@/hooks/notes/useNotes';
import {
    Search,
    Filter,
    BookOpen,
    Edit3,
    MessageSquare,
    ChevronDown,
    Plus,
} from 'lucide-react';
import NoteCard from '@/components/NoteCard';
import NotesSkeleton from '@/components/loaders/NotesSkeleton';

export default function NotesClient() {
    const [isClient, setIsClient] = useState(false);
    const { notes, isLoading, deleteNote, isDeleting } = useNotes();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'book'>('newest');
    const [selectedBook, setSelectedBook] = useState<string>('all');
    const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

    useEffect(() => {
        setIsClient(true);
    }, []);

    const uniqueBooks = Array.from(
        new Map(notes.map(note => [note.book.id, note.book])).values()
    );

    const filteredNotes = notes
        .filter(note => {
            const matchesSearch =
                searchTerm === '' ||
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

    const groupedNotes =
        sortBy === 'book'
            ? filteredNotes.reduce((acc, note) => {
                const bookId = note.book.id;
                if (!acc[bookId]) {
                    acc[bookId] = {
                        book: note.book,
                        notes: [],
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

    if (!isClient) {
        return null;
    }

    if (isLoading) return <NotesSkeleton />

    return (
        <>
            <div className="mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                        <Edit3 size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Minhas Anotações</h1>
                        <p className="text-gray-400 text-sm">Gerencie e visualize suas anotações por conteúdo ou ordem</p>
                    </div>
                </div>
            </div>
            {/* Filters and Search */}
            <div className="mb-6 sm:mb-10 bg-gradient-to-br from-gray-800/70 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 shadow-md backdrop-blur-md">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                            type="text"
                            placeholder="Buscar anotações ou livros..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg placeholder-gray-400 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Book Filter */}
                    <div className="relative">
                        <select
                            value={selectedBook}
                            onChange={(e) => setSelectedBook(e.target.value)}
                            className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-8 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos os livros</option>
                            {uniqueBooks.map(book => (
                                <option key={book.id} value={book.id}>
                                    {book.title}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                    </div>

                    {/* Sort By */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'book')}
                            className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-8 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="newest">Mais recentes</option>
                            <option value="oldest">Mais antigas</option>
                            <option value="book">Por conteúdo</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Notes List */}
            {filteredNotes.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <MessageSquare className="w-20 h-20 mx-auto mb-6 text-purple-500/70" />
                    <h3 className="text-2xl font-semibold mb-2">
                        {searchTerm || selectedBook !== 'all'
                            ? 'Nenhuma anotação encontrada'
                            : 'Você ainda não tem anotações'}
                    </h3>
                    <p className="mb-6 max-w-md mx-auto">
                        {searchTerm || selectedBook !== 'all'
                            ? 'Tente ajustar os filtros de busca'
                            : 'Comece criando sua primeira anotação'}
                    </p>
                    {!searchTerm && selectedBook === 'all' && (
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
                            <div
                                key={book.id}
                                className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-700/60 shadow-md"
                            >
                                <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                                    <div className="bg-gray-700/70 px-6 py-4 border-b border-gray-700/50 flex items-center space-x-3">
                                        <BookOpen className="w-5 h-5 text-purple-500" />
                                        <h2 className="text-lg font-semibold text-white">{book.title}</h2>
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
                        <div className="space-y-4 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40 rounded-xl p-4">
                            {filteredNotes.map(note => (
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
                    )}
                </div>
            )}
        </>
    );
}
