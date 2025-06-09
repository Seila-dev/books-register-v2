'use client';

import Link from 'next/link';
import { BookOpen, Edit3, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Note } from '@/types/noteData';

interface NoteCardProps {
  note: Note;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onDelete: () => void | Promise<void>;
  isDeleting: boolean;
  truncateText: (text: string, maxLength?: number) => string;
}

export default function NoteCard({
  note,
  isExpanded,
  onToggleExpansion,
  onDelete,
  isDeleting,
  truncateText,
}: NoteCardProps) {
  return (
    <div className="flex gap-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
      {/* Capa do Livro */}
      {note.book?.coverImage ? (
        <img
          src={note.book.coverImage}
          alt={`Capa do livro ${note.book.title}`}
          className="w-16 h-24 object-cover rounded shadow"
        />
      ) : (
        <div className="w-16 h-24 bg-gray-700 rounded flex items-center justify-center text-gray-400">
          <BookOpen className="w-5 h-5" />
        </div>
      )}

      {/* Conteúdo da anotação */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1 text-sm text-blue-400 font-semibold">
            <BookOpen className="w-4 h-4" />
            <Link href={`/books/${note.book.id}`}>{note.book.title}</Link>
          </div>
          <p className="text-gray-200 whitespace-pre-wrap text-xs sm:text-base">
            {isExpanded ? note.content : truncateText(note.content, 150)}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpansion();
            }}
            className="mt-2 text-xs text-blue-400 hover:underline focus:outline-none cursor-pointer"
            aria-label={isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
          >
            {isExpanded ? 'Mostrar menos ▲' : 'Mostrar mais ▼'}
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          Criado em {format(new Date(note.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-col space-y-2">
        <Link
          href={`/books/${note.bookId}`}
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
          className="p-1 rounded hover:bg-red-600 cursor-pointer transition-colors disabled:opacity-50"
          aria-label="Excluir anotação"
        >
          <Trash2 className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </div>
  );
}
