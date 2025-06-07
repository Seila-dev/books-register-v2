'use client';

import { useState } from 'react';
import {
    BookOpen,
    Share2,
    Heart,
    Clock,
    Check,
    Star,
    MessageCircle,
} from 'lucide-react';
import { Book } from '@/types/bookData';
import { useRouter } from 'next/navigation';
import { useBooks } from '@/hooks/useBooks'; // Ajuste o path se necessário

interface BookActionButtonsProps {
    book: Book;
}

export function BookActionButtons({ book: initialBook }: BookActionButtonsProps) {
    const router = useRouter();
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [book, setBook] = useState<Book>(initialBook);

    const {
        markAsRead,
        toggleFavorite,
    } = useBooks();

    const [localLoading, setLocalLoading] = useState({
        markAsRead: false,
        favorite: false,
    });

    const handleMarkAsRead = async () => {
        setLocalLoading(prev => ({ ...prev, markAsRead: true }));
        try {
            const updated = await markAsRead({ book });
            console.log(updated);
            setBook(updated)
        } catch (error) {
            console.error('Erro ao marcar como lido/não lido', error);
        } finally {
            setLocalLoading(prev => ({ ...prev, markAsRead: false }));
        }
    };

    const handleToggleFavorite = async () => {
        setLocalLoading(prev => ({ ...prev, favorite: true }));
        try {
            const updated = await toggleFavorite({ book });
            setBook(updated); // atualiza visualmente
        } catch (error) {
            console.error('Erro ao favoritar', error);
        } finally {
            setLocalLoading(prev => ({ ...prev, favorite: false }));
        }
    };

    const handleShare = (platform?: string) => {
        const url = window.location.href;
        const text = `Confira este livro: ${book.title}`;

        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(url);
            alert('Link copiado para a área de transferência!');
        } else {
            if (navigator.share) {
                navigator.share({ title: book.title, text, url });
            } else {
                setShowShareMenu(!showShareMenu);
            }
        }
    };

    return (
        <div className="flex flex-wrap gap-4 mb-6">
            {/* Marcar como Lido */}
            <button
                onClick={handleMarkAsRead}
                disabled={localLoading.markAsRead}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer w-full sm:w-fit text-xs sm:text-base ${book.finishDate ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                    } ${localLoading.markAsRead ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {localLoading.markAsRead ? (
                    <Clock size={18} className="animate-spin" />
                ) : book.finishDate ? (
                    <Check size={18} />
                ) : (
                    <BookOpen size={18} />
                )}
                {book.finishDate ? 'Finalizado' : 'Marcar como Finalizado'}
            </button>

            {/* Favoritar */}
            <button
                onClick={handleToggleFavorite}
                disabled={localLoading.favorite}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 cursor-pointer w-full sm:w-fit text-xs sm:text-base ${book.isFavorite
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    } ${localLoading.favorite ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {localLoading.favorite ? (
                    <Clock size={18} className="animate-spin" />
                ) : (
                    <Heart size={18} fill={book.isFavorite ? 'currentColor' : 'none'} />
                )}
                {book.isFavorite ? 'Remover dos Favoritos' : 'Favoritar'}
            </button>

            {/* Compartilhar */}
            <div className="relative">
                <button
                    onClick={() => handleShare()}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-200 text-xs sm:text-base"
                >
                    <Share2 size={18} />
                    Compartilhar
                </button>

                {showShareMenu && (
                    <div className="absolute top-full mt-2 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50 min-w-48">
                        <button onClick={() => handleShare('whatsapp')} className="w-full px-4 py-3 text-left hover:bg-gray-800 rounded-t-lg">WhatsApp</button>
                        <button onClick={() => handleShare('twitter')} className="w-full px-4 py-3 text-left hover:bg-gray-800">Twitter</button>
                        <button onClick={() => handleShare('copy')} className="w-full px-4 py-3 text-left hover:bg-gray-800 rounded-b-lg">Copiar Link</button>
                    </div>
                )}
            </div>
        </div>
    );
}
