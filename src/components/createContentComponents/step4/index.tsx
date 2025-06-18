import { Controller, Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { CreateBookFormData } from '@/types/bookData';
import { Category } from '@/types/categoryData';
import CategorySelector from '@/components/categoryActions/CategorySelector';


import { UseFormWatch } from 'react-hook-form';
import InfoBox from '@/components/ui/InfoBox';

interface Step4DetailsProps {
  register: UseFormRegister<CreateBookFormData>
  control: Control<CreateBookFormData>
  errors: FieldErrors<CreateBookFormData>
  watch: UseFormWatch<CreateBookFormData>
  categories: Category[]
  selectedCategoryIds: string[]
  onCategoryCreated: () => void
}

export default function Step4Details({
  register,
  control,
  errors,
  categories,
  watch,
  selectedCategoryIds,
  onCategoryCreated
}: Step4DetailsProps) {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Detalhes finais</h2>
        <p className="text-gray-400">Adicione categorias e o progresso (todos opcionais)</p>
      </div>

      {/* Categories Section */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-white">
          Categorias
        </label>

        {/* Selected Categories Display */}
        <div className="flex flex-wrap w-full gap-2 mb-4">
          {(watch('categoryIds') || [])
            .map((id) => categories.find((c) => c.id === id))
            .filter(Boolean)
            .map((cat) => (
              <span
                key={cat!.id}
                className="bg-white flex items-center text-gray-800 text-sm px-4 py-2 rounded-lg font-medium border border-gray-300 shadow-sm cursor-pointer"
              >
                {cat!.name}
              </span>
            ))}
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
        </div>
      </div>

      {/* Reading Dates Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white mb-4">Progresso</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-xs font-semibold text-white">
              Começou a obra
            </label>
            <input
              type="date"
              {...register('startDate')}
              className={`w-full border-2 cursor-pointer rounded-lg p-3 outline-none text-gray-400 transition-all duration-300
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
            <label className="block mb-2 text-xs font-semibold text-white">
              Finalizou a obra
            </label>
            <input
              type="date"
              {...register('finishDate')}
              className={`w-full cursor-pointer border-2 rounded-lg p-3 outline-none text-gray-400 transition-all duration-300
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


        <InfoBox
          title="Opcional"
          borderColorClass='border-green-500'
          titleColorClass='text-green-500'
        >
          <p>Todos os campos são opcionais. </p>
          <p>Você pode atualizar essas informações depois.</p>
        </InfoBox>
      </div>
    </div>
  );
}