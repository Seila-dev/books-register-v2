import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
    title: {
        default: 'Watchlist',
        template: '%s | Watchlist',
    },
    description: 'Salve, organize e acompanhe seus livros, filmes e séries em um só lugar!',
    keywords: ['livros', 'séries', 'filmes', 'biblioteca pessoal', 'Watch list'],
    metadataBase: new URL('https://books-register-v2.vercel.app/'),
    openGraph: {
        title: 'Watchlist',
        description: 'Sua estante digital para livros, filmes e séries. Organize sua jornada de entretenimento!',
        url: 'https://books-register-v2.vercel.app/',
        siteName: 'Watchlist',
        images: [
            {
                url: '/og-booksregister.png',
                width: 1200,
                height: 630,
                alt: 'Watchlist - Biblioteca Digital',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Watchlist',
        description: 'Sua estante digital para livros, filmes e séries. Organize sua jornada de entretenimento!',
        images: ['/og-booksregister.png'],
    },
};

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <Header />
            <div className="text-white flex flex-col items-center min-h-full justify-center m-auto gap-8 transation duration-200 w-full">{children}</div>
        </div>
    );
}
