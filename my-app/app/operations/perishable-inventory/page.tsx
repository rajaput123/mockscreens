'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../components/layout/ModuleLayout';
import Link from 'next/link';
import {
  getAllInventoryItems,
  getExpiringBatches,
  getExpiredBatches,
  getLowStockItems,
  calculateTotalValue,
  InventoryItem,
} from './inventoryData';

export default function PerishableInventoryDashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allItems = getAllInventoryItems();
    setItems(allItems);
  };

  const expiringBatches = getExpiringBatches(7);
  const expiredBatches = getExpiredBatches();
  const lowStockItems = getLowStockItems();
  const totalValue = calculateTotalValue();

  const stats = {
    totalItems: items.length,
    lowStockAlerts: lowStockItems.length,
    expiringSoon: expiringBatches.length,
    expired: expiredBatches.length,
    totalValue: totalValue,
  };

  return (
    <ModuleLayout
      title="Perishable Inventory Management"
      description="Track and manage perishable inventory with expiry alerts and stock monitoring"
    >
      {/* Quick Actions */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            href="/operations/perishable-inventory/add-stock"
            className="bg-amber-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 no-underline text-center"
          >
            Add Stock
          </Link>
          <Link
            href="/operations/perishable-inventory/issue-stock"
            className="bg-white border-2 border-amber-600 text-amber-600 px-4 py-3 rounded-xl font-medium hover:bg-amber-50 transition-all duration-200 transform hover:scale-105 no-underline text-center"
          >
            Issue Stock
          </Link>
          <Link
            href="/operations/perishable-inventory/record-wastage"
            className="bg-white border-2 border-amber-600 text-amber-600 px-4 py-3 rounded-xl font-medium hover:bg-amber-50 transition-all duration-200 transform hover:scale-105 no-underline text-center"
          >
            Record Wastage
          </Link>
          <Link
            href="/operations/perishable-inventory/rework-stock"
            className="bg-white border-2 border-amber-600 text-amber-600 px-4 py-3 rounded-xl font-medium hover:bg-amber-50 transition-all duration-200 transform hover:scale-105 no-underline text-center"
          >
            Rework Stock
          </Link>
          <Link
            href="/operations/perishable-inventory/request-stock"
            className="bg-white border-2 border-blue-600 text-amber-600 px-4 py-3 rounded-xl font-medium hover:bg-amber-50 transition-all duration-200 transform hover:scale-105 no-underline text-center"
          >
            Request Stock
          </Link>
          <Link
            href="/operations/perishable-inventory/stock-reports"
            className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 no-underline text-center"
          >
            View Reports
          </Link>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-red-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-700">⚠️ Low Stock Alerts</h3>
            <Link
              href="/operations/perishable-inventory/request-stock"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Request Stock →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="font-semibold text-gray-900 mb-1">{item.name}</div>
                <div className="text-sm text-gray-600">
                  Current: <span className="font-bold text-red-600">{item.currentStock}</span> {item.unit} | 
                  Min: {item.minStockLevel} {item.unit}
                </div>
              </div>
            ))}
          </div>
          {lowStockItems.length > 6 && (
            <p className="text-sm text-gray-500 mt-4">
              +{lowStockItems.length - 6} more items with low stock
            </p>
          )}
        </div>
      )}

      {/* Expiring Soon Alerts */}
      {expiringBatches.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-amber-200 p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-amber-700 mb-4">⏰ Expiring Soon (Next 7 Days)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiringBatches.slice(0, 6).map((batch) => {
              const item = items.find(i => i.id === batch.itemId);
              return (
                <div
                  key={batch.id}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                >
                  <div className="font-semibold text-gray-900 mb-1">{item?.name || 'Unknown Item'}</div>
                  <div className="text-sm text-gray-600">
                    Quantity: {batch.remainingQuantity} {item?.unit || ''} | 
                    Expires: {new Date(batch.expiryDate).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
          {expiringBatches.length > 6 && (
            <p className="text-sm text-gray-500 mt-4">
              +{expiringBatches.length - 6} more batches expiring soon
            </p>
          )}
        </div>
      )}
    </ModuleLayout>
  );
}

