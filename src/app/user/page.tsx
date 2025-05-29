'use client';

import { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut } from 'lucide-react';
import UserSettingsSkeleton from '@/components/loaders/UserSettingsSkeleton';
import ComponentArrowBack from '@/components/ArrowBack';

export default function UserSettings() {
  const { user, loading, signOut } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user]);

  if (loading || !user) return <UserSettingsSkeleton />;

  return (
      <div className='w-full'>
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <ComponentArrowBack />
          <button
            onClick={signOut}
            className="flex items-center text-red-500 hover:text-red-400 transition"
          >
            <LogOut className="w-5 h-5 mr-1" />
            Sair
          </button>
        </div>
        {/* Título */}
        <h1 className="lg:text-3xl md:text-2xl text-lg font-bold mb-4">Minha Conta</h1>
        {/* Cartões de informação */}
        <div className="space-y-4">
          <section className="bg-gray-900 rounded-xl">
            <h2 className="lg:text-2xl md:text-lg text-base font-semibold text-white mb-2">Perfil</h2>
            <p className="text-sm text-gray-400">Usuário:</p>
            <p className="text-base font-medium">{user.username}</p>
            <div className="mt-3">
              <p className="text-sm text-gray-400">Email:</p>
              <p className="text-base font-medium">{user.email}</p>
            </div>
          </section>
          <section className="bg-gray-900 rounded-xl">
            <h2 className="lg:text-2xl md:text-lg text-base font-semibold text-white mb-2">Preferências</h2>
            <div className="flex flex-col gap-2 text-base">
              <div className="flex justify-between">
                <span className="text-gray-400">Tema</span>
                <span className="text-white">Escuro</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Idioma</span>
                <span className="text-white">Português (Brasil)</span>
              </div>
            </div>
          </section>
          {/* Espaço reservado para futuras configurações */}
          <section className="bg-gray-900 rounded-xl">
            <h2 className="lg:text-2xl md:text-lg text-base font-semibold text-white mb-2">Notificações</h2>
            <p className="text-sm text-gray-400">Funcionalidade em desenvolvimento</p>
          </section>
        </div>
      </div>
  );
}