import { useNotes } from "@/hooks/useNotes";
import {
  BookOpen,
  BookOpenIcon,
  CheckCircle,
  Clock,
  LucideWallpaper,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import NoteCard from "../NoteCard";
import { Book } from "@/types/bookData";

interface Activity {
  title: string;
  status: string;
  date: string;
  book: Book;
}

interface DashboardPanelProps {
  userName: string | undefined;
  booksRead: number;
  monthlyGoal: number;
  currentStreak: number;
  readingNow: number;
  recentActivities: Activity[];
}

export default function DashboardPanel({
  userName,
  booksRead,
  monthlyGoal,
  currentStreak,
  readingNow,
  recentActivities,
}: DashboardPanelProps) {
  const { deleteNote, isDeleting, notes } = useNotes();

  const lastNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);

  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  function toggleNoteExpansion(noteId: string) {
    const newExpanded = new Set(expandedNotes);
    newExpanded.has(noteId) ? newExpanded.delete(noteId) : newExpanded.add(noteId);
    setExpandedNotes(newExpanded);
  }

  function truncateText(text: string, maxLength: number = 150) {
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  }

  const getActivityIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "concluído":
        return <CheckCircle size={18} className="text-green-400" />;
      case "em andamento":
        return <Loader2 size={18} className="text-blue-400 animate-spin" />;
      case "pendente":
        return <Clock size={18} className="text-yellow-400" />;
      default:
        return <BookOpen size={18} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 w-full mb-12 mt-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
          <LucideWallpaper size={24} className="text-white" />
        </div>
        <div>
          <h2 className="lg:text-2xl md:text-xl text-lg font-bold">
            Painel do usuário
          </h2>
          <p className="text-gray-400 text-sm">Estatísticas recentes do usuário</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Últimas Anotações */}
        <div className=" text-white rounded-xl shadow flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Últimas Anotações</h3>

          {lastNotes.length === 0 ? (
            <p className="text-gray-400">Nenhuma anotação recente.</p>
          ) : (
            <div className="space-y-4">
              {lastNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isExpanded={expandedNotes.has(note.id)}
                  onToggleExpansion={() => toggleNoteExpansion(note.id)}
                  onDelete={() => deleteNote(note.id)}
                  isDeleting={isDeleting}
                  truncateText={truncateText}
                />
              ))}
            </div>
          )}

          <div className="text-right pt-4 mt-auto">
            <Link href="/notes" className="text-sm text-purple-400 hover:underline">
              Ver todas as anotações &rarr;
            </Link>
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className=" text-white rounded-xl shadow flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
          <ul className="space-y-4">
            {recentActivities.map((activity, i) => (
              <li
                key={i}
                className="flex gap-4 items-center border-b border-gray-700 pb-3"
              >
                {activity.book?.coverImage ? (
                  <img
                    src={activity.book.coverImage}
                    alt={`Capa do livro ${activity.book.title}`}
                    className="w-12 h-16 object-cover rounded shadow"
                  />
                ) : (
                  <div className="w-12 h-16 bg-gray-700 rounded flex items-center justify-center text-gray-400">
                    <BookOpenIcon size={16} />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-white flex items-center gap-2">
                    {getActivityIcon(activity.status)}
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-400">{activity.status}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.date}</span>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  );
}
