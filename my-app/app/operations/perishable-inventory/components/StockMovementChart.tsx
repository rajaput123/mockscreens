'use client';

import { StockMovement, getAllStockMovements } from '../inventoryData';
import { InventoryItem, getAllInventoryItems } from '../inventoryData';
import { useState, useEffect } from 'react';

interface StockMovementChartProps {
  days?: number;
  itemId?: string;
}

export default function StockMovementChart({ days = 30, itemId }: StockMovementChartProps) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const allMovements = getAllStockMovements();
    const filtered = itemId 
      ? allMovements.filter(m => m.itemId === itemId)
      : allMovements;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentMovements = filtered.filter(m => new Date(m.date) >= cutoffDate);
    setMovements(recentMovements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setItems(getAllInventoryItems());
  }, [days, itemId]);

  const getItemName = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item?.name || itemId;
  };

  const getMovementColor = (type: StockMovement['type']) => {
    switch (type) {
      case 'add':
        return 'bg-amber-500';
      case 'issue':
        return 'bg-amber-500';
      case 'wastage':
        return 'bg-red-500';
      case 'adjustment':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMovementIcon = (type: StockMovement['type']) => {
    switch (type) {
      case 'add':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case 'issue':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        );
      case 'wastage':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Group movements by date
  const movementsByDate = movements.reduce((acc, movement) => {
    const date = movement.date.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(movement);
    return acc;
  }, {} as Record<string, StockMovement[]>);

  const dates = Object.keys(movementsByDate).sort();

  if (movements.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl p-6 border border-gray-200 text-center text-gray-500">
        <p>No stock movements in the last {days} days</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Stock Movement History</h3>
        <p className="text-sm text-gray-600">Last {days} days</p>
      </div>

      <div className="space-y-4">
        {dates.map((date) => (
          <div key={date} className="border-l-2 border-gray-300 pl-4 relative">
            {/* Date marker */}
            <div className="absolute -left-2 top-0 w-4 h-4 bg-white border-2 border-gray-400 rounded-full"></div>
            
            <div className="mb-2">
              <span className="text-xs font-medium text-gray-600">
                {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="space-y-2">
              {movementsByDate[date].map((movement) => (
                <div
                  key={movement.id}
                  className={`${getMovementColor(movement.type)} bg-opacity-10 border-l-4 ${getMovementColor(movement.type)} rounded p-3 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`${getMovementColor(movement.type)} text-white rounded-full p-2`}>
                      {getMovementIcon(movement.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {getItemName(movement.itemId)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                        {movement.reason && ` • ${movement.reason}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-gray-900">
                      {movement.type === 'add' ? '+' : '-'}{movement.quantity}
                    </div>
                    <div className="text-xs text-gray-500">
                      {movement.createdBy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

