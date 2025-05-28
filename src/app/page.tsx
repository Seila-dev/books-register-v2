import BooksPage from "@/components/BooksPage";
import { Header } from "@/components/Header";
import DashboardPanel from "@/components/Painel";
import DashboardIntro from "@/components/Painel";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white flex flex-col items-center min-h-full w-full p-4 max-w-screen-xl justify-center m-auto gap-8">
      <DashboardPanel
        userName="Erick"
        booksRead={12}
        monthlyGoal={20}
        currentStreak={7}
        readingNow={3}
        recentActivities={[
          { title: "O Alquimista", status: "Finalizado", date: "2 dias atrás" },
          { title: "1984", status: "Adicionado aos favoritos", date: "3 dias atrás" },
          { title: "Sapiens", status: "Iniciado", date: "1 semana atrás" }
        ]}
      />
      <BooksPage />
    </div>
  )
}
