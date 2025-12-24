'use client';

import { PRASAD_CATEGORY, PRASAD_CATEGORY_METADATA } from '../prasadTypes';

interface CategorySelectorProps {
  selectedCategory: PRASAD_CATEGORY | null;
  onSelect: (category: PRASAD_CATEGORY) => void;
  disabled?: boolean;
  showDescriptions?: boolean;
}

export default function CategorySelector({
  selectedCategory,
  onSelect,
  disabled = false,
  showDescriptions = true,
}: CategorySelectorProps) {
  const categories = Object.values(PRASAD_CATEGORY);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Prasad Category <span className="text-red-500">*</span>
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((category) => {
          const metadata = PRASAD_CATEGORY_METADATA[category];
          const isSelected = selectedCategory === category;
          
          return (
            <button
              key={category}
              type="button"
              onClick={() => !disabled && onSelect(category)}
              disabled={disabled}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? `${metadata.color.border} ${metadata.color.bg}`
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{metadata.icon}</div>
                <div className="flex-1">
                  <div className={`font-semibold mb-1 ${
                    isSelected ? metadata.color.text : 'text-gray-700'
                  }`}>
                    {metadata.label}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {metadata.ui.tooltip}
                  </div>
                  
                  {showDescriptions && (
                    <div className="text-xs text-gray-500 mt-2">
                      {metadata.description}
                    </div>
                  )}
                  
                  <div className={`text-xs font-medium mt-2 px-2 py-1 rounded inline-block ${
                    metadata.accounting.type === 'REVENUE'
                      ? 'bg-amber-100 text-amber-700'
                      : metadata.accounting.type === 'PART_OF_SEVA_REVENUE'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    Accounting: {metadata.accounting.description}
                  </div>
                </div>
                
                {isSelected && (
                  <div className={`${metadata.color.text}`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedCategory && (
        <div className={`mt-4 p-4 rounded-lg border-2 ${
          PRASAD_CATEGORY_METADATA[selectedCategory].color.bg
        } ${PRASAD_CATEGORY_METADATA[selectedCategory].color.border}`}>
          <div className="text-sm font-medium text-gray-700 mb-2">
            Distribution Flow:
          </div>
          <div className="text-xs text-gray-600">
            {PRASAD_CATEGORY_METADATA[selectedCategory].distribution.flow}
          </div>
        </div>
      )}
    </div>
  );
}

