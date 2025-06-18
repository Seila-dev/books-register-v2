import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Book } from '@/types/bookData';
import { Metadata } from 'next';
import BookDetailHero from '@/components/bookDetailedComponents/BookDetailedHero';

export async function generateMetadata({ params }: any): Promise<Metadata> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('books-register.token')?.value;
        
        if (!token) {
            console.log('Token não encontrado, retornando metadata padrão');
            return {
                title: 'Conteúdo não encontrado',
                description: 'Não foi possível carregar os dados do conteúdo.',
            };
        }

        const apiUrl = process.env.API_URL || 'https://books-register-api-production.up.railway.app';
        
        const response = await fetch(`${apiUrl}/books/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Erro na API:', response.status, errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const book: Book = await response.json();

        return {
            title: `${book.title}`,
            description: `Informações detalhadas sobre o conteúdo "${book.title}" na sua biblioteca.`,
            openGraph: {
                title: `${book.title}`,
                description: `Veja detalhes do conteúdo "${book.title}" no Watchlist.`,
                url: `/books/${params.id}`,
                siteName: 'Watchlist',
                type: 'website',
            }
        };
    } catch (error) {
        console.error('Erro no generateMetadata:', error);
        return {
            title: 'Conteúdo não encontrado',
            description: 'Não foi possível carregar os dados do conteúdo.',
        };
    }
}

export default async function BookDetailPage({ params }: any) {
    const { id } = params;

    const cookieStore = await cookies();
    const token = cookieStore.get('books-register.token')?.value;

    if (!token) {
        notFound();
    }

    const response = await fetch(`${process.env.API_URL}/books/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.log('Erro da API:', response.status, errorText);
        notFound();
    }

    const book: Book = await response.json();

    return (
        <main className='w-full h-screen'>
            <BookDetailHero bookId={book.id} />     
        </main>
    );
}