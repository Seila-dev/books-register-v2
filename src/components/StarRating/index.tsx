'use client';

import React from 'react';

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRate }) => {
  return (
    <div className="flex gap-0 md:gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onRate(star)}
          className={`text-xl sm:text-2xl md:text-3xl select-none transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-500'
            } cursor-pointer`}
          role="button"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onRate(star);
            }
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};
