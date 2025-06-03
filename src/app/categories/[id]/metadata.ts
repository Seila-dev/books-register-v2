// app/categories/[id]/page.tsx
import { Metadata } from 'next';
import api from '@/services/api'; // seu client já configurado com baseURL e token
import { parseCookies } from 'nookies';
import { cookies } from 'next/headers';

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('books-register.token')?.value;
        const res = await api.get(`/categories/${params.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const category = res.data;

        return {
            title: `${category.name} | BooksRegister`,
            description: `Explore os livros, séries e filmes da categoria "${category.name}" no BooksRegister.`,
            openGraph: {
                title: `${category.name} | BooksRegister`,
                description: `Veja o conteúdo salvo na categoria "${category.name}".`,
                url: `/categories/${params.id}`,
                type: 'website',
                siteName: 'BooksRegister',
            },
        };
    } catch (err) {
        return {
            title: 'Categoria não encontrada | BooksRegister',
            description: 'Não foi possível carregar essa categoria.',
        };
    }
}
