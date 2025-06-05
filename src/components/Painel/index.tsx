import { useNotes } from "@/hooks/useNotes";
import { ArrowRight, BookOpenIcon, Settings2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NoteCard from "../NoteCard";

interface Activity {
  title: string;
  status: string;
  date: string;
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
  const progressPercent = Math.min((booksRead / monthlyGoal) * 100, 100);
  const remaining = monthlyGoal - booksRead;

  const { deleteNote, isDeleting, notes } = useNotes()
  const router = useRouter()

  const lastNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6 w-full mt-1 mb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 md:p-6 text-white flex items-center justify-between shadow-md w-full">
        <div>
          <p className="text-base md:text-2xl font-bold ">Bem-vindo de volta, {userName}! 👋</p>
          <p className="text-xs md:text-sm mt-1">Estamos atualizando o website para o melhor design e experiência pro usuário. Aproveite o site atual enquanto isso :D</p>
        </div>
        <Link href={'/books/create'} className="bg-white text-purple-600 px-4 py-2 rounded-md font-semibold shadow hover:bg-gray-100 hidden md:flex cursor-pointer">
          + Adicionar Conteúdo
        </Link>
      </div>

      {/* Estatísticas principais */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-center md:text-start">
        <StatCard title={booksRead} subtitle="Livros lidos este mês" />
        <StatCard title={`${progressPercent.toFixed(0)}%`} subtitle="Meta mensal" />
        <StatCard title={currentStreak} subtitle="Dias consecutivos" />
        <StatCard title={readingNow} subtitle="Lendo agora"  />
      </div> */}

      {/* Progresso + Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800 text-white p-6 rounded-xl shadow h-full w-full flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Últimas Anotações</h3>

        {lastNotes.length === 0 ? (
          <p className="text-gray-400">Nenhuma anotação recente.</p>
        ) : (
          <div className="space-y-4">
            {lastNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={deleteNote}
                isDeleting={isDeleting}
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

        <div className="bg-gray-800 text-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
          <ul className="space-y-3">
            {recentActivities.map((a, i) => (
              <li key={i} className="flex justify-between border-b border-gray-700 pb-2">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-gray-400">{a.status}</p>
                </div>
                <span className="text-sm text-gray-500">{a.date}</span>
              </li>
            ))}
          </ul>
          <div className="text-right mt-4">
            <button className="text-sm text-purple-400 hover:underline">Ver todas as atividades</button>
          </div>
        </div>
      </div>
      {/* Últimas Anotações */}

    </div>
  );
}

function StatCard({ title, subtitle }: { title: string | number; subtitle: string }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow text-white">
      <h4 className="text-2xl font-bold">{title}</h4>
      <p className="text-xs md:text-sm text-gray-400">{subtitle}</p>
    </div>
  );
}
