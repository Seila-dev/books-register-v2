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
  title: "Books Register v2",
  description: "Save your favorite books on a secure and beautiful place.",
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
