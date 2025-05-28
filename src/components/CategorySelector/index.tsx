"use client"

import { Category } from "@/types/categoryData";
import { CreateCategoryModal } from "../CreateCategoryModal";

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
  const toggleCategory = (id: string) => {
    const newSelected = selectedCategoryIds.includes(id)
      ? selectedCategoryIds.filter((catId) => catId !== id)
      : [...selectedCategoryIds, id];
    onChange?.(newSelected);
  };

  console.log('Categories received:', categories);

  return (
    <div className="flex flex-col items-start mb-6">
      <h3 className="text-lg font-semibold text-white">Categorias</h3>
      <div className="flex gap-2 mt-4 flex-wrap">
        {categories.map((cat) => {
          const isSelected = selectedCategoryIds.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`flex items-center text-sm px-4 py-2 rounded-lg font-medium shadow-sm cursor-pointer select-none
                ${
                  isSelected
                    ? 'bg-gray-200 border-gray-400 text-gray-800 '
                    : 'bg-gray-500 opacity-50 text-white'
                }`}
            >
              {cat.name}
            </button>
          );
        })}
        <CreateCategoryModal />
      </div>
    </div>
  );
}