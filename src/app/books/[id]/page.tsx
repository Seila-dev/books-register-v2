import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { BookRating } from '@/components/BookRating';
import { Book } from '@/types/bookData';
import { Category } from '@/types/categoryData';
import CategorySelector from '@/components/CategorySelector';
import { CategoriesEditor } from '@/components/CategoryEditor';

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

    if (!response.ok) {
        const errorText = await response.text();
        console.log('Erro da API:', response.status, errorText);
        notFound();
    }

    const book: Book = await response.json();

    console.log(book.categories)


    console.log(JSON.stringify(book, null, 2));

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
        <div className="min-h-screen bg-gradient-to-b from-bg-gray-800 to-black text-gray-900 px-4  md:py-15">
            <div className="max-w-4xl mx-auto flex pt-6 pb-2">
                <Link href="/" className="inline-flex items-center text-white hover:text-blue-400 transition duration-100">
                    <ArrowLeft size={18} className="mr-2" />
                    Voltar
                </Link>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start pt-4">
                <div className="flex flex-col items-center w-full md:w-1/3">
                    <div className="w-48 h-64 rounded-xl overflow-hidden shadow-lg mb-4">
                        {book.coverImage ? (
                            <img
                                src={book.coverImage}
                                alt={`Capa de ${book.title}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-white">
                                <BookOpen size={48} />
                            </div>
                        )}
                    </div>

                    {book.rating != null && (
                        <div className="mb-3 scale-110">
                            <BookRating bookId={book.id} initialRating={book.rating} size={32} />
                        </div>
                    )}

                </div>

                <div className="flex-1 text-center md:text-left text-white w-full">
                    <h1 className="text-3xl font-bold mb-2 text-white">{book.title}</h1>

                    {book.description && (
                        <p className="text-gray-100 text-base leading-relaxed mb-6">
                            {book.description}
                        </p>
                    )}

                    <p className="text-sm text-gray-300 mb-8">
                        {formatDate(book.startDate)} - {formatDate(book.finishDate)}
                    </p>

                    <div className='flex flex-col items-start'>
                        <h3 className="text-lg font-semibold text-white">Categorias</h3>
                        <div className="flex gap-2 mt-4 flex-wrap">
                            {(book.categories || []).map((cat) => (
                                <span
                                    key={cat.categoryId}
                                    className="bg-white flex items-center text-gray-800 text-sm px-4 py-2 rounded-lg font-medium border border-gray-300 shadow-sm cursor-pointer"
                                >
                                    {cat.category.name}
                                </span>
                            ))}

 <CategoriesEditor book={book} />
                            
                        </div>
                    </div>


                   



                    <div className="mt-10 text-xs text-gray-400 flex flex-col md:flex-row md:justify-between gap-1">
                        <span>ID: {book.id}</span>
                        <span>
                            Adicionado em: {formatDate(book.createdAt)} | Atualizado em: {formatDate(book.updatedAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
