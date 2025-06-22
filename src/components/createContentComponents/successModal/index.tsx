import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isFirstContent: boolean;
  contentTitle: string;
  onCreateAnother?: () => void
}

export default function SuccessModal({ 
  isOpen, 
  setIsOpen,
  isFirstContent, 
  contentTitle,
  onCreateAnother 
}: SuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoHome = () => {
    router.push('/home');
  };

  const createAnotherContent = () => {
    onCreateAnother?.();
    setIsOpen(false) 
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-center">
          <div className="text-6xl mb-4">
            {isFirstContent ? '🎉' : '✨'}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {isFirstContent ? 'Parabéns!' : 'Sucesso!'}
          </h3>
          <p className="text-white/90">
            {isFirstContent 
              ? 'Você criou seu primeiro conteúdo!' 
              : 'Conteúdo adicionado com sucesso!'
            }
          </p>
        </div>

        <div className="p-6 text-center space-y-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">"{contentTitle}"</h4>
            <p className="text-gray-300 text-sm">
              foi adicionado à sua biblioteca.
            </p>
          </div>

          {isFirstContent && (
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2 flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">lightbulb</span>
                Sua jornada de conteúdos começa aqui!
              </h4>
              <p className="text-gray-300 text-sm">
                Comece construindo sua biblioteca com livros, filmes, séries e muito mais. 
                Você pode sempre adicionar mais conteúdos depois,
                então sinta-se à vontade para explorar e adicionar o que mais gosta!
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2">home</span>
              Ver na minha biblioteca
            </button>
            
            <button
              onClick={createAnotherContent}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2">add_circle</span>
              Adicionar outro conteúdo
            </button>
          </div>

          {isFirstContent && (
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-xs">
                💡 Tip: Você pode organizar seus conteúdos com categorias, adicionar diferentes anotações com o tempo, e customizar cada conteúdo seu da forma que quiser para criar seu próprio ambiente de filmes, séries, livros, mangás e mais!  !
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}