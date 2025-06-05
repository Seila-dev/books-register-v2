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
import { ArrowRight, Plus, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBooks } from "@/hooks/useBooks";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import BooksCarousel from "@/components/BooksCarousel";
import Link from "next/link";

export default function Home() {
  const { user } = useContext(AuthContext)
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
      {/* <BooksPage /> */}
      <BooksCarousel books={books} />
      <TopCategories />

      <Link
        href={`/books/create`}
        className={`
            fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl 
            bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
            border-0 transition-all duration-300 ease-out z-20 flex justify-center items-center
          `}
      >
        <Plus className={`h-6 w-6 transition-transform duration-300`} />
      </Link>
    </div>
  )
}
