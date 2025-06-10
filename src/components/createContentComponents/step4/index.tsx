import { Controller, Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { CreateBookFormData } from '@/types/bookData';
import { Category } from '@/types/categoryData';
import CategorySelector from '@/components/CategorySelector';

interface Step4DetailsProps {
  register: UseFormRegister<CreateBookFormData>;
  control: Control<CreateBookFormData>;
  errors: FieldErrors<CreateBookFormData>;
  categories: Category[];
  selectedCategoryIds: string[];
  onCategoryCreated: () => void;
}

export default function Step4Details({ 
  register, 
  control, 
  errors,
  categories,
  selectedCategoryIds,
  onCategoryCreated
}: Step4DetailsProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Final details</h2>
        <p className="text-gray-400">Add categories and reading dates (all optional)</p>
      </div>

      {/* Categories Section */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-white">
          Categories
        </label>
        
        {/* Selected Categories Display */}
        {selectedCategoryIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategoryIds
              .map((id) => categories.find((c) => c.id === id))
              .filter(Boolean)
              .map((cat) => (
                <span
                  key={cat!.id}
                  className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-medium flex items-center shadow-sm"
                >
                  {cat!.name}
                  <span className="material-symbols-outlined ml-1 text-sm">check_circle</span>
                </span>
              ))}
          </div>
        )}

        <Controller
          control={control}
          name="categoryIds"
          render={({ field }) => (
            <CategorySelector
              categories={categories}
              selectedCategoryIds={field.value || []}
              onChange={field.onChange}
              onCategoryCreated={onCategoryCreated}
            />
          )}
        />
        
        <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-500">
          <h3 className="text-purple-400 font-medium mb-1">🏷️ Categories help you:</h3>
          <p className="text-gray-300 text-sm">
            Organize your library, find similar content, and track your reading habits across different genres.
          </p>
        </div>
      </div>

      {/* Reading Dates Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Reading Timeline</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-white">
              Started reading
            </label>
            <input
              type="date"
              {...register('startDate')}
              className={`w-full bg-gray-800 border-2 rounded-lg p-3 outline-none text-white transition-all duration-300
                ${errors.startDate 
                  ? 'border-red-500 focus:border-red-400' 
                  : 'border-gray-600 focus:border-blue-500'
                }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-white">
              Finished reading
            </label>
            <input
              type="date"
              {...register('finishDate')}
              className={`w-full bg-gray-800 border-2 rounded-lg p-3 outline-none text-white transition-all duration-300
                ${errors.finishDate 
                  ? 'border-red-500 focus:border-red-400' 
                  : 'border-gray-600 focus:border-blue-500'
                }`}
            />
            {errors.finishDate && (
              <p className="text-red-500 text-sm mt-1">{errors.finishDate.message}</p>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
          <h3 className="text-orange-400 font-medium mb-1">📅 Reading dates help you:</h3>
          <p className="text-gray-300 text-sm">
            Track your reading progress, see how long books take you, and remember when you discovered great content.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 border border-gray-600">
        <h3 className="text-white font-medium mb-2 flex items-center">
          <span className="material-symbols-outlined mr-2">info</span>
          Almost done!
        </h3>
        <p className="text-gray-300 text-sm">
          All fields on this step are optional. You can always add or update this information later from your library.
        </p>
      </div>
    </div>
  );
}