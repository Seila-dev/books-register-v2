"use client";

import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function WelcomeModal() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const router = useRouter()

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("welcomeModalDismissed");
    if (!hasSeenModal) setShowModal(true);
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("welcomeModalDismissed", "true");
    }
    setShowModal(false);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <div
            onClick={handleClose} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-screen-md shadow-2xl relative mx-4"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-700 dark:hover:text-white"
              aria-label="Fechar modal"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-4">Comece sua jornada agora!</h2>

            <p className="mb-3 text-zinc-600 dark:text-zinc-300">
              Bem-vindo ao <strong>Watchlist</strong>, {user?.username.split(" ")[0]}!
            </p>

            <ul className="list-disc pl-6 text-sm text-zinc-600 dark:text-zinc-300 space-y-1 mb-6">
              <li>Adicione seu primeiro conteúdo favorito</li>
              <li>Organize por categorias e progresso</li>
              <li>Revise, anote e compartilhe com seus amigos</li>
            </ul>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <label className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={() => setDontShowAgain(!dontShowAgain)}
                  className="accent-blue-600 w-4 h-4"
                />
                Não mostrar novamente
              </label>

              <div className="flex gap-2 flex-wrap justify-end">
                <button
                  onClick={() => (window.location.href = "/explorar")}
                  className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Explorar exemplos
                </button>
                <button
                  onClick={() => router.push("/books/create")}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Adicionar Conteúdo Agora
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
