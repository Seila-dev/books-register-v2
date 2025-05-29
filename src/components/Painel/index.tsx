import Link from "next/link";

interface Activity {
  title: string;
  status: string;
  date: string;
}

interface DashboardPanelProps {
  userName: string;
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

  return (
    <div className="space-y-6 w-full mt-2 mb-10">
      <h1 className="lg:text-3xl md:text-2xl text-lg font-bold mb-6">
        Painel do usuário
      </h1>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 md:p-6 text-white flex items-center justify-between shadow-md w-full">
        <div>
          <p className="text-base md:text-2xl font-bold ">Bem-vindo de volta, {userName}! 👋</p>
          <p className="text-xs md:text-sm mt-1">Continue sua jornada literária. Você está indo muito bem!</p>
        </div>
        <Link href={'/books/create'} className="bg-white text-purple-600 px-4 py-2 rounded-md font-semibold shadow hover:bg-gray-100 hidden md:flex cursor-pointer">
          + Adicionar Livro
        </Link>
      </div>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-center md:text-start">
        <StatCard title={booksRead} subtitle="Livros lidos este mês" />
        <StatCard title={`${progressPercent.toFixed(0)}%`} subtitle="Meta mensal" />
        <StatCard title={currentStreak} subtitle="Dias consecutivos" />
        <StatCard title={readingNow} subtitle="Lendo agora"  />
      </div>

      {/* Progresso + Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800 text-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Meta Mensal</h3>
          <p className="text-sm mb-1 text-gray-300">{booksRead} de {monthlyGoal} livros</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-400">Faltam {remaining > 0 ? remaining : 0} livros para atingir sua meta!</p>
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
