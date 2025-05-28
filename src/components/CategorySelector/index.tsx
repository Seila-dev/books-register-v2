"use client";

import { useState } from "react";
import { Category } from "@/types/categoryData";
import { CreateCategoryModal } from "../CreateCategoryModal";
import { X } from "lucide-react";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryIds?: string[];
  onChange?: (ids: string[]) => void;
}

export default function CategorySelector({
  categories,
  selectedCategoryIds = [],
  onChange,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(selectedCategoryIds);

  const toggleCategory = (id: string) => {
    const newSelected = tempSelected.includes(id)
      ? tempSelected.filter((catId) => catId !== id)
      : [...tempSelected, id];
    setTempSelected(newSelected);
  };

  const handleConfirm = () => {
    onChange?.(tempSelected);
    setIsOpen(false);
  };

  const openModal = () => {
    setTempSelected(selectedCategoryIds);
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
      >
        Selecionar Categorias
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-[#1a1a1a] text-white w-full max-w-md rounded-lg shadow-lg flex flex-col max-h-[80vh]">
            
            {/* Header fixo */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 sticky top-0 bg-[#1a1a1a] z-10">
              <h2 className="text-lg font-semibold">Selecionar Categorias</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scroll da lista de categorias */}
            <div className="overflow-y-auto px-4 py-3 space-y-2 flex-1">
              {categories.map((cat) => {
                const isSelected = tempSelected.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition border cursor-pointer
                      ${
                        isSelected
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-[#2a2a2a] border-[#444] text-gray-300 hover:bg-[#333]"
                      }`}
                  >
                    {cat.name}
                  </button>
                );
              })}

              {/* Modal de criação dentro da área scrollável */}
              <div className="pt-2">
                <CreateCategoryModal />
              </div>
            </div>

            {/* Rodapé fixo */}
            <div className="border-t border-gray-700 px-4 py-3 flex justify-end gap-2 sticky bottom-0 bg-[#1a1a1a]">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm border border-gray-500 text-gray-300 rounded-md hover:bg-[#2a2a2a] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-md"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
