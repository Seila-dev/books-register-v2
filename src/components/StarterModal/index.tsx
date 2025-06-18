import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Sparkles, X, Users, TrendingUp, Heart } from 'lucide-react';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateBook: () => void;
    onExplore: () => void;
    userName?: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
    isOpen,
    onClose,
    onCreateBook,
    onExplore,
    userName = "Usuário"
}) => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const steps = [
        {
            title: `Bem-vindo, ${userName}! 📚`,
            subtitle: "Sua jornada de filmes, séries e livros começa aqui",
            description: "Organize seus livros, filmes, mangás, todo tipo de conteúdo! Acompanhe seu progresso e descubra novas histórias incríveis.",
            icon: <BookOpen className="w-16 h-16 text-blue-400" />,
            gradient: "from-blue-800 via-indigo-800 to-slate-800"
        },
        {
            title: "Crie sua primeira biblioteca 🌟",
            subtitle: "Comece adicionando seus conteúdos favoritos",
            description: "Adicione filmes, séries que você já assistiu, está assistindo ou pretende assistir. Organize tudo em um só lugar!",
            icon: <Plus className="w-16 h-16 text-cyan-400" />,
            gradient: "from-cyan-700 via-blue-800 to-indigo-800"
        },
        {
            title: "Descubra a melhor forma de acompanhar seus conteúdos",
            subtitle: "Tudo que você precisa para guardar seus conteúdos de forma segura, rápida e organizada",
            description: "Avalie conteúdos, adicione anotações, categorias, acompanhe seu progresso e muito mais! Faça um teste.",
            icon: <Sparkles className="w-16 h-16 text-purple-400" />,
            gradient: "from-purple-700 via-indigo-800 to-blue-900"
        }
    ];

    useEffect(() => {
        if (isOpen && currentStep < steps.length - 1) {
            const timer = setTimeout(() => {
                setIsAnimating(true);
                setTimeout(() => {
                    setCurrentStep(prev => prev + 1);
                    setIsAnimating(false);
                }, 500);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, currentStep, steps.length]);

    if (!isOpen) return null;

    const currentStepData = steps[currentStep];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90"/>

            <div className={`
                relative w-full max-w-2xl mx-auto transform transition-all duration-700 ease-out
                ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}
            `}>
                <div className="relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-lg">
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentStepData.gradient} opacity-20 animate-gradient-shift`} />

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 transition-all duration-200 group cursor-pointer"
                    >
                        <X className="w-5 h-5 text-slate-300 group-hover:text-white" />
                    </button>

                    <div className="relative p-8 md:p-12 text-center text-white">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                {currentStepData.icon}
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-3 animate-fade-in">
                            {currentStepData.title}
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 mb-4 animate-fade-in-delay">
                            {currentStepData.subtitle}
                        </p>

                        <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed animate-fade-in-delay-2">
                            {currentStepData.description}
                        </p>

                        <div className="flex justify-center space-x-2 mb-8">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`
                                        w-2 h-2 rounded-full transition-all duration-300
                                        ${index === currentStep ? 'bg-blue-400 w-8' : 'bg-slate-600'}
                                    `}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-slate-800/70 rounded-2xl">
                            <div className="text-center">
                                <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">5+</div>
                                <div className="text-xs text-slate-400">Usuários</div>
                            </div>
                            <div className="text-center">
                                <BookOpen className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">50+</div>
                                <div className="text-xs text-slate-400">Conteúdos</div>
                            </div>
                            <div className="text-center">
                                <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">97%</div>
                                <div className="text-xs text-slate-400">Satisfação</div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
                            <button
                                onClick={onCreateBook}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Criar meu primeiro livro</span>
                            </button>

                            <button
                                onClick={onExplore}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-100 rounded hover:bg-slate-600 transition-colors cursor-pointer"
                            >
                                <TrendingUp className="w-4 h-4" />
                                <span>Explorar o site</span>
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 mt-6">
                            Você pode pular esta introdução a qualquer momento
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;