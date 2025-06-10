import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  isOpen: boolean;
  isFirstContent: boolean;
  contentTitle: string;
}

export default function SuccessModal({ 
  isOpen, 
  isFirstContent, 
  contentTitle 
}: SuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoHome = () => {
    router.push('/');
  };

  const handleCreateAnother = () => {
    router.push('/books/create');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-center">
          <div className="text-6xl mb-4">
            {isFirstContent ? '🎉' : '✨'}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {isFirstContent ? 'Congratulations!' : 'Success!'}
          </h3>
          <p className="text-white/90">
            {isFirstContent 
              ? 'You created your first content!' 
              : 'Content added successfully!'
            }
          </p>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">"{contentTitle}"</h4>
            <p className="text-gray-300 text-sm">
              has been added to your library
            </p>
          </div>

          {isFirstContent && (
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2 flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">lightbulb</span>
                Your reading journey begins!
              </h4>
              <p className="text-gray-300 text-sm">
                Start building your personal library and track your reading progress. 
                You can always edit or add more details later.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center font-medium"
            >
              <span className="material-symbols-outlined mr-2">home</span>
              View My Library
            </button>
            
            <button
              onClick={handleCreateAnother}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center font-medium"
            >
              <span className="material-symbols-outlined mr-2">add_circle</span>
              Add Another Content
            </button>
          </div>

          {/* Stats or tips for first-time users */}
          {isFirstContent && (
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-xs">
                💡 Tip: You can organize your content with categories, add reading dates, 
                and keep personal notes to make your library truly yours!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}