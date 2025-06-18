"use client"

import { useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { Plus } from "lucide-react"

import BooksPage from "@/components/BooksPage"
import DashboardPanel from "@/components/Painel"
import TopCategories from "@/components/TopCategories"
import PainelHeader from "@/components/PainelHeader"
import WelcomeModal from "@/components/StarterModal"

import { AuthContext } from "@/contexts/AuthContext"
import { useBooks } from "@/hooks/books/useBooks"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import AllBooksCarrousel from "@/components/carousel/AllBooks"

export default function Home() {
  const { user } = useContext(AuthContext)
  const { books, isLoading } = useBooks()
  const router = useRouter()

  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [hasCheckedWelcome, setHasCheckedWelcome] = useState(false)

  const isMobile = useMediaQuery("(max-width: 450px)")

  // Verifica se deve mostrar o modal de boas-vindas
  useEffect(() => {
    if (!isLoading && !hasCheckedWelcome && user) {
      const hasSeenWelcome = localStorage.getItem(`welcome-seen-${user.id}`)
      const isNewUser = books.length === 0
      
      if (!hasSeenWelcome && isNewUser) {
        // Pequeno delay para melhor experiência
        setTimeout(() => {
          setShowWelcomeModal(true)
        }, 500)
      }
      setHasCheckedWelcome(true)
    }
  }, [isLoading, books.length, user, hasCheckedWelcome])

  const handleCloseWelcome = () => {
    setShowWelcomeModal(false)
    if (user) {
      localStorage.setItem(`welcome-seen-${user.id}`, 'true')
    }
  }

  const handleCreateFirstBook = () => {
    handleCloseWelcome()
    router.push('/books/create')
  }

  const handleExploreWebsite = () => {
    handleCloseWelcome()
    // Scroll suave para o conteúdo principal
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    })
  }

  const recentBooks = [...books]
    .map(book => {
      const activityDate = book.finishDate || book.startDate || book.createdAt;
      return { ...book, activityDate };
    })
    .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime())
    .slice(0, 3);

  const recentActivities = recentBooks.map(book => ({
    title: book.title,
    status: book.finishDate ? "Finalizado" : book.startDate ? "Iniciado" : "Adicionado",
    date: formatDistanceToNow(new Date(book.finishDate || book.startDate || book.createdAt), {
      addSuffix: true,
      locale: ptBR,
    }),
    book: book
  }));

  // if (error) router.push('/login')

  return (
    <>
      {/* Modal de boas-vindas */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleCloseWelcome}
        onCreateBook={handleCreateFirstBook}
        onExplore={handleExploreWebsite}
        userName={user?.username}
      />

      {/* Overlay para dimmer quando modal está aberto */}
      <div className={`
        w-full px-4 py-8 transition-all duration-300
        ${showWelcomeModal ? 'filter blur-sm pointer-events-none' : ''}
      `}>
        <PainelHeader />
        
        {/* Conteúdo principal */}
        {!isLoading && (
          <>
            {isMobile ? (
              <BooksPage />
            ) : (
              <AllBooksCarrousel allBooks={books} />
            )}
            
            {/* Seções comentadas - descomente conforme necessário */}
            {/* <FavoriteBooksCarousel allBooks={books} />
            <ReadBooksCarousel allBooks={books} />
            <RatingBooksSection books={books}/> */}
            
            <DashboardPanel
              userName={user?.username}
              recentActivities={recentActivities}
            />
            
            <TopCategories />
          </>
        )}

        {isLoading && (
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
       
        <Link
          href={`/books/create`}
          className={`
            fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl 
            bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
            border-0 transition-all duration-300 ease-out z-20 flex justify-center items-center
            ${showWelcomeModal ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
        >
          <Plus className={`h-6 w-6 transition-transform duration-300`} />
        </Link>
      </div>
    </>
  )
}