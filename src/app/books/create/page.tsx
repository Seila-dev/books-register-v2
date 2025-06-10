'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Step1Title from '@/components/createContentComponents/step1';
import Step2Image from '@/components/createContentComponents/step2';
import Step3Description from '@/components/createContentComponents/step3';
import Step4Details from '@/components/createContentComponents/step4';
import ConfirmationModal from '@/components/createContentComponents/confirmationModal';
import SuccessModal from '@/components/createContentComponents/successModal';

import { createBookSchema, CreateBookFormData } from '@/types/bookData';
import { Category } from '@/types/categoryData';

import { useBooks } from '@/hooks/useBooks';
import api from '@/services/api';

export default function CreateBookPage() {
  const router = useRouter();
  const { createBook } = useBooks();

  const [categories, setCategories] = useState<Category[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);
  const [isFirstContent, setIsFirstContent] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<CreateBookFormData>({
    resolver: zodResolver(createBookSchema),
    mode: 'onBlur',
  });

  const watchAllFields = watch();

  useEffect(() => {
    fetchCategories();
    checkIfFirstContent();
  }, []);

  useEffect(() => {
    const coverImageFile = watchAllFields.coverImage;
    if (typeof window !== 'undefined' && coverImageFile instanceof File) {
      const url = URL.createObjectURL(coverImageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [watchAllFields.coverImage]);

  const fetchCategories = async () => {
    try {
      const { 'books-register.token': token } = parseCookies();
      const res = await api.get<Category[]>('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      toast.error('Error loading categories');
    }
  };

  const checkIfFirstContent = async () => {
    try {
      const { 'books-register.token': token } = parseCookies();
      const res = await api.get('/books/count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFirstContent(res.data.count === 0);
    } catch (error) {
      // If error, assume it's not first content
      setIsFirstContent(false);
    }
  };

  const nextStep = async () => {
    let isValid = true;

    switch (step) {
      case 1:
        isValid = await trigger('title');
        break;
      case 2:
        isValid = await trigger('coverImage');
        break;
      case 3:
        isValid = await trigger('description');
        break;
      case 4:
        isValid = await trigger(['startDate', 'finishDate', 'categoryIds']);
        break;
    }

    if (isValid && step < 4) {
      setStep(step + 1);
      toast.success('Etapa concluida! ➡️');
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return watchAllFields.title && watchAllFields.title.trim().length > 0;
      case 2:
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  };

  const openConfirmation = () => {
    setIsConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const onSubmit = async (data: CreateBookFormData) => {
    try {
      await createBook(data);
      setIsConfirmationOpen(false);

      toast.success('🎉 Conteúdo adicionado pra sua biblioteca!');

      setTimeout(() => {
        setIsSuccessOpen(true);
      }, 500);

    } catch (err) {
      toast.error('❌ Error creating content');
      console.error('Error creating book:', err);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Step 1 of 4';
      case 2: return 'Step 2 of 4';
      case 3: return 'Step 3 of 4';
      case 4: return 'Step 4 of 4';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 w-full py-8 px-4">
      <div className="max-w-screen-lg w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Add New Content</h1>
          <p className="text-gray-400">{getStepTitle()}</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`flex items-center ${stepNum < 4 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= stepNum
                      ? 'bg-blue-500 text-white shadow-lg scale-110'
                      : 'bg-gray-700 text-gray-400'
                    }`}
                >
                  {step > stepNum ? (
                    <span className="material-symbols-outlined text-sm">check</span>
                  ) : (
                    stepNum
                  )}
                </div>
                {stepNum < 4 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${step > stepNum ? 'bg-blue-500' : 'bg-gray-700'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Title</span>
            <span>Image</span>
            <span>Description</span>
            <span>Details</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
            {/* Formulário */}
            <div className="p-8 w-full lg:w-1/2">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="min-h-[400px]">
                  {step === 1 && <Step1Title register={register} errors={errors} />}
                  {step === 2 && (
                    <Step2Image
                      control={control}
                      errors={errors}
                      previewUrl={previewUrl}
                      setPreviewUrl={setPreviewUrl}
                    />
                  )}
                  {step === 3 && (
                    <Step3Description
                      register={register}
                      errors={errors}
                      watchDescription={watchAllFields.description}
                    />
                  )}
                  {step === 4 && (
                    <Step4Details
                      register={register}
                      control={control}
                      errors={errors}
                      categories={categories}
                      selectedCategoryIds={watchAllFields.categoryIds || []}
                      onCategoryCreated={fetchCategories}
                    />
                  )}
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={step === 1}
                    className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined mr-2">arrow_back</span>
                    Previous
                  </button>

                  <div className="text-center">
                    <p className="text-gray-400 text-sm">{step} of 4 steps completed</p>
                  </div>

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="flex items-center px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next
                      <span className="material-symbols-outlined ml-2">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={openConfirmation}
                      disabled={!canProceed() || isSubmitting}
                      className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined mr-2">preview</span>
                      Review & Save
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Preview */}
            {watchAllFields.title && (
              <div className="p-6 w-full lg:w-1/2 border-t bg-gray-800 lg:border-t-0 lg:border-l">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="material-symbols-outlined mr-2">visibility</span>
                  Live Preview
                </h3>
                <div className="flex gap-4">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-20 h-28 object-cover rounded-lg shadow-md"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg mb-2">
                      {watchAllFields.title}
                    </h4>
                    <p className="text-gray-300 text-sm mb-2">
                      {watchAllFields.description || 'No description yet...'}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>Categories: {(watchAllFields.categoryIds?.length || 0)}</span>
                      <span>
                        Dates:{' '}
                        {watchAllFields.startDate || watchAllFields.finishDate
                          ? '✓'
                          : '○'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* {watchAllFields.title && (
          <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="material-symbols-outlined mr-2">visibility</span>
              Live Preview
            </h3>
            <div className="flex gap-4">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-20 h-28 object-cover rounded-lg shadow-md"
                />
              )}
              <div className="flex-1">
                <h4 className="text-white font-bold text-lg mb-2">
                  {watchAllFields.title}
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  {watchAllFields.description || 'No description yet...'}
                </p>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>
                    Categories: {(watchAllFields.categoryIds?.length || 0)}
                  </span>
                  <span>
                    Dates: {watchAllFields.startDate || watchAllFields.finishDate ? '✓' : '○'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={closeConfirmation}
        onConfirm={handleSubmit(onSubmit)}
        formData={watchAllFields}
        categories={categories}
        previewUrl={previewUrl}
        isSubmitting={isSubmitting}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        isFirstContent={isFirstContent}
        contentTitle={watchAllFields.title || 'Your Content'}
      />
    </div>
  );
}