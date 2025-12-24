'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllInventoryItems,
  getAllStockBatches,
  getAllStockMovements,
  getExpiringBatches,
  getExpiredBatches,
  getLowStockItems,
  calculateTotalValue,
  InventoryItem,
  StockBatch,
  StockMovement,
} from '../inventoryData';
import StockMovementChart from '../components/StockMovementChart';
import ExpiryTimeline from '../components/ExpiryTimeline';

type ReportTab = 'overview' | 'movements' | 'expiry' | 'wastage' | 'costs';

export default function StockReportsPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [batches, setBatches] = useState<StockBatch[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [activeTab, setActiveTab] = useState<ReportTab>('overview');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allItems = getAllInventoryItems();
    const allBatches = getAllStockBatches();
    const allMovements = getAllStockMovements();
    setItems(allItems);
    setBatches(allBatches);
    setMovements(allMovements);
  };

  const filteredMovements = movements.filter(m => {
    const movementDate = new Date(m.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return movementDate >= startDate && movementDate <= endDate;
  });

  const wastageMovements = filteredMovements.filter(m => m.type === 'wastage');
  const totalWastageCost = wastageMovements.reduce((total, movement) => {
    const batch = batches.find(b => b.id === movement.batchId);
    if (batch) {
      const costPerUnit = batch.purchasePrice / batch.quantity;
      return total + (movement.quantity * costPerUnit);
    }
    return total;
  }, 0);

  const expiringBatches = getExpiringBatches(30);
  const expiredBatches = getExpiredBatches();
  const lowStockItems = getLowStockItems();
  const totalValue = calculateTotalValue();

  const getItemName = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item?.name || itemId;
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    // Simple export - in production, use a library
    const data = {
      items,
      batches,
      movements: filteredMovements,
      summary: {
        totalItems: items.length,
        totalValue,
        lowStockItems: lowStockItems.length,
        expiringBatches: expiringBatches.length,
        totalWastageCost,
      },
    };

    if (format === 'excel') {
      // Convert to CSV
      const csv = convertToCSV(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else {
      // For PDF, would use a library like jsPDF
      alert('PDF export coming soon');
    }
  };

  const convertToCSV = (data: any): string => {
    // Simple CSV conversion
    let csv = 'Item,Category,Stock,Unit,Location,Value\n';
    data.items.forEach((item: InventoryItem) => {
      csv += `${item.name},${item.category},${item.currentStock},${item.unit},${item.location},${item.currentStock * item.costPerUnit}\n`;
    });
    return csv;
  };

  return (
    <ModuleLayout
      title="Stock Reports"
      description="View analytics, reports, and export inventory data"
    >
      {/* Date Range Filter */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
          </div>
          <div className="flex-1"></div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('excel')}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 text-sm font-medium"
            >
              Export Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 p-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'movements', label: 'Movements' },
              { id: 'expiry', label: 'Expiry' },
              { id: 'wastage', label: 'Wastage' },
              { id: 'costs', label: 'Costs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ReportTab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-amber-700 mb-1">Total Items</div>
                  <div className="text-2xl font-bold text-amber-900">{items.length}</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-red-700 mb-1">Low Stock</div>
                  <div className="text-2xl font-bold text-red-900">{lowStockItems.length}</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-amber-700 mb-1">Expiring (30d)</div>
                  <div className="text-2xl font-bold text-amber-900">{expiringBatches.length}</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-amber-700 mb-1">Total Value</div>
                  <div className="text-2xl font-bold text-amber-900">₹{totalValue.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Stock by Category</h4>
                  <div className="space-y-2">
                    {['vegetables', 'grains', 'spices', 'dairy', 'fruits', 'other'].map((category) => {
                      const categoryItems = items.filter(i => i.category === category);
                      const categoryValue = categoryItems.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);
                      return (
                        <div key={category} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{category}:</span>
                          <span className="font-semibold text-gray-900">
                            {categoryItems.length} items • ₹{categoryValue.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Stock by Location</h4>
                  <div className="space-y-2">
                    {Array.from(new Set(items.map(i => i.location))).map((location) => {
                      const locationItems = items.filter(i => i.location === location);
                      const locationValue = locationItems.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);
                      return (
                        <div key={location} className="flex justify-between text-sm">
                          <span className="text-gray-600">{location}:</span>
                          <span className="font-semibold text-gray-900">
                            {locationItems.length} items • ₹{locationValue.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Movements Tab */}
          {activeTab === 'movements' && (
            <div>
              <StockMovementChart days={30} />
            </div>
          )}

          {/* Expiry Tab */}
          {activeTab === 'expiry' && (
            <div className="space-y-6">
              <ExpiryTimeline batches={batches} daysRange={30} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Expiring in Next 7 Days</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {expiringBatches.slice(0, 10).map((batch) => {
                      const item = items.find(i => i.id === batch.itemId);
                      if (!item) return null;
                      const daysUntil = Math.ceil(
                        (new Date(batch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <div key={batch.id} className="p-2 bg-red-50 border border-red-200 rounded">
                          <div className="font-medium text-sm text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-600">
                            {batch.remainingQuantity} {item.unit} • {daysUntil} days left
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Already Expired</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {expiredBatches.slice(0, 10).map((batch) => {
                      const item = items.find(i => i.id === batch.itemId);
                      if (!item) return null;
                      return (
                        <div key={batch.id} className="p-2 bg-gray-100 border border-gray-300 rounded">
                          <div className="font-medium text-sm text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-600">
                            {batch.remainingQuantity} {item.unit} • Expired
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wastage Tab */}
          {activeTab === 'wastage' && (
            <div className="space-y-6">
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <div className="text-sm font-medium text-red-700 mb-1">Total Wastage Cost</div>
                <div className="text-3xl font-bold text-red-900">₹{totalWastageCost.toFixed(2)}</div>
                <div className="text-sm text-red-600 mt-1">
                  {wastageMovements.length} wastage records in selected period
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Wastage by Category</h4>
                <div className="space-y-2">
                  {['expired', 'spoiled', 'damaged', 'overstock'].map((category) => {
                    const categoryWastage = wastageMovements.filter(m => m.wastageCategory === category);
                    const categoryCost = categoryWastage.reduce((total, movement) => {
                      const batch = batches.find(b => b.id === movement.batchId);
                      if (batch) {
                        const costPerUnit = batch.purchasePrice / batch.quantity;
                        return total + (movement.quantity * costPerUnit);
                      }
                      return total;
                    }, 0);
                    return (
                      <div key={category} className="flex justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium text-gray-900 capitalize">{category}:</span>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{categoryWastage.length} records</div>
                          <div className="text-sm text-gray-600">₹{categoryCost.toFixed(2)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Recent Wastage Records</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {wastageMovements.slice(0, 20).map((movement) => {
                    const item = items.find(i => i.id === movement.itemId);
                    if (!item) return null;
                    const batch = batches.find(b => b.id === movement.batchId);
                    const cost = batch ? (batch.purchasePrice / batch.quantity) * movement.quantity : 0;
                    return (
                      <div key={movement.id} className="p-3 border border-gray-200 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-600">
                              {movement.quantity} {item.unit} • {movement.wastageCategory}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(movement.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-red-600">₹{cost.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Costs Tab */}
          {activeTab === 'costs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-amber-700 mb-1">Total Inventory Value</div>
                  <div className="text-2xl font-bold text-amber-900">₹{totalValue.toLocaleString()}</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-red-700 mb-1">Total Wastage Cost</div>
                  <div className="text-2xl font-bold text-red-900">₹{totalWastageCost.toFixed(2)}</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-amber-700 mb-1">Net Value</div>
                  <div className="text-2xl font-bold text-amber-900">₹{(totalValue - totalWastageCost).toLocaleString()}</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Top Items by Value</h4>
                <div className="space-y-2">
                  {items
                    .map(item => ({
                      ...item,
                      value: item.currentStock * item.costPerUnit,
                    }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 10)
                    .map((item) => (
                      <div key={item.id} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium text-sm text-gray-900">{item.name}</span>
                        <span className="font-semibold text-gray-900">₹{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <HelpButton module="perishable-inventory" />
    </ModuleLayout>
  );
}

