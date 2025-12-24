'use client';

import { useState, useEffect, DragEvent } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllInventoryItems,
  getAllStockBatches,
  getBatchesByItem,
  saveStockBatch,
  saveStockMovement,
  updateItemStock,
  InventoryItem,
  StockBatch,
  StockMovement,
} from '../inventoryData';
import WarehouseShelf from '../components/WarehouseShelf';

type WastageCategory = 'expired' | 'spoiled' | 'damaged' | 'overstock';

interface WastageBin {
  id: WastageCategory;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

const wastageBins: WastageBin[] = [
  {
    id: 'expired',
    label: 'Expired',
    color: 'text-red-700',
    bgColor: 'bg-red-100 border-red-400',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'spoiled',
    label: 'Spoiled',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100 border-orange-400',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'damaged',
    label: 'Damaged',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100 border-amber-400',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    id: 'overstock',
    label: 'Overstock',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100 border-purple-400',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

export default function RecordWastagePage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [batches, setBatches] = useState<StockBatch[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<StockBatch | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<WastageCategory | null>(null);
  const [wastageQuantity, setWastageQuantity] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [draggedBatch, setDraggedBatch] = useState<StockBatch | null>(null);
  const [hoveredBin, setHoveredBin] = useState<WastageCategory | null>(null);
  const [totalWastageCost, setTotalWastageCost] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkItems, setBulkItems] = useState<Array<{
    itemId: string;
    itemName: string;
    batchId: string;
    quantity: string;
    category: WastageCategory;
    reason: string;
  }>>([{ itemId: '', itemName: '', batchId: '', quantity: '', category: 'expired', reason: '' }]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedBatch && wastageQuantity) {
      const quantity = parseFloat(wastageQuantity);
      const cost = (selectedBatch.purchasePrice / selectedBatch.quantity) * quantity;
      setTotalWastageCost(cost);
    } else {
      setTotalWastageCost(0);
    }
  }, [selectedBatch, wastageQuantity]);

  const loadData = () => {
    const allItems = getAllInventoryItems();
    const allBatches = getAllStockBatches();
    setItems(allItems);
    setBatches(allBatches.filter(b => b.status === 'active' && b.remainingQuantity > 0));
  };

  const handleItemSelect = (item: InventoryItem) => {
    setSelectedItem(item);
    const itemBatches = getBatchesByItem(item.id);
    if (itemBatches.length > 0) {
      setSelectedBatch(itemBatches[0]);
      setWastageQuantity(itemBatches[0].remainingQuantity.toString());
    }
  };

  const handleBatchDragStart = (e: DragEvent, batch: StockBatch) => {
    setDraggedBatch(batch);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', batch.id);
  };

