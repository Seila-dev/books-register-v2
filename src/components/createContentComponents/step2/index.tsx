import { Controller, Control, FieldErrors } from 'react-hook-form';
import { CreateBookFormData } from '@/types/bookData';
import { toast } from 'sonner';

interface Step2ImageProps {
  control: Control<CreateBookFormData>;
  errors: FieldErrors<CreateBookFormData>;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}

export default function Step2Image({ 
  control, 
  errors, 
  previewUrl, 
  setPreviewUrl 
}: Step2ImageProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Add a cover image</h2>
        <p className="text-gray-400">Make your content visually appealing (optional)</p>
      </div>

      <div>
        <label className="block mb-3 text-sm font-semibold text-white">
          Cover Image
        </label>
        <Controller
          name="coverImage"
          control={control}
          render={({ field }) => (
            <>
              <label
                htmlFor="coverImage"
                className="group relative w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-500 hover:border-blue-500 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:bg-gray-800/50"
              >
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Cover preview"
                      className="object-contain max-h-80 rounded-lg shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gray-700 bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Click to change image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                    <span className="material-symbols-outlined text-6xl mb-4 block">image</span>
                    <p className="text-lg font-medium mb-2">Click to add cover image</p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, WEBP • Max 10MB
                    </p>
                  </div>
                )}
              </label>
              <input
                id="coverImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    const file = files[0];
                    
                    // Validate file size (10MB)
                    if (file.size > 10 * 1024 * 1024) {
                      toast.error('❌ File too large. Max size: 10MB');
                      return;
                    }
                    
                    const url = URL.createObjectURL(file);
                    setPreviewUrl(url);
                    field.onChange(file);
                    toast.success('📸 Cover image selected!');
                  }
                }}
              />
            </>
          )}
        />
        {errors.coverImage && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <span className="material-symbols-outlined text-sm mr-1">error</span>
            {String(errors.coverImage.message)}
          </p>
        )}
      </div>

      {previewUrl && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              setPreviewUrl(null);
              const fileInput = document.getElementById('coverImage') as HTMLInputElement;
              if (fileInput) fileInput.value = '';
              toast('🗑️ Image removed');
            }}
            className="text-red-400 hover:text-red-300 text-sm flex items-center transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-sm mr-1">delete</span>
            Remove image
          </button>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
        <h3 className="text-green-400 font-medium mb-1">Opcional</h3>
        <p className="text-gray-300 text-sm">
          Você pode pular essa etapa e adicionar a imagem depois
        </p>
      </div>
    </div>
  );
}