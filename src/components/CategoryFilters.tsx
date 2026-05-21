import React from 'react';
import { motion } from 'motion/react';
import { Category, ImageItem } from '../types';

interface CategoryFiltersProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  images: ImageItem[];
  favoriteCount: number;
  darkMode: boolean;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  images,
  favoriteCount,
  darkMode,
}) => {
  const categories: { label: Category; count: number }[] = [
    { label: 'All', count: images.length },
    { label: 'Nature', count: images.filter((img) => img.category === 'Nature').length },
    { label: 'Architecture', count: images.filter((img) => img.category === 'Architecture').length },
    { label: 'Animals', count: images.filter((img) => img.category === 'Animals').length },
    { label: 'Travel', count: images.filter((img) => img.category === 'Travel').length },
    { label: 'Food', count: images.filter((img) => img.category === 'Food').length },
    { label: 'Portraits', count: images.filter((img) => img.category === 'Portraits').length },
    { label: 'Favorites', count: favoriteCount },
  ];

  return (
    <div 
      className={`px-6 py-3 sticky top-[73px] sm:top-[73px] z-30 transition-colors duration-300 border-b ${
        darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-100'
      }`} 
      id="category-filters-container"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-start overflow-x-auto scrollbar-none gap-2 py-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.label;
          
          if (cat.label === 'Favorites' && cat.count === 0) {
            // Hide favorites filter tab only if there are no favorites
            return null;
          }

          return (
            <button
              id={`tab-${cat.label.toLowerCase()}`}
              key={cat.label}
              onClick={() => onCategoryChange(cat.label)}
              className={`relative px-4 py-2 text-xs font-medium tracking-wide rounded-full transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 ${
                isActive 
                  ? (darkMode ? 'text-neutral-900 font-semibold' : 'text-neutral-50 font-semibold') 
                  : (darkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900')
              }`}
            >
              {/* Opacity/Scale Transition instead of layoutId to solve the React 19 compiler crash */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.18 }}
                  className={`absolute inset-0 rounded-full -z-10 ${
                    darkMode ? 'bg-white' : 'bg-neutral-900'
                  }`}
                />
              )}
              
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full transition-colors ${
                  isActive 
                    ? (darkMode ? 'bg-neutral-900/10 text-neutral-900 font-bold' : 'bg-white/20 text-white') 
                    : (darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-600')
                }`}>
                  {cat.count}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
