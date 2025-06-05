"use client"

import BooksPage from "@/components/BooksPage";
import { Header } from "@/components/Header";
import NotesPage from "@/app/notes/page";
import DashboardPanel from "@/components/Painel";
import DashboardIntro from "@/components/Painel";
import TopCategories from "@/components/TopCategories";
import { AuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import { useContext } from "react";
import NoteCard from "@/components/NoteCard";
import { useNotes } from "@/hooks/useNotes";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBooks } from "@/hooks/useBooks";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Home() {
  const  { user } = useContext(AuthContext)
  const { books } = useBooks()
  const { deleteNote, isDeleting, notes } = useNotes()
  const router = useRouter()

    const recentBooks = [...books]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 3)

  const recentActivities = recentBooks.map(book => ({
  title: book.title,
  status: book.finishDate ? "Finalizado" : book.startDate ? "Iniciado" : "Adicionado",
  date: formatDistanceToNow(new Date(book.createdAt), { addSuffix: true, locale: ptBR }),
}))
  return (
    <div className="w-full max-w-screen-xl p-6">
      <DashboardPanel
        userName={user?.username}
        booksRead={4}
        monthlyGoal={10}
        currentStreak={3}
        readingNow={1}
        recentActivities={recentActivities}
      />
      <BooksPage />
      <TopCategories />
    </div>
  )
}
