// StarRating.tsx

'use client';

import React from 'react';

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
  size?: number | string; // novo
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRate, size = '1.75rem' }) => {
  const fontSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div className="flex gap-0 md:gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onRate(star)}
          className={`select-none transition-colors cursor-pointer ${
            star <= rating ? 'text-yellow-400' : 'text-gray-500'
          }`}
          style={{ fontSize }}
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
