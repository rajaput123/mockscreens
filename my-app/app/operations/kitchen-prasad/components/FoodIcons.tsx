'use client';

interface FoodIconProps {
  mealType: 'breakfast' | 'lunch' | 'dinner';
  size?: number;
  className?: string;
  animated?: boolean;
}

export function FoodIcon({ mealType, size = 24, className = '', animated = false }: FoodIconProps) {
  const iconClass = animated ? 'transition-transform duration-300 hover:scale-110' : '';
  
  switch (mealType) {
    case 'breakfast':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`${iconClass} ${className}`}
        >
          {/* Bowl shape */}
          <path d="M4 10c0-2 2-4 4-4h8c2 0 4 2 4 4v2c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-2z" />
          <path d="M4 12h16M8 8h8" />
          {/* Spoon */}
          <path d="M12 4v6M10 4l4 0" strokeLinecap="round" />
        </svg>
      );
    case 'lunch':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`${iconClass} ${className}`}
        >
          {/* Plate */}
          <ellipse cx="12" cy="14" rx="9" ry="3" />
          <ellipse cx="12" cy="14" rx="9" ry="1" fill="currentColor" opacity="0.2" />
          {/* Utensils */}
          <path d="M8 4v10M7 4h2" strokeLinecap="round" />
          <path d="M12 4v10M11 4h2" strokeLinecap="round" />
          <path d="M16 4v10M15 4h2" strokeLinecap="round" />
        </svg>
      );
    case 'dinner':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`${iconClass} ${className}`}
        >
          {/* Serving dish */}
          <path d="M3 12c0-1.5 1.5-3 3-3h12c1.5 0 3 1.5 3 3v2c0 1.5-1.5 3-3 3H6c-1.5 0-3-1.5-3-3v-2z" />
          <path d="M3 12h18M6 9v6M18 9v6" />
          {/* Steam lines */}
          <path d="M9 6v2M12 5v2M15 6v2" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    default:
      return null;
  }
}

export function MealTypeIcon({ mealType, size = 32 }: { mealType: 'breakfast' | 'lunch' | 'dinner'; size?: number }) {
  const colors = {
    breakfast: 'text-amber-600',
    lunch: 'text-amber-600',
    dinner: 'text-amber-600',
  };

  return (
    <div className={`${colors[mealType]} transition-transform duration-300 hover:scale-110`}>
      <FoodIcon mealType={mealType} size={size} animated />
    </div>
  );
}

export function FoodItemIcon({ itemName, size = 20 }: { itemName: string; size?: number }) {
  const lowerName = itemName.toLowerCase();
  
  // Rice icon
  if (lowerName.includes('rice')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-amber-600">
        <circle cx="12" cy="12" r="8" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    );
  }
  
  // Dal icon
  if (lowerName.includes('dal') || lowerName.includes('lentil')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-orange-600">
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }
  
  // Sweet icon
  if (lowerName.includes('sweet') || lowerName.includes('laddu') || lowerName.includes('dessert')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-pink-600">
        <path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 7s7-3 7-7c0-4-3-7-7-7z" />
        <circle cx="12" cy="9" r="2" />
      </svg>
    );
  }
  
  // Vegetable icon
  if (lowerName.includes('vegetable') || lowerName.includes('curry') || lowerName.includes('sabzi')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-amber-600">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    );
  }
  
  // Roti/Bread icon
  if (lowerName.includes('roti') || lowerName.includes('bread') || lowerName.includes('chapati')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-yellow-600">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v16M4 12h16" />
      </svg>
    );
  }
  
  // Default food icon
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-gray-600">
      <circle cx="12" cy="12" r="8" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  );
}


