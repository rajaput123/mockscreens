'use client';

import { useState, useEffect } from 'react';
import { StockBatch, getDaysUntilExpiry } from '../inventoryData';
import { InventoryItem, getAllInventoryItems } from '../inventoryData';

interface ExpiryTimelineProps {
  batches: StockBatch[];
  daysRange?: number;
  onBatchClick?: (batch: StockBatch) => void;
}

export default function ExpiryTimeline({ 
  batches, 
  daysRange = 30,
  onBatchClick 
}: ExpiryTimelineProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  useEffect(() => {
    setItems(getAllInventoryItems());
  }, []);

  const getBatchItem = (batch: StockBatch) => {
    return items.find(i => i.id === batch.itemId);
  };

  const getExpiryColor = (daysUntil: number) => {
    if (daysUntil <= 1) return '#dc2626'; // Red
    if (daysUntil <= 3) return '#f59e0b'; // Amber
    if (daysUntil <= 7) return '#eab308'; // Yellow
    return '#a87738'; // Green
  };

  const getExpiryPosition = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Position as percentage (0 = today, 100 = daysRange days away)
    const position = Math.max(0, Math.min(100, (diffDays / daysRange) * 100));
    return position;
  };

  const activeBatches = batches.filter(b => b.status === 'active' && b.remainingQuantity > 0);
  const sortedBatches = [...activeBatches].sort((a, b) => 
    new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  return (
    <div className="w-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Expiry Timeline</h3>
        <p className="text-sm text-gray-600">Items expiring in the next {daysRange} days</p>
      </div>

      {/* Timeline Track */}
      <div className="relative h-32 bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
        {/* Alert Zones */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-red-100 opacity-30 border-r-2 border-red-400">
            <div className="text-xs text-red-700 font-medium p-1">1 Day</div>
          </div>
          <div className="flex-1 bg-amber-100 opacity-30 border-r-2 border-amber-400">
            <div className="text-xs text-amber-700 font-medium p-1">3 Days</div>
          </div>
          <div className="flex-1 bg-yellow-100 opacity-30 border-r-2 border-yellow-400">
            <div className="text-xs text-yellow-700 font-medium p-1">7 Days</div>
          </div>
          <div className="flex-1 bg-amber-100 opacity-30">
            <div className="text-xs text-amber-700 font-medium p-1">{daysRange} Days</div>
          </div>
        </div>

        {/* Timeline Scale */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-900 bg-opacity-50 flex items-center justify-between px-2">
          <span className="text-xs text-white font-medium">Today</span>
          <span className="text-xs text-white font-medium">{daysRange} days</span>
        </div>

        {/* Batch Nodes */}
        {sortedBatches.map((batch) => {
          const item = getBatchItem(batch);
          if (!item) return null;
          
          const daysUntil = getDaysUntilExpiry(batch.expiryDate);
          const position = getExpiryPosition(batch.expiryDate);
          const color = getExpiryColor(daysUntil);
          const isSelected = selectedBatch === batch.id;
          const size = Math.max(20, Math.min(40, batch.remainingQuantity / 10));

          if (daysUntil > daysRange || daysUntil < 0) return null;

          return (
            <div
              key={batch.id}
              onClick={() => {
                setSelectedBatch(batch.id);
                onBatchClick?.(batch);
              }}
              className="absolute cursor-pointer transition-all duration-200 hover:scale-125 z-10 group"
              style={{
                left: `${position}%`,
                top: '50%',
                transform: `translate(-50%, -50%) ${isSelected ? 'scale(1.3)' : ''}`,
              }}
            >
              {/* Batch Node */}
              <div
                className="rounded-full border-2 border-white shadow-lg"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  boxShadow: isSelected ? `0 0 20px ${color}` : '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                {/* Pulse animation for expiring items */}
                {daysUntil <= 7 && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-75"
                    style={{ backgroundColor: color }}
                  />
                )}
              </div>

              {/* Batch Label */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-gray-300">{daysUntil} days left</div>
                  <div className="text-gray-300">{batch.remainingQuantity} {item.unit}</div>
                </div>
              </div>

              {/* Connection line to timeline */}
              <div
                className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-400"
                style={{ height: '20px' }}
              />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Expiring (1-3 days)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <span className="text-gray-600">Soon (4-7 days)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <span className="text-gray-600">Good (8+ days)</span>
        </div>
      </div>
    </div>
  );
}

