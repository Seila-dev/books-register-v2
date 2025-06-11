import { Controller, Control, FieldErrors } from 'react-hook-form';
import { CreateBookFormData } from '@/types/bookData';
import { toast } from 'sonner';
import { Image } from 'lucide-react';

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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Adicione uma capa</h2>
        <p className="text-gray-400">Faça seu conteúdo ser mais atraente (optional)</p>
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
                className="group relative w-fit flex flex-col items-center justify-center border-2  border-gray-500 hover:border-blue-500 rounded-xl p-1 md:px-4 md:py-1 cursor-pointer transition-all duration-300 hover:bg-gray-800/50 md:text-sm text-xs"
              >
                {previewUrl ? (
                  <div className="relative p-2 ">
                    <div className="inset-0 group-hover:bg-opacity-20 rounded-lg  transition-all duration-300 flex items-center justify-center w-full">
                      <span className="text-gray-300 flex items-center gap-2 duration-300 w-full">
                        <Image size={16} />
                        Clique aqui para alterar a imagem
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 group-hover:text-blue-400 transition-colors duration-300 p-4">
                    <span className="material-symbols-outlined text-6xl mb-4 block">image</span>
                    <p className="text-lg font-medium mb-2">Clique para adicionar uma capa</p>
                    <p className="text-sm text-gray-500">
                      Suporta: JPG, PNG, WEBP • Max 10MB
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
                      toast.error('❌ Arquivo grande demais! Tamanho max: 10MB');
                      return;
                    }
                    
                    const url = URL.createObjectURL(file);
                    setPreviewUrl(url);
                    field.onChange(file);
                    toast.success('📸 Imagem de capa selecionada!');
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
        <div className="flex ">
          <button
            type="button"
            onClick={() => {
              setPreviewUrl(null);
              const fileInput = document.getElementById('coverImage') as HTMLInputElement;
              if (fileInput) fileInput.value = '';
              toast('🗑️ Imagem removida');
            }}
            className="text-red-100 hover:text-red-300 md:text-sm text-xs flex items-center transition-colors duration-200 bg-red-600 rounded-md py-2 px-4 w-fit cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm mr-1">delete</span>
            Remover capa
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