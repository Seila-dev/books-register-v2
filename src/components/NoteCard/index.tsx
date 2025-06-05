'use client';
import Link from 'next/link';
import { Edit3, Trash2, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface NoteCardProps {
  note: {
    id: string;
    content: string;
    createdAt: string;
    book: {
      id: string;
      title: string;
    };
  };
  onDelete: (noteId: string) => Promise<void>;
  isDeleting: boolean;
}

export default function NoteCard({ note, onDelete, isDeleting }: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  function truncateText(text: string, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Tem certeza que deseja excluir esta anotação?')) return;
    await onDelete(note.id);
  }

  return (
    <div
      className="cursor-pointer rounded-lg"
      onClick={() => setIsExpanded(!isExpanded)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }
      }}
      aria-expanded={isExpanded}
      aria-label={`Anotação do livro ${note.book.title}`}
    >
      <div className="flex justify-between items-start space-x-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1 text-sm text-blue-400 font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>{note.book.title}</span>
          </div>
          <p className="text-gray-200 whitespace-pre-wrap">
            {isExpanded ? note.content : truncateText(note.content)}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
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
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded hover:bg-blue-600 transition-colors"
            aria-label="Editar anotação"
          >
            <Edit3 className="w-5 h-5 text-blue-400" />
          </Link>
          <button
            onClick={handleDelete}
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
