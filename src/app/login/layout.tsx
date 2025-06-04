import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Login',
    description: 'Acesse sua estante digital para livros, filmes e séries com sua conta Watchlist.',
    keywords: ['login', 'Watchlist', 'autenticação', 'livros', 'séries', 'filmes'],
    openGraph: {
      title: 'Login | Watchlist',
      description: 'Entre para acessar sua estante digital e acompanhar sua jornada de entretenimento.',
      url: 'https://books-register-v2.vercel.app/login',
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
      title: 'Login | Watchlist',
      description: 'Entre para acessar sua estante digital e acompanhar sua jornada de entretenimento.',
      images: ['/og-booksregister.png'],
    },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}