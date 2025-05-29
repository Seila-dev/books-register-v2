import BooksPage from "@/components/BooksPage";
import { Header } from "@/components/Header";
import DashboardPanel from "@/components/Painel";
import DashboardIntro from "@/components/Painel";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full">
      <DashboardPanel
        userName="Erick"
        booksRead={4}
        monthlyGoal={10}
        currentStreak={3}
        readingNow={1}
        recentActivities={[
          { title: "Blue Lock", status: "Finalizado", date: "2 dias atrás" },
          { title: "Bungou Stray Dogs", status: "Adicionado aos favoritos", date: "3 dias atrás" },
          { title: "Re zero", status: "Iniciado", date: "1 semana atrás" }
        ]}
      />
      <BooksPage />
    </div>
  )
}
