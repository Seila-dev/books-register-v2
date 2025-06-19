"use client"

import React, { useState, useEffect } from 'react';
import { Play, Star, Users, Shield, Smartphone, ChevronDown, Menu, X, Check, Clock, Heart, Zap, Database, Palette, Settings, ArrowRight, Eye, Film, Book, Gamepad2, Tv, MonitorPlay } from 'lucide-react';
import Link from 'next/link';

export default function WatchlistLanding() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [activeTestimonial, setActiveTestimonial] = useState<number>(0);
    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
    const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


    const testimonials = [
        {
            name: "Ana Silva",
            role: "Cinéfila e Otaku",
            initial: "AS",
            color: "bg-purple-500",
            text: "Finalmente encontrei uma plataforma que organiza todos os meus conteúdos! Desde animes até filmes clássicos, tudo em um só lugar com minhas anotações personalizadas."
        },
        {
            name: "Carlos Santos",
            role: "Crítico de Cinema",
            initial: "CS",
            color: "bg-blue-500",
            text: "A diferença é impressionante. Antes perdia tempo procurando onde havia parado uma série. Agora tenho controle total do meu progresso e descobertas."
        },
        {
            name: "Maria Oliveira",
            role: "Leitora de Mangás",
            initial: "MO",
            color: "bg-green-500",
            text: "Super fácil de usar e o design é incrível. Consegui organizar minha lista de mangás e animes em menos de 30 minutos!"
        },
        {
            name: "Pedro Costa",
            role: "Gamer e Streamer",
            initial: "PC",
            color: "bg-orange-500",
            text: "O sistema de categorias personalizadas é perfeito. Posso separar conteúdo por humor, gênero ou até por plataforma. Revolucionou minha organização!"
        }
    ];

    const features = [
        {
            icon: <Database className="w-6 h-6" />,
            title: "Biblioteca Completa",
            description: "Armazene filmes, séries, animes, mangás, jogos e qualquer tipo de conteúdo multimídia em um só lugar."
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Controle de Progresso",
            description: "Acompanhe seu progresso de consumo com timers personalizados e marcos de evolução."
        },
        {
            icon: <Palette className="w-6 h-6" />,
            title: "Categorias Personalizadas",
            description: "Crie suas próprias categorias e tags para organizar conteúdos do seu jeito único."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Segurança Total",
            description: "Seus dados são protegidos com criptografia avançada e backups automáticos seguros."
        },
        {
            icon: <Settings className="w-6 h-6" />,
            title: "Interface Intuitiva",
            description: "Design limpo e funcional que funciona perfeitamente em qualquer dispositivo."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Sincronização Rápida",
            description: "Acesse sua biblioteca instantaneamente em qualquer lugar com sincronização em tempo real."
        }
    ];

    const contentTypes = [
        { icon: <Film className="w-8 h-8" />, name: "Filmes", count: "15K+" },
        { icon: <Tv className="w-8 h-8" />, name: "Séries", count: "8K+" },
        { icon: <MonitorPlay className="w-8 h-8" />, name: "Animes", count: "12K+" },
        { icon: <Book className="w-8 h-8" />, name: "Mangás", count: "20K+" },
        { icon: <Gamepad2 className="w-8 h-8" />, name: "Jogos", count: "5K+" },
        { icon: <Star className="w-8 h-8" />, name: "Outros", count: "3K+" }
    ];

    const faqs = [
        {
            question: "Preciso pagar para usar?",
            answer: "Oferecemos um plano gratuito generoso com até 100 itens. Para coleções maiores, temos planos premium acessíveis a partir de R$ 9,90/mês."
        },
        {
            question: "Meus dados ficam seguros?",
            answer: "Absolutamente! Utilizamos criptografia de ponta e seus dados são armazenados em servidores seguros com backup automático diário."
        },
        {
            question: "É realmente compatível com todos os tipos de conteúdo?",
            answer: "Sim! Nossa plataforma suporta filmes, séries, animes, mangás, jogos, livros, podcasts e qualquer tipo de mídia que você queira organizar."
        },
        {
            question: "Posso editar depois de adicionar?",
            answer: "Claro! Você pode editar qualquer informação, adicionar notas, alterar categorias e atualizar seu progresso a qualquer momento."
        },
        {
            question: "Preciso fazer login sempre?",
            answer: "Não! Oferecemos opção de login automático e modo offline para que você acesse sua biblioteca quando quiser."
        },
        {
            question: "Quantos conteúdos posso adicionar?",
            answer: "No plano gratuito são 100 itens. Nos planos premium você tem limite ilimitado para sua coleção crescer sem restrições."
        },
        {
            question: "Funciona no celular?",
            answer: "Perfeitamente! Nossa interface é responsiva e oferecemos apps nativos para iOS e Android em breve."
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 text-white">
            {/* Header */}
            <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
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

      {/* Navegação desktop */}
      <nav className="hidden md:flex space-x-6">
        <a href="#features" className="text-gray-300 hover:text-white hover:underline underline-offset-4">Recursos</a>
        <a href="#testimonials" className="text-gray-400 hover:text-white hover:underline underline-offset-4">Depoimentos</a>
        <a href="#faq" className="text-gray-400 hover:text-white hover:underline underline-offset-4">FAQ</a>
      </nav>

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
<section className="w-full min-h-screen bg-transparent px-6 relative flex flex-wrap justify-center items-center overflow-hidden ">
  {/* Luz branca central suave */}
  <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
    <div className="w-[600px] h-[600px] bg-purple-600 opacity-25 blur-[150px] rounded-full" />
  </div>

  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
    {/* Texto principal */}
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Organize sua <span className="text-purple-500">biblioteca multimídia</span> em minutos
        </h1>
        <p className="text-lg text-gray-400">
          Gerencie filmes, séries, animes, mangás e jogos de forma fácil. Adicione capas, anotações e acompanhe seu progresso com segurança.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href='/login' className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md text-base font-medium transition-all cursor-pointer">
          Começar Agora
        </Link>
        <button className="border border-gray-500 text-gray-300 hover:border-purple-500 hover:text-blue-500 px-6 py-3 rounded-md text-base font-medium transition-all">
          Ver Demonstração
        </button>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          Cadastro rápido
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          Grátis para começar
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          100% seguro
        </div>
      </div>
    </div>

    {/* Imagem principal */}
    <div className="relative w-full">
      {/* Desktop Image */}
      <div className="rounded-lg overflow-hidden shadow-md">
        <img
          src="/desktop-lp.webp"
          alt="Preview da plataforma (desktop)"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Mobile Image Overlay */}
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

            {/* Content Types Section */}
            <section className="py-16 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Todos os tipos de conteúdo em um só lugar</h2>
                        <p className="text-xl text-gray-400">Organize qualquer tipo de mídia que você consome</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {contentTypes.map((type, index) => (
                            <div key={index} className="bg-slate-800 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
                                <div className="text-purple-600 flex justify-center mb-4 group-hover:scale-110 transition-transform">
                                    {type.icon}
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                                <p className="text-2xl font-bold text-purple-600">{type.count}</p>
                                <p className="text-sm text-gray-500 mt-1">usuários ativos</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Por que escolher o Watchlist?</h2>
                        <p className="text-xl text-gray-600">Recursos pensados para transformar sua experiência com conteúdo multimídia</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <div className="text-white">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl text-white font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-16 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Como estão nossos usuários</h2>
                        <p className="text-xl text-gray-400">Pessoas reais que <span className="text-purple-400 font-semibold">transformaram</span> sua organização de conteúdo</p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="bg-slate-800 rounded-3xl p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-shrink-0">
                                    <div className={`w-20 h-20 ${testimonials[activeTestimonial].color} rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
                                        {testimonials[activeTestimonial].initial}
                                    </div>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                                        "{testimonials[activeTestimonial].text}"
                                    </p>
                                    <div>
                                        <p className="font-bold text-lg">{testimonials[activeTestimonial].name}</p>
                                        <p className="text-gray-600">{testimonials[activeTestimonial].role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-8 space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeTestimonial
                                        ? 'bg-purple-600 scale-125'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ATS Section */}
            <section className="py-16 bg-transparent  text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">
                                O que são as tendências de consumo e por que você precisa se preocupar com isso?
                            </h2>
                            <p className="text-xl mb-6 text-purple-100">
                                Algoritmos de plataformas de streaming são complexos e mudam constantemente.
                                Mais de 90% dos usuários perdem conteúdos interessantes porque não conseguem
                                organizar adequadamente suas descobertas e interesses.
                            </p>
                            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                                <p className="text-lg">
                                    <strong className="text-white">A boa notícia:</strong> O Watchlist já organiza
                                    100% dos seus conteúdos de forma inteligente, garantindo que você nunca mais
                                    perca uma descoberta interessante.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                            <h3 className="text-2xl font-bold mb-6 text-center">Sistemas de organização mais utilizados</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span>Listas mentais</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-white/20 rounded-full h-2">
                                            <div className="bg-red-400 h-2 rounded-full w-4/5"></div>
                                        </div>
                                        <span className="text-red-300 font-semibold">Perdido</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Notas no celular</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-white/20 rounded-full h-2">
                                            <div className="bg-yellow-400 h-2 rounded-full w-2/5"></div>
                                        </div>
                                        <span className="text-yellow-300 font-semibold">Talvez</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Watchlist</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-white/20 rounded-full h-2">
                                            <div className="bg-green-400 h-2 rounded-full w-full"></div>
                                        </div>
                                        <span className="text-green-300 font-semibold">Organizado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16 bg-slate-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Perguntas frequentes</h2>
                        <p className="text-xl text-gray-600">
                            Encontre respostas para as principais dúvidas sobre nossa plataforma e como ela pode
                            <span className="text-purple-600 font-semibold"> transformar</span> sua organização de conteúdo
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <button
                                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 text-black cursor-pointer transition-colors"
                                    onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                                >
                                    <span className="font-semibold text-lg">{faq.question}</span>
                                    <ChevronDown className={`w-5 h-5 transition-transform ${activeQuestion === index ? 'rotate-180' : ''}`} />
                                </button>
                                {activeQuestion === index && (
                                    <div className="px-6 pb-6">
                                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-800 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Experimente nossos recursos
                    </h2>
                    <p className="text-xl mb-8 text-purple-100">
                        Recursos profissionais <span className="text-white font-semibold">testados e aprovados</span> por milhares de usuários
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-purple-800 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                            Começar Gratuitamente
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:border-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2">
                            Ver Demonstração
                            <Play className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-white mb-2">100K+</div>
                            <div className="text-purple-200">Conteúdos organizados</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-2">25K+</div>
                            <div className="text-purple-200">Usuários ativos</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                            <div className="text-purple-200">Uptime garantido</div>
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