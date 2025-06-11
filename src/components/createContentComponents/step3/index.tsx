import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CreateBookFormData } from '@/types/bookData';
import { Lightbulb } from 'lucide-react';
import OptionalInfoBox from '@/components/ui/InfoBox';
import InfoBox from '@/components/ui/InfoBox';

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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Diga mais sobre</h2>
        <p className="text-gray-400">Compartilhe suas anotações, pensamentos ou ideias (opcional)</p>
      </div>

      <div>
        <label className="block mb-3 text-sm font-semibold text-white">
          Descrição
        </label>
        <div className="relative">
          <textarea
            {...register('description')}
            rows={6}
            maxLength={maxCharacters}
            placeholder="O que você gostaria de anotar? Alguma frase especifica ou notas pessoais que você gostaria de relembrar depois..."
            className={`w-full  border-2 rounded-lg p-4 outline-none text-white resize-none transition-all duration-300
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
        <InfoBox
          title="Dica"
          icon={<Lightbulb className="text-yellow-400" />}
          borderColorClass="border-blue-500"
          titleColorClass="text-blue-400"
        >
          <p>Escreva algo que queira lembrar, ou algo que te marcou sobre esse conteúdo</p>
        </InfoBox>

        <InfoBox
          title="Opcional"
          borderColorClass='border-green-500'
          titleColorClass='text-green-500'>
          <p>Opcional, você pode atualizar a descrição o quando quiser</p>
        </InfoBox>
      </div>
    </div>
  );
}