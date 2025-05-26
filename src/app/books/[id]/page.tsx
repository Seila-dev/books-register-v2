import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Book } from '@/types/bookData';
import { Star, Clock, Calendar, ArrowLeft, BookOpen, Tag, Edit, Trash2 } from 'lucide-react';
import { StarRating } from '@/components/StarRating';
import { useBooks } from '@/contexts/useBooks';
import { BookRating } from '@/components/BookRating';
import { Metadata, ResolvingMetadata } from 'next';

type PageParams = {
  params: {
    id: string;
  };
};

export default async function BookDetailPage({ params }: PageParams) {
    const { id } = params

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

    if (!response.ok) {
        const errorText = await response.text();
        console.log('Erro da API:', response.status, errorText);
        notFound();
    }

    const book = await response.json();

    function formatDate(dateString: string) {
        if (!dateString) return 'Não informado';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Função para determinar status de leitura
    function getReadingStatus(startDate: Date, finishDate: Date) {
        if (!startDate) return { text: 'Não iniciado', color: 'bg-gray-600' };
        if (!finishDate) return { text: 'Em andamento', color: 'bg-blue-600' };
        return { text: 'Concluído', color: 'bg-green-600' };
    }

    const readingStatus = getReadingStatus(book.startDate, book.finishDate);

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-12">
            {/* Hero Section with Banner */}
            {/* <div
                className="w-full h-64 bg-cover bg-center relative"
                style={{
                    backgroundImage: book.coverImage ?
                        `linear-gradient(to bottom, rgba(17, 24, 39, 0.2), rgba(17, 24, 39, 0.95)), url(${book.coverImage})` :
                        'linear-gradient(to right, #111827, #1f2937)'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent"></div>
            </div> */}

            {/* Main Content */}
            <div className="max-w-screen-xl mx-auto lg:py-8 md:py-0">

                {/* Mobile: botão sobre a imagem da capa */}
                <div className="sm:hidden relative">
                    <div className="absolute top-4 left-4 z-10">
                        <Link
                            href="/"
                            className="inline-flex items-center text-white bg-gray-900 bg-opacity-80 backdrop-blur-sm p-2 rounded-lg"
                        >
                            <ArrowLeft size={18} className="" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column - Cover & Actions */}
                    <div className="md:col-span-4">
                        <div className="sticky top-8 space-y-6">

                            {/* Desktop: botão fora da imagem */}
                            <div className="hidden sm:block">
                                <Link
                                    href="/"
                                    className="inline-flex items-center text-gray-300 hover:text-white transition-colors bg-gray-900 bg-opacity-80 backdrop-blur-sm p-2 rounded-lg"
                                >
                                    <ArrowLeft size={18} className="mr:0" />
                                </Link>
                            </div>

                            <div className="relative bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl">
                                {book.coverImage ? (
                                    <>
                                        <img
                                            src={book.coverImage}
                                            alt={`Capa de ${book.title}`}
                                            className="w-full aspect-[2/3] object-cover"
                                        />
                                        {/* Degradê na parte inferior da imagem */}
                                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950/90 via-gray-950/60 to-transparent pointer-events-none" />
                                    </>
                                ) : (
                                    <div className="w-full aspect-[2/3] flex items-center justify-center bg-gray-800 text-gray-500">
                                        <BookOpen size={64} />
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button className="w-full bg-purple-700 hover:bg-purple-600 transition-colors py-3 px-4 rounded-lg font-medium flex items-center justify-center">
                                    <Edit size={18} className="mr-2" />
                                    Editar Livro
                                </button>
                                <button className="w-full bg-gray-800 hover:bg-gray-700 transition-colors py-3 px-4 rounded-lg font-medium text-gray-300 hover:text-white flex items-center justify-center">
                                    <Trash2 size={18} className="mr-2" />
                                    Remover Livro
                                </button>
                            </div>

                            {/* Reading Status */}
                            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                                <h3 className="text-lg font-medium mb-3">Status de Leitura</h3>
                                <div className="space-y-3">
                                    <div className={`${readingStatus.color} text-white text-center py-2 px-4 rounded-md font-medium`}>
                                        {readingStatus.text}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="bg-gray-800 p-3 rounded-md">
                                            <div className="text-gray-400 flex items-center mb-1">
                                                <Calendar size={14} className="mr-1" /> Início
                                            </div>
                                            <div className="font-medium">{formatDate(book.startDate)}</div>
                                        </div>
                                        <div className="bg-gray-800 p-3 rounded-md">
                                            <div className="text-gray-400 flex items-center mb-1">
                                                <Calendar size={14} className="mr-1" /> Fim
                                            </div>
                                            <div className="font-medium">{formatDate(book.finishDate)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="md:col-span-8">
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg">
                            {/* Title and Rating */}
                            <div className="border-b border-gray-800 pb-4 mb-4">
                                <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                                {book.author && (
                                    <p className="text-xl text-gray-400 mb-4">{book.author}</p>
                                )}
                                {book.rating != null && (
                                    <BookRating bookId={book.id} initialRating={book.rating} />
                                )}
                            </div>

                            {/* Main Details */}
                            <div className="space-y-6">
                                {/* Description */}
                                {book.description && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-3">Sinopse</h2>
                                        <p className="leading-relaxed text-gray-300">{book.description}</p>
                                    </div>
                                )}

                                {/* Book Info */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {book.publisher && (
                                        <div className="bg-gray-800 p-4 rounded-lg">
                                            <h3 className="text-gray-400 text-sm mb-1">Editora</h3>
                                            <p className="font-medium">{book.publisher}</p>
                                        </div>
                                    )}
                                    {book.publicationYear && (
                                        <div className="bg-gray-800 p-4 rounded-lg">
                                            <h3 className="text-gray-400 text-sm mb-1">Ano de Publicação</h3>
                                            <p className="font-medium">{book.publicationYear}</p>
                                        </div>
                                    )}
                                    {book.pageCount && (
                                        <div className="bg-gray-800 p-4 rounded-lg">
                                            <h3 className="text-gray-400 text-sm mb-1">Páginas</h3>
                                            <p className="font-medium">{book.pageCount}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Categories */}
                                {/* {book.categories?.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3">Categorias</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {book.categories.map((cat) => (
                                                <span
                                                    key={cat.id}
                                                    className="bg-gray-800 hover:bg-gray-700 transition-colors px-3 py-1 rounded-full border border-gray-700 flex items-center"
                                                >
                                                    <Tag size={12} className="mr-1" />
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )} */}

                                {/* Notes/Review Section */}
                                {book.notes && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3">Minhas Anotações</h3>
                                        <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-purple-600">
                                            <p className="italic text-gray-300">{book.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Metadata Footer */}
                        <div className="mt-6 text-xs text-gray-500 flex justify-between">
                            <span>ID: {book.id}</span>
                            <span>
                                Adicionado em: {formatDate(book.createdAt)} | Atualizado em: {formatDate(book.updatedAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}