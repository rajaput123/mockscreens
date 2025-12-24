'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuItem } from '../navigation/navigationData';

interface ModuleNavigationProps {
  subServices: MenuItem[];
  functions: MenuItem[];
  moduleId: string;
  category: 'operations' | 'people' | 'projects' | 'finance';
}

export default function ModuleNavigation({ 
  subServices, 
  functions, 
  moduleId,
  category 
}: ModuleNavigationProps) {
  const pathname = usePathname();

  const getRoute = (itemId: string, type: 'subService' | 'function') => {
    if (type === 'subService') {
      return `/${category}/${moduleId}/${itemId}`;
    }
    return `/${category}/${moduleId}/${itemId}`;
  };

  const isActive = (itemId: string, type: 'subService' | 'function') => {
    const route = getRoute(itemId, type);
    return pathname === route || pathname?.startsWith(route + '/');
  };

  // Only show navigation if there are items
  if (subServices.length === 0 && functions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Navigation Items - No tabs, just show all items */}
      <div className="flex flex-wrap gap-3 mt-2">
        {subServices.map((item) => (
          <Link
            key={item.id}
            href={getRoute(item.id, 'subService')}
            className={`inline-flex items-center rounded-xl transition-all duration-200 py-2.5 px-5 font-medium text-sm no-underline shadow-sm ${
              isActive(item.id, 'subService')
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border border-amber-600 shadow-md scale-105'
                : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 hover:shadow-md'
            }`}
          >
            {item.label}
          </Link>
        ))}

        {functions.map((item) => (
          <Link
            key={item.id}
            href={getRoute(item.id, 'function')}
            className={`inline-flex items-center rounded-xl transition-all duration-200 py-2.5 px-5 font-medium text-sm no-underline shadow-sm ${
              isActive(item.id, 'function')
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border border-amber-600 shadow-md scale-105'
                : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 hover:shadow-md'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
