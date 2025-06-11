import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CreateBookFormData } from '@/types/bookData';
import { Lightbulb } from 'lucide-react';
import InfoBox from '@/components/ui/InfoBox';

interface Step1TitleProps {
  register: UseFormRegister<CreateBookFormData>;
  errors: FieldErrors<CreateBookFormData>;
}

export default function Step1Title({ register, errors }: Step1TitleProps) {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Qual o título?</h2>
        <p className="text-gray-400">Escreva como quer chamar título do seu conteúdo</p>
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold text-white">
          Título *
        </label>
        <input
          type="text"
          {...register('title')}
          className={`w-full bg-transparent border-b-2 p-3 outline-none text-white text-lg transition-all duration-300
            ${errors.title 
              ? 'border-red-500 focus:border-red-400' 
              : 'border-gray-600 focus:border-blue-500'
            }`}
          placeholder="Ex: Homem aranha, Senhor dos áneis, Attack on Titan..."
          autoFocus
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <span className="material-symbols-outlined text-sm mr-1">error</span>
            {errors.title.message}
          </p>
        )}
      </div>

      <InfoBox
        title="Dica"
        icon={<Lightbulb className="text-yellow-400" />}
        borderColorClass="border-blue-500"
        titleColorClass="text-blue-400"
      >
        <p>Escolha um titulo decente, isso ajuda a encontrar o conteudo depois.</p>
      </InfoBox>
    </div>
  );
}