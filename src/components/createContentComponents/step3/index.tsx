import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CreateBookFormData } from '@/types/bookData';

interface Step3DescriptionProps {
  register: UseFormRegister<CreateBookFormData>;
  errors: FieldErrors<CreateBookFormData>;
  watchDescription: string | undefined;
}

export default function Step3Description({ 
  register, 
  errors, 
  watchDescription 
}: Step3DescriptionProps) {
  const characterCount = watchDescription?.length || 0;
  const maxCharacters = 500;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Diga mais sobre</h2>
        <p className="text-gray-400">Compartilhe suas anotações, pensamentos ou ideias (opcional)</p>
      </div>

      <div>
        <label className="block mb-3 text-sm font-semibold text-white">
          Descrição (opcional)
        </label>
        <div className="relative">
          <textarea
            {...register('description')}
            rows={6}
            maxLength={maxCharacters}
            placeholder="O que você gostaria de anotar? Alguma frase especifica ou notas pessoais que você gostaria de relembrar depois..."
            className={`w-full bg-gray-800 border-2 rounded-lg p-4 outline-none text-white resize-none transition-all duration-300
              ${errors.description 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-600 focus:border-blue-500'
              }`}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
            {characterCount}/{maxCharacters}
          </div>
        </div>
        {errors.description && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <span className="material-symbols-outlined text-sm mr-1">error</span>
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
          <h3 className="text-blue-400 font-medium mb-2">O que colocar?</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Sua opinião ou avaliação</li>
            <li>• Frases favoritas ou memoráveis</li>
            <li>• Lembretes</li>
          </ul>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
          <h3 className="text-green-400 font-medium mb-2">Não esqueça:</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• É opcional. Você pode editar isso quando quiser</li>
            <li>• Use da forma que quiser</li>
          </ul>
        </div>
      </div>
    </div>
  );
}