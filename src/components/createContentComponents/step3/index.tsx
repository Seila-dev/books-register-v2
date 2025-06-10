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
        <h2 className="text-2xl font-bold text-white mb-2">Tell us about it</h2>
        <p className="text-gray-400">Share your thoughts, notes, or a brief summary (optional)</p>
      </div>

      <div>
        <label className="block mb-3 text-sm font-semibold text-white">
          Description
        </label>
        <div className="relative">
          <textarea
            {...register('description')}
            rows={6}
            maxLength={maxCharacters}
            placeholder="What did you think about it? Any memorable quotes, key takeaways, or personal notes you'd like to remember..."
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
          <h3 className="text-blue-400 font-medium mb-2">💭 Ideas to include:</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Your personal rating or opinion</li>
            <li>• Favorite quotes or passages</li>
            <li>• Key lessons learned</li>
            <li>• Memorable characters or scenes</li>
          </ul>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
          <h3 className="text-green-400 font-medium mb-2">✨ Remember:</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• This is completely optional</li>
            <li>• You can edit this anytime</li>
            <li>• Keep it personal and meaningful</li>
            <li>• There's no right or wrong way</li>
          </ul>
        </div>
      </div>

      {characterCount > 0 && (
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <h4 className="text-white font-medium mb-2">Preview:</h4>
          <p className="text-gray-300 text-sm italic">
            "{watchDescription?.substring(0, 100)}{watchDescription && watchDescription.length > 100 ? '...' : ''}"
          </p>
        </div>
      )}
    </div>
  );
}