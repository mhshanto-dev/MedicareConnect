'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

export function StarRating({ value = 0, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const readonly = !onChange;

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const starSize = sizes[size] || sizes.md;
  const activeIndex = hovered || value;

  return (
    <div className={`flex items-center gap-0.5 ${readonly ? '' : 'cursor-pointer'}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-transform ${readonly ? 'cursor-default' : 'hover:scale-110 focus:outline-none'}`}
        >
          <Star
            className={`${starSize} transition-colors ${
              star <= activeIndex
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-slate-300 dark:text-slate-600'
            }`}
          />
        </button>
      ))}
      {!readonly && (
        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
          {value > 0 ? `${value}/5` : 'Select rating'}
        </span>
      )}
    </div>
  );
}
