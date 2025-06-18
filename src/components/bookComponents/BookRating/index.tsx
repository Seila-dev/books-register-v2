'use client';

import { StarRating } from '@/components/StarRating';
import { useBooks } from '@/hooks/books/useBooks';

interface BookRatingProps {
  bookId: string;
  initialRating: number;
  size?: number | string;
}

export const BookRating = ({ bookId, initialRating, size }: BookRatingProps) => {
  const { updateBookRating, books } = useBooks();
  const bookToUpdate = books.find((b) => b.id === bookId);
  const currentRating = bookToUpdate?.rating ?? initialRating;

  const handleRatingChange = async (newRating: number) => {
    if (!bookToUpdate) return;

    const originalRating = bookToUpdate.rating;
    bookToUpdate.rating = newRating;

    try {
      await updateBookRating({ bookId, rating: newRating });
    } catch (error) {
      bookToUpdate.rating = originalRating;
    }
  };

  return (
    <StarRating rating={currentRating} onRate={handleRatingChange} size={size} />
  );
};
