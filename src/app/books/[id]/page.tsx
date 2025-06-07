import { notFound } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { BookRating } from '@/components/BookRating';
import { Book } from '@/types/bookData';
import { Category } from '@/types/categoryData';
import CategorySelector from '@/components/CategorySelector';
import { CategoriesEditor } from '@/components/CategoryEditor';
import ComponentArrowBack from '@/components/ArrowBack';
import EditBookPage from '@/components/BookEditor';
import api from '@/services/api';
import { Metadata } from 'next';
import BookDetailHero from '@/components/bookDetailedComponents/BookDetailedHero';
import BookExtrasSection from '@/components/bookDetailedComponents/BookExtrasSection';


export async function generateMetadata({ params }: any): Promise<Metadata> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('books-register.token')?.value;

        const res = await api.get(`/books/${params.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const book: Book = res.data;

        return {
            title: `${book.title} | Watchlist`,
            description: `Informações detalhadas sobre o conteúdo "${book.title}" na sua biblioteca.`,
            openGraph: {
                title: `${book.title} | Watchlist`,
                description: `Veja detalhes do conteúdo "${book.title}" no Watchlist.`,
                url: `/books/${params.id}`,
                siteName: 'Watchlist',
                type: 'website',
            }
        };
    } catch (error) {
        return {
            title: 'Conteúdo não encontrado | Watchlist',
            description: 'Não foi possível carregar os dados do conteúdo.',
        };
    }
}

export default async function BookDetailPage({ params }: any) {
    const { id } = params;
    const headersList = await headers();
    const cookie = headersList.get('cookie') ?? '';
    const token = cookie
        .split('; ')
        .find(c => c.startsWith('books-register.token='))
        ?.split('=')[1] ?? '';

    const response = await fetch(`${process.env.API_URL}/books/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
    });

    const responseBooks = await fetch(`${process.env.API_URL}/books`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.log('Erro da API:', response.status, errorText);
        notFound();
    }

    const allBooks: Book[] = await responseBooks.json()

    const book: Book = await response.json();

    function formatDate(dateString?: string | null): string {
        if (!dateString) return 'Não informado';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Data inválida';

        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }



    return (
        <main className='w-full h-screen'>
            <BookDetailHero bookId={book.id} />
            
        </main>
    );
}
