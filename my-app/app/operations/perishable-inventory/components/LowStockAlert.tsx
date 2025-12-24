'use client';

import { InventoryItem, getStockStatus } from '../inventoryData';
import Link from 'next/link';

interface LowStockAlertProps {
  items: InventoryItem[];
  maxItems?: number;
}

export default function LowStockAlert({ items, maxItems = 5 }: LowStockAlertProps) {
  const lowStockItems = items
    .filter(item => getStockStatus(item) !== 'good')
    .slice(0, maxItems);

  if (lowStockItems.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-amber-800">All stock levels are healthy</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-sm font-semibold text-red-900">Low Stock Alerts</h3>
        </div>
        <Link
          href="/operations/perishable-inventory/add-stock"
          className="text-xs text-red-700 hover:text-red-900 font-medium underline"
        >
          Add Stock →
        </Link>
      </div>
      
      <div className="space-y-2">
        {lowStockItems.map((item) => {
          const status = getStockStatus(item);
          const statusColors: Record<'critical' | 'low', string> = {
            critical: 'bg-red-200 border-red-400 text-red-900',
            low: 'bg-amber-200 border-amber-400 text-amber-900',
          };

          // Type guard: status should never be 'good' here since we filtered it out
          const stockStatus = status === 'critical' || status === 'low' ? status : 'low';

          return (
            <div
              key={item.id}
              className={`p-2 rounded border ${statusColors[stockStatus]} flex items-center justify-between`}
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{item.name}</div>
                <div className="text-xs opacity-75">
                  {item.currentStock} {item.unit} remaining (Min: {item.minStockLevel} {item.unit})
                </div>
              </div>
              <div className="text-xs font-bold">
                {stockStatus === 'critical' ? 'CRITICAL' : 'LOW'}
              </div>
            </div>
          );
        })}
      </div>

      {items.filter(item => getStockStatus(item) !== 'good').length > maxItems && (
        <div className="mt-3 text-center">
          <span className="text-xs text-red-700">
            +{items.filter(item => getStockStatus(item) !== 'good').length - maxItems} more items need attention
          </span>
        </div>
      )}
    </div>
  );
}

