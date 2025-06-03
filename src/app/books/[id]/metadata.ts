// app/categories/[id]/page.tsx
import { Metadata } from 'next';
import api from '@/services/api'; // seu client já configurado com baseURL e token
import { parseCookies } from 'nookies';
import { Book } from '@/types/bookData';
import { cookies } from 'next/headers';

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
            title: `${book.title} | BooksRegister`,
            description: `Informações detalhadas sobre o  "${book.title}" no BooksRegister.`,
            openGraph: {
                title: `${book.title} | BooksRegister`,
                description: `Veja o conteúdo salvo no no conteúdo "${book.title}".`,
                url: `/books/${params.id}`,
                type: 'website',
                siteName: 'BooksRegister',
            },
        };
    } catch (err) {
        return {
            title: 'Conteúdo não encontrado | BooksRegister',
            description: 'Não foi possível carregar esse conteúdo.',
        };
    }
}
