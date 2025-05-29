'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
  size?: number | string;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRate, size = 16 }) => {
  const sizeNumber = typeof size === 'number' ? size : parseInt(size.replace('px', ''));

  return (
    <div className="flex gap-0 md:gap-1 my-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={sizeNumber}
          onClick={() => {
            onRate(star);
          }}
          className={`transition-colors select-none   cursor-pointer ${star <= rating ? 'text-yellow-400 fill-amber-300' : 'text-gray-600 fill-gray-600'
            }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onRate(star);
            }
          }}
        />
      ))}
    </div>
  );
};
