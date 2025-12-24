'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllInventoryItems,
  getAllStockBatches,
  InventoryItem,
} from '../inventoryData';
import InventoryNetworkGraph from '../components/InventoryNetworkGraph';
import LowStockAlert from '../components/LowStockAlert';
import { getLowStockItems } from '../inventoryData';

export default function NetworkViewPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allItems = getAllInventoryItems();
    const allBatches = getAllStockBatches();
    setItems(allItems);
    setBatches(allBatches);
  };

  const lowStockItems = getLowStockItems();

  return (
    <ModuleLayout
      title="Stock Distribution Network"
      description="Interactive network visualization of inventory across locations"
    >
      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="mb-6">
          <LowStockAlert items={lowStockItems} />
        </div>
      )}

      {/* Network Graph View */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Stock Distribution Network</h3>
          <p className="text-sm text-gray-600">Interactive visualization of inventory across locations. Click on nodes to see details.</p>
        </div>
        <div className="h-[600px]">
          <InventoryNetworkGraph
            items={items}
            onNodeClick={(item) => {
              console.log('Node clicked:', item);
            }}
            width={1200}
            height={600}
          />
        </div>
      </div>

      {/* Network Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Total Items</h4>
          <p className="text-2xl font-bold text-amber-600">{items.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Active Batches</h4>
          <p className="text-2xl font-bold text-amber-600">
            {batches.filter(b => b.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Storage Locations</h4>
          <p className="text-2xl font-bold text-amber-600">
            {Array.from(new Set(items.map(i => i.location))).length}
          </p>
        </div>
      </div>

      {/* Location Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock by Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(new Set(items.map(i => i.location))).map((location) => {
            const locationItems = items.filter(i => i.location === location);
            const totalStock = locationItems.reduce((sum, item) => sum + item.currentStock, 0);
            return (
              <div key={location} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">{location}</h4>
                <p className="text-sm text-gray-600">
                  {locationItems.length} items • {totalStock} total units
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <HelpButton module="perishable-inventory" />
    </ModuleLayout>
  );
}

