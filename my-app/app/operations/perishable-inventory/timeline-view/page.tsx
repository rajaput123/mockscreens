'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllInventoryItems,
  getAllStockBatches,
  getExpiringBatches,
  getExpiredBatches,
  getLowStockItems,
  InventoryItem,
  StockBatch,
} from '../inventoryData';
import ExpiryTimeline from '../components/ExpiryTimeline';
import LowStockAlert from '../components/LowStockAlert';

export default function TimelineViewPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [batches, setBatches] = useState<StockBatch[]>([]);
  const [daysRange, setDaysRange] = useState<number>(30);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allItems = getAllInventoryItems();
    const allBatches = getAllStockBatches();
    setItems(allItems);
    setBatches(allBatches);
  };

  const expiringBatches = getExpiringBatches(daysRange);
  const expiredBatches = getExpiredBatches();
  const lowStockItems = getLowStockItems();

  const getItemName = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item?.name || itemId;
  };

  return (
    <ModuleLayout
      title="Expiry Timeline View"
      description="Track and monitor inventory expiry with timeline visualization"
    >
      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="mb-6">
          <LowStockAlert items={lowStockItems} />
        </div>
      )}

      {/* Timeline Range Selector */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Timeline Range</h3>
          <div className="flex gap-2">
            {[7, 14, 30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() => setDaysRange(days)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  daysRange === days
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expiry Timeline */}
      <div className="mb-6">
        <ExpiryTimeline
          batches={batches}
          daysRange={daysRange}
          onBatchClick={(batch) => {
            console.log('Batch clicked:', batch);
          }}
        />
      </div>

      {/* Expiring Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expiring in Next {daysRange} Days
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {expiringBatches.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No items expiring in this period</p>
            ) : (
              expiringBatches.map((batch) => {
                const item = items.find(i => i.id === batch.itemId);
                if (!item) return null;
                const daysUntil = Math.ceil(
                  (new Date(batch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={batch.id}
                    className={`p-4 rounded-lg border-2 ${
                      daysUntil <= 3
                        ? 'bg-red-50 border-red-300'
                        : daysUntil <= 7
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-yellow-50 border-yellow-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className={`text-sm font-bold ${
                        daysUntil <= 3 ? 'text-red-700' :
                        daysUntil <= 7 ? 'text-amber-700' : 'text-yellow-700'
                      }`}>
                        {daysUntil} days left
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Batch: {batch.batchNumber || 'No Batch'} • {batch.remainingQuantity} {item.unit}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Expires: {new Date(batch.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Already Expired</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {expiredBatches.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No expired items</p>
            ) : (
              expiredBatches.map((batch) => {
                const item = items.find(i => i.id === batch.itemId);
                if (!item) return null;
                return (
                  <div
                    key={batch.id}
                    className="p-4 bg-gray-100 border-2 border-gray-300 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm font-bold text-red-700">EXPIRED</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Batch: {batch.batchNumber || 'No Batch'} • {batch.remainingQuantity} {item.unit}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Expired: {new Date(batch.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Total Batches</h4>
          <p className="text-2xl font-bold text-gray-900">{batches.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Expiring Soon</h4>
          <p className="text-2xl font-bold text-amber-600">{expiringBatches.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Expired</h4>
          <p className="text-2xl font-bold text-red-600">{expiredBatches.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Active</h4>
          <p className="text-2xl font-bold text-amber-600">
            {batches.filter(b => b.status === 'active').length}
          </p>
        </div>
      </div>

      <HelpButton module="perishable-inventory" />
    </ModuleLayout>
  );
}

