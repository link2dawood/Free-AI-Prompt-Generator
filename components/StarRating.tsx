
import React from 'react';

interface StarRatingProps {
  rating: number; // 0-5
  onRate: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRate, size = 'md', disabled = false }) => {
  const maxStars = 5;

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center space-x-1 ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onRate(starValue)}
            className={`focus:outline-none transition-colors duration-150 ${sizeClasses[size]} ${
              starValue <= rating ? 'text-yellow-400 dark:text-yellow-300' : 'text-slate-300 dark:text-slate-600 hover:text-yellow-300 dark:hover:text-yellow-200'
            }`}
            aria-label={`Rate ${starValue} out of ${maxStars} stars`}
          >
            <i className="fas fa-star"></i>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
