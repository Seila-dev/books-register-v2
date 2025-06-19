import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientAuthProvider from "@/contexts/ClientAuthProvider";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  min-h-screen w-full`}
      >
        <ClientAuthProvider>
          <Providers>
            <Toaster />
            <div>{children}</div>
          </Providers>
        </ClientAuthProvider>
      </body>
    </html>
  );
}
