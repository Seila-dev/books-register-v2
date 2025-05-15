'use client';

import { BooksComponent } from '../BooksComponent';
import { useBooks } from '../../contexts/useBooks';
import { Header } from '../Header';
// import { useCategories } from '../../contexts/CategoriesContext';

export const Home = () => {
//   const { loading: booksLoading } = useBooks();
//   const { loading: categoriesLoading } = useCategories();

//   if (booksLoading || categoriesLoading) {
//     return <p className="text-black">Carregando...</p>;
//   }


//   if (booksLoading) {
//     return <p className="text-black">Carregando...</p>;
//   }

  return (
    <div className="max-w-screen-xl mx-auto p-5 bg-gray-900 text-white flex flex-col items-center min-h-full h-screen">
      <Header />
      <BooksComponent />
    </div>
  );
};
