'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllInventoryItems,
  getAllStockBatches,
  getAllStockMovements,
  getFIFOBatch,
  saveStockBatch,
  saveStockMovement,
  updateItemStock,
  InventoryItem,
  StockBatch,
  StockMovement,
} from '../inventoryData';

type ReworkType = 'return' | 'correction' | 'reprocess';

export default function ReworkStockPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [batches, setBatches] = useState<StockBatch[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<StockBatch | null>(null);
  const [reworkType, setReworkType] = useState<ReworkType>('return');
  const [reworkQuantity, setReworkQuantity] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [originalMovementId, setOriginalMovementId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkItems, setBulkItems] = useState<Array<{
    itemId: string;
    itemName: string;
    batchId: string;
    quantity: string;
    reworkType: ReworkType;
    reason: string;
  }>>([{ itemId: '', itemName: '', batchId: '', quantity: '', reworkType: 'return', reason: '' }]);

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

  const handleItemSelect = (item: InventoryItem) => {
    setSelectedItem(item);
    const fifoBatch = getFIFOBatch(item.id, 1);
    setSelectedBatch(fifoBatch);
    
    // Find recent issue movements for this item
    const recentIssues = movements
      .filter(m => m.itemId === item.id && m.type === 'issue')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    
    if (recentIssues.length > 0) {
      setOriginalMovementId(recentIssues[0].id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !selectedBatch || !reworkQuantity) return;

    setIsSubmitting(true);

    try {
      const quantity = parseFloat(reworkQuantity);

      if (quantity <= 0) {
        alert('Quantity must be greater than 0');
        setIsSubmitting(false);
        return;
      }

      // Update batch - add back the quantity
      const updatedBatch: StockBatch = {
        ...selectedBatch,
        remainingQuantity: selectedBatch.remainingQuantity + quantity,
        status: 'active',
      };
      saveStockBatch(updatedBatch);

      // Update item stock
      const updatedItem: InventoryItem = {
        ...selectedItem,
        currentStock: selectedItem.currentStock + quantity,
      };
      // updateItemStock expects an itemId string
      updateItemStock(updatedItem.id);

      // Record rework movement
      saveStockMovement({
        id: `rework-${Date.now()}`,
        itemId: selectedItem.id,
        batchId: selectedBatch.id,
        type: 'rework',
        quantity: quantity,
        date: new Date().toISOString(),
        reason: reason || undefined,
        reworkType: reworkType,
        originalMovementId: originalMovementId || undefined,
        createdBy: 'Admin',
        notes: `Rework: ${reworkType} - ${reason || 'No reason provided'}`,
      });

      // Reset form
      setSelectedItem(null);
      setSelectedBatch(null);
      setReworkQuantity('');
      setReason('');
      setOriginalMovementId('');
      setReworkType('return');

      alert('Stock rework recorded successfully!');
      loadData();
    } catch (error) {
      console.error('Error recording rework:', error);
      alert('Error recording rework. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const recentIssues = selectedItem
    ? movements
        .filter(m => m.itemId === selectedItem.id && m.type === 'issue')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)
    : [];

  return (
    <ModuleLayout
      title={
        <div className="flex items-center justify-between w-full">
          <span>Rework Stock</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowBulkModal(true);
                setSelectedItem(null);
              }}
              className="px-4 py-2 bg-white border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-all text-sm font-medium"
            >
              Bulk Rework
            </button>
            <button
              onClick={() => {
                setShowAddModal(true);
                setSelectedItem(null);
              }}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm font-medium shadow-md"
            >
              + Rework Stock
            </button>
          </div>
        </div>
      }
      description="Return, correct, or reprocess issued stock items"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Item Selection */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Item</h3>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemSelect(item)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedItem?.id === item.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-600">{item.category} • {item.unit}</div>
                  <div className="text-xs text-gray-500">Current: {item.currentStock}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Issues */}
          {selectedItem && recentIssues.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Issues</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recentIssues.map((movement) => {
                  const batch = batches.find(b => b.id === movement.batchId);
                  return (
                    <div
                      key={movement.id}
                      onClick={() => {
                        setOriginalMovementId(movement.id);
                        if (batch) setSelectedBatch(batch);
                      }}
                      className={`p-2 rounded-lg border cursor-pointer text-xs ${
                        originalMovementId === movement.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">
                        {movement.quantity} {selectedItem.unit}
                      </div>
                      <div className="text-gray-600">
                        {new Date(movement.date).toLocaleDateString()} • {movement.reason || 'No reason'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Rework Form */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rework Details</h3>

          {selectedItem ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected Item Display */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{selectedItem.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedItem.category} • {selectedItem.unit} • Location: {selectedItem.location}
                    </div>
                    {selectedBatch && (
                      <div className="text-xs text-gray-500 mt-1">
                        Batch: {selectedBatch.batchNumber || 'N/A'} • 
                        Remaining: {selectedBatch.remainingQuantity} {selectedItem.unit}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rework Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rework Type *</label>
                <select
                  value={reworkType}
                  onChange={(e) => setReworkType(e.target.value as ReworkType)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="return">Return (Item returned from kitchen/usage)</option>
                  <option value="correction">Correction (Wrong issue quantity corrected)</option>
                  <option value="reprocess">Reprocess (Item needs reprocessing)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {reworkType === 'return' && 'Items issued but returned unused'}
                  {reworkType === 'correction' && 'Correcting a previous issue error'}
                  {reworkType === 'reprocess' && 'Items that need to be reprocessed'}
                </p>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Rework ({selectedItem.unit}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={reworkQuantity}
                  onChange={(e) => setReworkQuantity(e.target.value)}
                  required
                  min="0.01"
                  max={selectedBatch ? selectedBatch.quantity : undefined}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="0.00"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Explain why this stock is being reworked..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing Rework...' : 'Record Rework'}
              </button>
            </form>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p className="text-sm">Select an item to record rework</p>
            </div>
          )}
        </div>
      </div>

      <HelpButton module="perishable-inventory" />

      {/* Bulk Rework Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bulk Rework Stock</h3>
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkItems([{ itemId: '', itemName: '', batchId: '', quantity: '', reworkType: 'return', reason: '' }]);
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
                  <h4 className="text-sm font-semibold text-gray-700">Items to Rework</h4>
                  <button
                    type="button"
                    onClick={() => setBulkItems([...bulkItems, { itemId: '', itemName: '', batchId: '', quantity: '', reworkType: 'return', reason: '' }])}
                    className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium"
                  >
                    + Add Row
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bulkItems.map((bulkItem, index) => {
                    const item = items.find(i => i.id === bulkItem.itemId);
                    const batch = batches.find(b => b.id === bulkItem.batchId);
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
                                const fifoBatch = getFIFOBatch(e.target.value, 1);
                                updated[index] = {
                                  ...updated[index],
                                  itemId: e.target.value,
                                  itemName: selectedItem?.name || '',
                                  batchId: fifoBatch?.id || '',
                                };
                                setBulkItems(updated);
                              }}
                              required
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                              <option value="">Select item</option>
                              {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name} ({item.unit})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Rework Type *</label>
                            <select
                              value={bulkItem.reworkType}
                              onChange={(e) => {
                                const updated = [...bulkItems];
                                updated[index] = { ...updated[index], reworkType: e.target.value as ReworkType };
                                setBulkItems(updated);
                              }}
                              required
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                              <option value="return">Return</option>
                              <option value="correction">Correction</option>
                              <option value="reprocess">Reprocess</option>
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
                              placeholder="Reason for rework"
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
                    setBulkItems([{ itemId: '', itemName: '', batchId: '', quantity: '', reworkType: 'return', reason: '' }]);
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const validItems = bulkItems.filter(b => b.itemId && b.quantity && b.reason);
                    if (validItems.length === 0) {
                      alert('Please add at least one valid item');
                      return;
                    }

                    let successCount = 0;
                    validItems.forEach((bulkItem) => {
                      const item = items.find(i => i.id === bulkItem.itemId);
                      const batch = batches.find(b => b.id === bulkItem.batchId);
                      if (!item || !batch) return;

                      const quantity = parseFloat(bulkItem.quantity);
                      if (quantity <= 0) return;

                      try {
                        const updatedBatch: StockBatch = {
                          ...batch,
                          remainingQuantity: batch.remainingQuantity + quantity,
                          status: 'active',
                        };
                        saveStockBatch(updatedBatch);
                        const updatedItem: InventoryItem = {
                          ...item,
                          currentStock: item.currentStock + quantity,
                        };
                        updateItemStock(updatedItem.id);
                        saveStockMovement({
                          id: `rework-${Date.now()}-${Math.random()}`,
                          itemId: item.id,
                          batchId: batch.id,
                          type: 'rework',
                          quantity: quantity,
                          date: new Date().toISOString(),
                          reason: bulkItem.reason,
                          reworkType: bulkItem.reworkType,
                          createdBy: 'Admin',
                        });
                        successCount++;
                      } catch (error) {
                        console.error('Error recording rework:', error);
                      }
                    });

                    setShowBulkModal(false);
                    setBulkItems([{ itemId: '', itemName: '', batchId: '', quantity: '', reworkType: 'return', reason: '' }]);
                    alert(`Successfully recorded rework for ${successCount} item(s)!`);
                    loadData();
                  }}
                  className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium"
                >
                  Record Rework for {bulkItems.filter(b => b.itemId && b.quantity && b.reason).length} Item(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}

