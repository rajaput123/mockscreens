export function getStatusColor(status: string): string {
  switch (status) {
    case 'in-progress':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'planning':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'on-hold':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'cancelled':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Renovation': 'bg-amber-100 text-amber-700 border-amber-200',
    'Healthcare': 'bg-pink-100 text-pink-700 border-pink-200',
    'Education': 'bg-amber-100 text-amber-700 border-amber-200',
    'Infrastructure': 'bg-amber-100 text-amber-700 border-amber-200',
    'Community': 'bg-green-100 text-green-700 border-green-200',
    'Cultural': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };
  return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
}

