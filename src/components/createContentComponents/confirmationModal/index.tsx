import { CreateBookFormData } from '@/types/bookData';
import { Category } from '@/types/categoryData';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: CreateBookFormData;
  categories: Category[];
  previewUrl: string | null;
  isSubmitting: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  formData,
  categories,
  previewUrl,
  isSubmitting
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const selectedCategories = (formData.categoryIds || [])
    .map(id => categories.find(c => c.id === id))
    .filter(Boolean)
    .map(cat => cat!.name);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-2xl text-blue-400 mr-3">
                preview
              </span>
              <h3 className="text-2xl font-bold text-white">Review your content</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <p className="text-gray-400 mt-2">Make sure everything looks good before saving</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title and Image */}
          <div className="flex flex-col md:flex-row gap-6">
            {previewUrl && (
              <div className="flex-shrink-0">
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  className="w-32 h-48 object-cover rounded-lg shadow-lg mx-auto md:mx-0"
                />
              </div>
            )}
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  Title
                </h4>
                <p className="text-xl font-bold text-white">{formData.title}</p>
              </div>
              
              {formData.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    Description
                  </h4>
                  <p className="text-gray-300 leading-relaxed">{formData.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reading Dates */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center">
                <span className="material-symbols-outlined text-sm mr-2">schedule</span>
                Reading Timeline
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Started:</span>
                  <span className="text-white font-medium">{formatDate(formData.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Finished:</span>
                  <span className="text-white font-medium">{formatDate(formData.finishDate)}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center">
                <span className="material-symbols-outlined text-sm mr-2">local_offer</span>
                Categories
              </h4>
              {selectedCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((categoryName, index) => (
                    <span
                      key={index}
                      className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-medium"
                    >
                      {categoryName}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No categories selected</p>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/20">
            <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
              <span className="material-symbols-outlined mr-2">summarize</span>
              Content Summary
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{formData.title ? '✓' : '✗'}</p>
                <p className="text-xs text-gray-400">Title</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{previewUrl ? '✓' : '○'}</p>
                <p className="text-xs text-gray-400">Cover Image</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{formData.description ? '✓' : '○'}</p>
                <p className="text-xs text-gray-400">Description</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{selectedCategories.length}</p>
                <p className="text-xs text-gray-400">Categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 rounded-b-xl">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <span className="flex items-center">
                <span className="material-symbols-outlined mr-2 text-sm">edit</span>
                Edit
              </span>
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined mr-2 text-sm animate-spin">refresh</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined mr-2 text-sm">check_circle</span>
                  Confirm & Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}