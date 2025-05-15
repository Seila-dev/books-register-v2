'use client';

import { useState } from 'react';
// import { BookForm } from '../bookform';
import { Books } from '@/components/Books';

export const BooksComponent = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="flex flex-col items-center w-full rounded-md text-white bg-gray-900 px-6 py-8 shadow-inner">
      <header className="w-full flex justify-between items-start mb-8 gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold md:text-2xl text-blue-400">Minha Biblioteca</h1>
          <p className="text-gray-300 text-base md:text-sm">Gerencie seus livros de forma simples e eficiente.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 text-white text-sm md:text-xs bg-blue-600 hover:bg-blue-700 rounded-md shadow-md"
          >
            Adicionar
          </button>
        </div>
      </header>

      {openModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleOpenModal}
          />
          <div className="z-50">
            {/* <BookForm /> */}
          </div>
        </>
      )}

      <Books />
    </div>
  );
};
