"use client"

import BooksPage from "@/components/BooksPage";
import { Header } from "@/components/Header";
import DashboardPanel from "@/components/Painel";
import DashboardIntro from "@/components/Painel";
import TopCategories from "@/components/TopCategories";
import { AuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import { useContext } from "react";

export default function Home() {
  const  { user } = useContext(AuthContext)
  return (
    <div className="w-full max-w-screen-xl p-6">
      <DashboardPanel
        userName={user?.username}
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
      <TopCategories />
    </div>
  )
}
