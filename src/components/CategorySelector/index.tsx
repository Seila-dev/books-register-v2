import { Category } from '@/types/categoryData';
import { CreateCategoryModal } from '@/components/CreateCategoryModal';

export default function CategorySelector({ categories }: { categories: Category[] }) {
  return (
    <div className="mb-6">
      <label className="block mb-1 text-sm text-white">Categorias</label>

      {categories.length > 0 ? (
        <select
          name="categoryIds"
          multiple
          className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 text-white p-2 outline-none mb-2"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-sm text-gray-400 mb-2">Nenhuma categoria encontrada.</p>
      )}

      <CreateCategoryModal />
    </div>
  );
}