  const handleBinDragOver = (e: DragEvent, category: WastageCategory) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredBin(category);
  };

  const handleBinDrop = (e: DragEvent, category: WastageCategory) => {
    e.preventDefault();
    setHoveredBin(null);

    const batchId = e.dataTransfer.getData('text/plain');
    const batch = batches.find(b => b.id === batchId);
    
    if (batch) {
      const item = items.find(i => i.id === batch.itemId);
      if (item) {
        setSelectedItem(item);
        setSelectedBatch(batch);
        setSelectedCategory(category);
        setWastageQuantity(batch.remainingQuantity.toString());
      }
    }
  };

  const handleRecordWastage = () => {
    if (!selectedItem || !selectedBatch || !selectedCategory || !wastageQuantity) return;

    const quantity = parseFloat(wastageQuantity);
    if (quantity <= 0 || quantity > selectedBatch.remainingQuantity) {
      alert('Invalid quantity');
      return;
    }

    try {
      // Update batch
      const updatedBatch: StockBatch = {
        ...selectedBatch,
        remainingQuantity: selectedBatch.remainingQuantity - quantity,
        status: selectedBatch.remainingQuantity - quantity === 0 ? 'wasted' : 'active',
      };
      saveStockBatch(updatedBatch);

      // Update item stock
      updateItemStock(selectedItem.id);

      // Record movement
      const cost = (selectedBatch.purchasePrice / selectedBatch.quantity) * quantity;
      saveStockMovement({
        id: `movement-${Date.now()}`,
        itemId: selectedItem.id,
        batchId: selectedBatch.id,
        type: 'wastage',
        quantity: quantity,
        date: new Date().toISOString(),
        reason: reason || `${selectedCategory} wastage`,
        wastageCategory: selectedCategory,
        createdBy: 'Admin',
        notes: reason || undefined,
      });

      alert(`Wastage recorded: ${quantity} ${selectedItem.unit} (Cost: ₹${cost.toFixed(2)})`);
      
      // Reset
      setSelectedItem(null);
      setSelectedBatch(null);
      setSelectedCategory(null);
      setWastageQuantity('');
      setReason('');
      
      loadData();
    } catch (error) {
      console.error('Error recording wastage:', error);
      alert('Error recording wastage. Please try again.');
    }
  };

  const getBatchesForItem = (itemId: string) => {
    return batches.filter(b => b.itemId === itemId);
  };

  return (
    <ModuleLayout
      title={
        <div className="flex items-center justify-between w-full">
          <span>Record Wastage</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowBulkModal(true);
                setSelectedItem(null);
              }}
              className="px-4 py-2 bg-white border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-all text-sm font-medium"
            >
              Bulk Wastage
            </button>
            <button
              onClick={() => {
                setShowAddModal(true);
                setSelectedItem(null);
              }}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm font-medium shadow-md"
            >
              + Record Wastage
            </button>
          </div>
        </div>
      }
      description="Record wastage with categorization and cost tracking"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Stock Items with Batches */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Item & Batch</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {items
                .filter(item => item.currentStock > 0)
                .map((item) => {
                  const itemBatches = getBatchesForItem(item.id);
                  if (itemBatches.length === 0) return null;

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border-2 ${
                        selectedItem?.id === item.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div
                        onClick={() => handleItemSelect(item)}
                        className="cursor-pointer"
                      >
                        <div className="font-medium text-sm text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-600">
                          {item.currentStock} {item.unit} available
                        </div>
                      </div>

                      {/* Batches for this item */}
                      {selectedItem?.id === item.id && (
                        <div className="mt-2 space-y-2">
                          {itemBatches.map((batch) => {
                            const daysUntilExpiry = Math.ceil(
                              (new Date(batch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                            );
                            const isSelected = selectedBatch?.id === batch.id;

                            return (
                              <div
                                key={batch.id}
                                draggable
                                onDragStart={(e) => handleBatchDragStart(e, batch)}
                                onClick={() => {
                                  setSelectedBatch(batch);
                                  setWastageQuantity(batch.remainingQuantity.toString());
                                }}
                                className={`p-2 rounded border-2 cursor-move transition-all duration-200 hover:scale-105 ${
                                  isSelected
                                    ? 'border-red-500 bg-red-100'
                                    : 'border-gray-200 hover:border-red-300'
                                }`}
                              >
                                <div className="text-xs font-medium text-gray-900">
                                  {batch.batchNumber || 'No Batch'}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {batch.remainingQuantity} {item.unit} • {daysUntilExpiry}d left
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Middle: Wastage Bins */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Drag to Wastage Bin</h3>
            <div className="grid grid-cols-2 gap-4">
              {wastageBins.map((bin) => {
                const isHovered = hoveredBin === bin.id;
                const isSelected = selectedCategory === bin.id;

                return (
                  <div
                    key={bin.id}
                    onDragOver={(e) => handleBinDragOver(e, bin.id)}
                    onDragLeave={() => setHoveredBin(null)}
                    onDrop={(e) => handleBinDrop(e, bin.id)}
                    onClick={() => {
                      if (selectedBatch) {
                        setSelectedCategory(bin.id);
                      }
                    }}
                    className={`${bin.bgColor} rounded-xl p-6 border-4 cursor-pointer transition-all duration-200 ${
                      isHovered
                        ? 'scale-110 shadow-2xl border-opacity-100'
                        : isSelected
                        ? 'scale-105 shadow-lg border-opacity-100'
                        : 'border-opacity-50 hover:scale-105 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className={`${bin.color} mb-2`}>
                        {bin.icon}
                      </div>
                      <div className={`font-semibold ${bin.color}`}>
                        {bin.label}
                      </div>
                      {isSelected && (
                        <div className="mt-2 text-xs text-gray-700">
                          Selected
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cost Impact Display */}
            {totalWastageCost > 0 && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <div className="text-sm font-medium text-red-900 mb-1">Cost Impact</div>
                <div className="text-2xl font-bold text-red-700">
                  ₹{totalWastageCost.toFixed(2)}
                </div>
                <div className="text-xs text-red-600 mt-1">
                  {wastageQuantity} {selectedItem?.unit} × ₹{(selectedBatch ? selectedBatch.purchasePrice / selectedBatch.quantity : 0).toFixed(2)}/unit
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Wastage Details Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Wastage Details</h3>

            {selectedItem && selectedBatch && selectedCategory ? (
              <div className="space-y-4">
                {/* Selected Item & Batch */}
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <div className="font-semibold text-gray-900">{selectedItem.name}</div>
                  <div className="text-sm text-gray-600">
                    Batch: {selectedBatch.batchNumber || 'No Batch Number'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Available: {selectedBatch.remainingQuantity} {selectedItem.unit}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wastage Category *
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                    <div className="font-medium text-sm text-gray-900">
                      {wastageBins.find(b => b.id === selectedCategory)?.label}
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity Wasted ({selectedItem.unit}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={wastageQuantity}
                    onChange={(e) => setWastageQuantity(e.target.value)}
                    max={selectedBatch.remainingQuantity}
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max available: {selectedBatch.remainingQuantity} {selectedItem.unit}
                  </p>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason / Notes
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter reason for wastage..."
                  />
                </div>

                {/* Cost Impact */}
                {totalWastageCost > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-sm font-medium text-red-900">Estimated Cost Loss</div>
                    <div className="text-xl font-bold text-red-700">
                      ₹{totalWastageCost.toFixed(2)}
                    </div>
                  </div>
                )}

                {/* Record Button */}
                <button
                  onClick={handleRecordWastage}
                  disabled={!wastageQuantity || parseFloat(wastageQuantity) <= 0}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Record Wastage
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <p className="text-sm">Select an item, drag batch to wastage bin, or click bin to select category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <HelpButton module="perishable-inventory" />

      {/* Bulk Wastage Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bulk Record Wastage</h3>
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkItems([{ itemId: '', itemName: '', batchId: '', quantity: '', category: 'expired', reason: '' }]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">Items to Record as Wastage</h4>
                  <button
                    type="button"
                    onClick={() => setBulkItems([...bulkItems, { itemId: '', itemName: '', batchId: '', quantity: '', category: 'expired', reason: '' }])}
                    className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium"
                  >
                    + Add Row
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bulkItems.map((bulkItem, index) => {
                    const item = items.find(i => i.id === bulkItem.itemId);
                    const itemBatches = item ? getBatchesForItem(item.id) : [];
                    return (
                      <div key={index} className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-amber-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs font-semibold text-gray-600">Item {index + 1}</span>
                          {bulkItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setBulkItems(bulkItems.filter((_, i) => i !== index))}
                              className="text-amber-600 hover:text-amber-700 p-1 hover:bg-amber-50 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Item *</label>
                            <select
                              value={bulkItem.itemId}
                              onChange={(e) => {
                                const updated = [...bulkItems];
                                const selectedItem = items.find(i => i.id === e.target.value);
                                updated[index] = {
                                  ...updated[index],
                                  itemId: e.target.value,
                                  itemName: selectedItem?.name || '',
                                  batchId: '',
                                };
                                setBulkItems(updated);
                              }}
                              required
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                              <option value="">Select item</option>
                              {items.filter(i => i.currentStock > 0).map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name} ({item.unit})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Batch *</label>
                            <select
                              value={bulkItem.batchId}
                              onChange={(e) => {
                                const updated = [...bulkItems];
                                updated[index] = { ...updated[index], batchId: e.target.value };
                                setBulkItems(updated);
                              }}
                              required
                              disabled={!bulkItem.itemId}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
                            >
                              <option value="">Select batch</option>
                              {itemBatches.map((batch) => (
                                <option key={batch.id} value={batch.id}>
                                  {batch.batchNumber || 'N/A'} - {batch.remainingQuantity} {item?.unit} left
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Quantity *</label>
                            <input
                              type="number"
                              step="0.01"
                              value={bulkItem.quantity}
                              onChange={(e) => {
                                const updated = [...bulkItems];
                                updated[index] = { ...updated[index], quantity: e.target.value };
                                setBulkItems(updated);
                              }}
                              required
                              min="0.01"
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                            <select
                              value={bulkItem.category}
                              onChange={(e) => {
                                const updated = [...bulkItems];
                                updated[index] = { ...updated[index], category: e.target.value as WastageCategory };
                                setBulkItems(updated);
                              }}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                              <option value="expired">Expired</option>
                              <option value="spoiled">Spoiled</option>
                              <option value="damaged">Damaged</option>
                              <option value="overstock">Overstock</option>
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Reason *</label>
                            <input
                              type="text"
                              value={bulkItem.reason}
                              onChange={(e) => {
                                const updated = [...bulkItems];
                                updated[index] = { ...updated[index], reason: e.target.value };
                                setBulkItems(updated);
                              }}
                              required
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                              placeholder="Enter reason..."
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowBulkModal(false);
                    setBulkItems([{ itemId: '', itemName: '', batchId: '', quantity: '', category: 'expired', reason: '' }]);
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const validItems = bulkItems.filter(b => b.itemId && b.batchId && b.quantity && b.reason);
                    if (validItems.length === 0) {
                      alert('Please fill all required fields');
                      return;
                    }

                    let successCount = 0;
                    validItems.forEach((bulkItem) => {
                      const item = items.find(i => i.id === bulkItem.itemId);
                      const batch = batches.find(b => b.id === bulkItem.batchId);
                      if (!item || !batch) return;

                      const quantity = parseFloat(bulkItem.quantity);
                      if (quantity <= 0 || quantity > batch.remainingQuantity) return;

                      const updatedBatch: StockBatch = {
                        ...batch,
                        remainingQuantity: batch.remainingQuantity - quantity,
                        status: batch.remainingQuantity - quantity === 0 ? 'wasted' : batch.status,
                      };
                      saveStockBatch(updatedBatch);
                      updateItemStock(item.id);

                      saveStockMovement({
                        id: `movement-${Date.now()}-${Math.random()}`,
                        itemId: item.id,
                        batchId: batch.id,
                        type: 'wastage',
                        quantity: quantity,
                        date: new Date().toISOString(),
                        reason: bulkItem.reason,
                        wastageCategory: bulkItem.category,
                        createdBy: 'Admin',
                      });

                      successCount++;
                    });

                    alert(`Successfully recorded wastage for ${successCount} item(s)!`);
                    setShowBulkModal(false);
                    setBulkItems([{ itemId: '', itemName: '', batchId: '', quantity: '', category: 'expired', reason: '' }]);
                    loadData();
                  }}
                  className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium"
                >
                  Record Wastage for {bulkItems.filter(b => b.itemId && b.batchId && b.quantity && b.reason).length} Item(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}

