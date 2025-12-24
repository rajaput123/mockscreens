'use client';

import { InventoryItem, getStockStatus } from '../inventoryData';

interface StockCardProps {
  item: InventoryItem;
  onClick?: (item: InventoryItem) => void;
  size?: 'small' | 'medium' | 'large';
}

export default function StockCard({ item, onClick, size = 'medium' }: StockCardProps) {
  const status = getStockStatus(item);
  const statusColors = {
    good: 'bg-amber-500',
    low: 'bg-amber-500',
    critical: 'bg-red-500',
  };
  
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  const stockPercentage = (item.currentStock / item.maxStockLevel) * 100;
  const boxSize = Math.max(40, Math.min(100, stockPercentage));

  return (
    <div
      onClick={() => onClick?.(item)}
      className={`${sizeClasses[size]} ${statusColors[status]} rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl relative group`}
      style={{
        transform: 'perspective(500px) rotateX(5deg)',
        boxShadow: `0 4px 12px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(0,0,0,0.1)`,
      }}
      title={`${item.name} - ${item.currentStock} ${item.unit}`}
    >
      {/* Stock level indicator */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 rounded-b-lg"
        style={{ height: `${100 - boxSize}%` }}
      />
      
      {/* Item name */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-xs font-bold text-center px-1">
          {item.name.substring(0, 8)}
        </div>
      </div>

      {/* Stock quantity badge */}
      <div className="absolute -top-2 -right-2 bg-white rounded-full px-2 py-1 shadow-md">
        <span className="text-xs font-bold text-gray-900">{item.currentStock}</span>
      </div>

      {/* Expiry glow effect for low stock */}
      {status !== 'good' && (
        <div className={`absolute inset-0 ${statusColors[status]} rounded-lg opacity-50 animate-pulse`} />
      )}

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap">
          <div className="font-semibold mb-1">{item.name}</div>
          <div className="text-gray-300">
            Stock: {item.currentStock} {item.unit}
          </div>
          <div className="text-gray-300">
            Location: {item.location}
          </div>
          <div className="text-gray-300">
            Status: {status.toUpperCase()}
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

