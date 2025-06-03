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
    default: 'BooksRegister',
    template: '%s | BooksRegister',
  },
  description: 'Salve, organize e acompanhe seus livros, filmes e séries em um só lugar!',
  keywords: ['livros', 'séries', 'filmes', 'biblioteca pessoal', 'books register'],
  metadataBase: new URL('https://books-register-v2.vercel.app/'),
  openGraph: {
    title: 'BooksRegister',
    description: 'Sua estante digital para livros, filmes e séries. Organize sua jornada de entretenimento!',
    url: 'https://books-register-v2.vercel.app/',
    siteName: 'BooksRegister',
    images: [
      {
        url: '/og-booksregister.png',
        width: 1200,
        height: 630,
        alt: 'BooksRegister - Biblioteca Digital',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BooksRegister',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900  min-h-screen w-full`}
      >
        <ClientAuthProvider>
          <Providers>
            <Header />
            <Toaster />
            <div className="bg-gray-900 text-white flex flex-col items-center min-h-full w-full p-4 max-w-screen-xl justify-center m-auto gap-8 transation duration-200">{children}</div>
          </Providers>
        </ClientAuthProvider>
      </body>
    </html>
  );
}
