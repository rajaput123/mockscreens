'use client';

import { useState } from 'react';
import { InventoryItem, StockBatch, getAllStockBatches, getBatchesByLocation } from '../inventoryData';
import StockCard from './StockCard';

interface WarehouseShelfProps {
  items: InventoryItem[];
  location?: string;
  onItemClick?: (item: InventoryItem) => void;
  onBoxClick?: (batch: StockBatch) => void;
}

export default function WarehouseShelf({ 
  items, 
  location,
  onItemClick,
  onBoxClick 
}: WarehouseShelfProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const batches = getAllStockBatches();

  // Group items by location if location is specified
  const filteredItems = location 
    ? items.filter(item => item.location === location)
    : items;

  // Group items by location for shelf organization
  const itemsByLocation = filteredItems.reduce((acc, item) => {
    if (!acc[item.location]) {
      acc[item.location] = [];
    }
    acc[item.location].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  const locations = Object.keys(itemsByLocation);

  return (
    <div className="w-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {location ? `${location} - Warehouse View` : 'Warehouse Shelf View'}
        </h3>
        <p className="text-sm text-gray-600">Interactive 3D-like shelf visualization</p>
      </div>

      <div className="space-y-8">
        {locations.map((loc) => {
          const locationItems = itemsByLocation[loc];
          const locationBatches = batches.filter(b => b.location === loc && b.status === 'active');

          return (
            <div key={loc} className="relative">
              {/* Shelf Label */}
              <div className="mb-2">
                <h4 className="text-sm font-semibold text-gray-700">{loc}</h4>
              </div>

              {/* Shelf Structure */}
              <div className="relative bg-gradient-to-b from-amber-200 to-amber-300 rounded-lg p-4 shadow-lg"
                style={{
                  transform: 'perspective(800px) rotateX(5deg)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.1)',
                }}
              >
                {/* Shelf Surface */}
                <div className="bg-amber-100 rounded-lg p-4 min-h-[120px] flex items-end gap-2 flex-wrap">
                  {locationItems.map((item) => {
                    const itemBatches = locationBatches.filter(b => b.itemId === item.id);
                    const totalStock = itemBatches.reduce((sum, b) => sum + b.remainingQuantity, 0);
                    
                    return (
                      <div
                        key={item.id}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="relative"
                      >
                        <StockCard
                          item={item}
                          onClick={onItemClick}
                          size="medium"
                        />
                        
                        {/* Batch indicators */}
                        {itemBatches.length > 1 && (
                          <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {itemBatches.length}
                          </div>
                        )}

                        {/* Expanded view on hover */}
                        {hoveredItem === item.id && itemBatches.length > 0 && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl min-w-[200px]">
                              <div className="font-semibold mb-2">{item.name}</div>
                              <div className="space-y-1">
                                {itemBatches.map((batch) => (
                                  <div
                                    key={batch.id}
                                    onClick={() => onBoxClick?.(batch)}
                                    className="flex items-center justify-between p-1 hover:bg-gray-800 rounded cursor-pointer"
                                  >
                                    <div>
                                      <div className="text-xs">{batch.batchNumber || 'No Batch'}</div>
                                      <div className="text-xs text-gray-400">
                                        {batch.remainingQuantity} {item.unit} • Exp: {new Date(batch.expiryDate).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {getDaysUntilExpiry(batch.expiryDate)}d
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Empty slots indicator */}
                  {locationItems.length === 0 && (
                    <div className="w-full text-center text-gray-400 py-8">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="text-sm">No items in this location</p>
                    </div>
                  )}
                </div>

                {/* Shelf Front Edge */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-400 rounded-b-lg"
                  style={{
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

