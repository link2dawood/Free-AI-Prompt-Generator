
import React from 'react';
import { PromptCategory } from '../types';
import { CATEGORIES } from '../constants';
import Card from './ui/Card';

interface CategorySelectorProps {
  onSelectCategory: (category: PromptCategory) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelectCategory }) => {
  const categoryIcons: Record<PromptCategory, string> = {
    [PromptCategory.WRITING]: "fas fa-feather-alt",
    [PromptCategory.PROGRAMMING]: "fas fa-code",
    [PromptCategory.BUSINESS]: "fas fa-briefcase",
    [PromptCategory.SOCIAL_MEDIA]: "fas fa-share-alt",
    [PromptCategory.LEARNING_EDUCATION]: "fas fa-graduation-cap",
    [PromptCategory.CUSTOM]: "fas fa-cogs",
  };

  return (
    <Card title="What do you need a prompt for today?">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className="p-6 bg-slate-50 dark:bg-slate-700 hover:bg-sky-100 dark:hover:bg-sky-700 rounded-lg shadow-sm transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 text-left"
          >
            <div className="flex items-center text-sky-600 dark:text-sky-400 mb-2">
              <i className={`${categoryIcons[category]} text-2xl mr-3 w-8 text-center`}></i>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{category}</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 ml-11">
              Generate prompts for {category.toLowerCase().replace(' / other', '')}.
            </p>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default CategorySelector;
