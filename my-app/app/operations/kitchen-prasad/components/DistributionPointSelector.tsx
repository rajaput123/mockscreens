'use client';

import { DISTRIBUTION_POINT, PRASAD_CATEGORY, isValidCategoryDistributionPoint } from '../prasadTypes';

interface DistributionPointSelectorProps {
  selectedPoint: DISTRIBUTION_POINT | null;
  category: PRASAD_CATEGORY | null;
  onSelect: (point: DISTRIBUTION_POINT) => void;
  disabled?: boolean;
}

const DISTRIBUTION_POINT_LABELS: Record<DISTRIBUTION_POINT, { label: string; description: string; icon: string }> = {
  [DISTRIBUTION_POINT.ANNADAN_HALL]: {
    label: 'Annadan Hall',
    description: 'Free community food distribution area',
    icon: '🏛️',
  },
  [DISTRIBUTION_POINT.COUNTER]: {
    label: 'Counter',
    description: 'Prasad sale counter',
    icon: '🏪',
  },
  [DISTRIBUTION_POINT.SEVA_AREA]: {
    label: 'Seva Area',
    description: 'Prasad distribution after seva/pooja',
    icon: '🕉️',
  },
};

export default function DistributionPointSelector({
  selectedPoint,
  category,
  onSelect,
  disabled = false,
}: DistributionPointSelectorProps) {
  const points = Object.values(DISTRIBUTION_POINT);

  // Filter points based on category compatibility
  const availablePoints = category
    ? points.filter(point => isValidCategoryDistributionPoint(category, point))
    : points;

  if (availablePoints.length === 0 && category) {
    return (
      <div className="text-sm text-amber-600">
        Please select a prasad category first to see available distribution points.
      </div>
    );
  }

  if (availablePoints.length === 1 && category) {
    // Auto-select if only one option
    const singlePoint = availablePoints[0];
    if (!selectedPoint) {
      onSelect(singlePoint);
    }
    return null;
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Distribution Point <span className="text-red-500">*</span>
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {availablePoints.map((point) => {
          const info = DISTRIBUTION_POINT_LABELS[point];
          const isSelected = selectedPoint === point;
          const isValid = !category || isValidCategoryDistributionPoint(category, point);
          
          return (
            <button
              key={point}
              type="button"
              onClick={() => !disabled && isValid && onSelect(point)}
              disabled={disabled || !isValid}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-amber-500 bg-amber-50'
                  : isValid
                  ? 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50'
                  : 'border-gray-100 bg-gray-50 opacity-50'
              } ${disabled || !isValid ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{info.icon}</div>
                <div className="flex-1">
                  <div className={`font-semibold mb-1 ${
                    isSelected ? 'text-amber-700' : 'text-gray-700'
                  }`}>
                    {info.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {info.description}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="text-amber-600">
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
      
      {category && selectedPoint && !isValidCategoryDistributionPoint(category, selectedPoint) && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-700">
            ⚠️ This distribution point is not compatible with the selected category. Please select a valid option.
          </div>
        </div>
      )}
    </div>
  );
}

