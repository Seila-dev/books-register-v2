"use client";

import { useState } from "react";
import { Category } from "@/types/categoryData";
import { CreateCategoryModal } from "../CreateCategoryModal";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter()

  const toggleCategory = (id: string) => {
    const newSelected = tempSelected.includes(id)
      ? tempSelected.filter((catId) => catId !== id)
      : [...tempSelected, id];
    setTempSelected(newSelected);
  };

  const handleConfirm = () => {
    onChange?.(tempSelected);
    setIsOpen(false);
    // router.refresh()
  };

  const openModal = () => {
    setTempSelected(selectedCategoryIds);
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        // className="px-4 py-1.5 text-white bg-gray-700 hover:bg-gray-800 cursor-pointer rounded-md transition flex items-center gap-1 text-xs w-fit"
        className="bg-gray-700 hover:bg-gray-800 flex items-center text-white text-sm gap-1 transition px-4 py-2 rounded-lg font-medium cursor-pointer"
      >
        <Plus size={14} />
        Adicionar
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-[#1a1a1a] text-white w-full max-w-md rounded-lg shadow-lg flex flex-col max-h-[80vh]">
            
            {/* Header fixo */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 sticky top-0 bg-[#1a1a1a] z-10">
              <h2 className="text-lg font-semibold">Selecionar Categorias</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scroll da lista de categorias */}
            <div className="overflow-y-auto px-4 py-3 space-y-2 flex-1">
                            {/* Modal de criação dentro da área scrollável */}
              <div className="pb-2 w-full">
                <CreateCategoryModal />
              </div>
              {categories.map((cat) => {
                const isSelected = tempSelected.includes(cat.id);
                return (
                  <button
                    type="button"
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
            </div>

            {/* Rodapé fixo */}
            <div className="border-t border-gray-700 px-4 py-3 flex justify-end gap-2 sticky bottom-0 bg-[#1a1a1a]">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm border border-gray-500 text-gray-300 rounded-md hover:bg-[#2a2a2a] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
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
