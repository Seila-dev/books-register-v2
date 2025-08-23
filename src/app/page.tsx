"use client"

import React, { useState, useEffect } from 'react';
import { Users, Smartphone, Menu, X, Check, Heart,  Eye } from 'lucide-react';
import Link from 'next/link';

export default function WatchlistLanding() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 text-white">
            {/* Header */}
            <header
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                        ? 'bg-slate-900/80 backdrop-blur-md shadow-sm'
                        : 'bg-transparent'
                    }`}
            >
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo / Marca */}
                        <div className="flex items-center space-x-3">

                            <span className="text-2xl font-bold text-white tracking-tight">
                                Watchlist<span className="text-blue-500">.</span>
                            </span>
                        </div>

                        {/* Botões desktop */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href='/login' className="text-gray-300 hover:text-blue-400 transition">Entrar</Link>
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md shadow-md transition-transform hover:scale-105 cursor-pointer">
                                Demo
                            </button>
                        </div>

                        {/* Botão mobile */}
                        <button className="md:hidden text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Menu Mobile */}
                {isMenuOpen && (
                    <div className="md:hidden bg-slate-800 border-t border-slate-700">
                        <div className="px-4 py-6 space-y-4">
                            <a href="#features" className="block text-gray-200 hover:text-white">Recursos</a>
                            <a href="#testimonials" className="block text-gray-200 hover:text-white">Depoimentos</a>
                            <a href="#faq" className="block text-gray-200 hover:text-white">FAQ</a>
                            <div className="pt-4 border-t border-slate-700 space-y-2">
                                <button className="block w-full text-left text-gray-200">Entrar</button>
                                <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition cursor-pointer">
                                    Demo
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="w-full min-h-screen bg-transparent px-6 relative flex flex-wrap justify-center items-center overflow-hidden mt-16 md:mt-0">
  <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
    <div className="w-[600px] h-[600px] bg-purple-600 opacity-25 blur-[150px] rounded-full" />
  </div>

  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
    {/* Texto principal */}
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Explore e organize <span className="text-purple-500">tudo que você ama</span> em um só lugar
        </h1>
        <p className="text-lg text-gray-400">
          Esta versão do Watchlist está sendo descontinuada, mas permanece online como demonstração. Um novo projeto com a mesma proposta está sendo desenvolvido por uma nova equipe, com foco em experiência do usuário, comunidade e acessibilidade.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href='/login' className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md text-base font-medium transition-all cursor-pointer">
          Continuar mesmo assim
        </Link>
        <a href="https://your-watchlist.vercel.app/" target="_blank" className="border border-gray-500 text-gray-300 hover:border-purple-500 hover:text-blue-500 px-6 py-3 rounded-md text-base font-medium transition-all">
          Novo projeto (em construção)
        </a>
      </div>

      <div className="mt-2">
        <span className="text-sm text-gray-500">
          Nova versão em desenvolvimento com a mesma essência e objetivos renovados.
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-4">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          Projeto ativo (desde junho/2025)
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          +6 devs & 2 designers envolvidos
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          Código aberto no GitHub
        </div>
      </div>
    </div>

    {/* Imagem principal */}
    <div className="relative w-full">
      <div className="rounded-lg overflow-hidden shadow-md">
        <img
          src="/desktop-lp.webp"
          alt="Preview da plataforma (desktop)"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="block absolute -right-5 bottom-0 overflow-hidden max-w-[30%] shadow-lg">
        <img
          src="/mobile-lp.webp"
          alt="Preview da versão mobile"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  </div>
</section>




            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                        {/* Logo e descrição */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold">Watchlist</span>
                            </div>
                            <p className="text-gray-400 mb-6 max-w-md">
                                A plataforma definitiva para organizar e acompanhar todo seu conteúdo multimídia.
                                Simples, seguro e eficiente.
                            </p>
                            <div className="flex space-x-4">
                                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* Coluna 2: Produto */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Produto</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">App Mobile</a></li>
                            </ul>
                        </div>

                        {/* Coluna 3: Empresa */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Empresa</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Linha inferior */}
                    <div className="mt-12 border-t border-gray-700 pt-6 text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-center">
                        <p>&copy; {new Date().getFullYear()} Watchlist. Todos os direitos reservados.</p>
                        <div className="flex space-x-4 mt-4 sm:mt-0">
                            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
                            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}