'use client';

import { useState, useEffect, DragEvent } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllInventoryItems,
  getAllStockBatches,
  getFIFOBatch,
  saveStockBatch,
  saveStockMovement,
  updateItemStock,
  InventoryItem,
  StockBatch,
} from '../inventoryData';
import { getAllPrasadMenus, PrasadMenu } from '../../kitchen-prasad/prasadData';
import WarehouseShelf from '../components/WarehouseShelf';
import { FoodIcon } from '../../kitchen-prasad/components/FoodIcons';

export default function IssueStockPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [batches, setBatches] = useState<StockBatch[]>([]);
  const [menus, setMenus] = useState<PrasadMenu[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<StockBatch | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<PrasadMenu | null>(null);
  const [issueQuantity, setIssueQuantity] = useState<string>('');
  const [issueTo, setIssueTo] = useState<'kitchen' | 'other'>('kitchen');
  const [otherPurpose, setOtherPurpose] = useState<string>('');
  const [draggedItem, setDraggedItem] = useState<InventoryItem | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkItems, setBulkItems] = useState<Array<{
    itemId: string;
    itemName: string;
    batchId: string;
    quantity: string;
    issueTo: 'kitchen' | 'other';
    menuId?: string;
    otherPurpose?: string;
  }>>([{ itemId: '', itemName: '', batchId: '', quantity: '', issueTo: 'kitchen' }]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allItems = getAllInventoryItems();
    const allBatches = getAllStockBatches();
    const allMenus = getAllPrasadMenus();
    setItems(allItems);
    setBatches(allBatches);
    setMenus(allMenus.filter(m => m.status === 'scheduled' || m.status === 'in-progress'));
  };

  const handleItemSelect = (item: InventoryItem) => {
    setSelectedItem(item);
    const fifoBatch = getFIFOBatch(item.id, 1);
    setSelectedBatch(fifoBatch);
    if (fifoBatch) {
      setIssueQuantity(fifoBatch.remainingQuantity.toString());
    }
  };

  const handleBatchSelect = (batch: StockBatch) => {
    setSelectedBatch(batch);
    setIssueQuantity(batch.remainingQuantity.toString());
  };

  const getAvailableBatches = (itemId: string) => {
    return batches
      .filter(b => b.itemId === itemId && b.status === 'active' && b.remainingQuantity > 0)
      .sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime());
  };

  const handleDragStart = (e: DragEvent, item: InventoryItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e: DragEvent, menuId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredMenu(menuId);
  };

  const handleDrop = (e: DragEvent, menu: PrasadMenu) => {
    e.preventDefault();
    setHoveredMenu(null);

    const itemId = e.dataTransfer.getData('text/plain');
    const item = items.find(i => i.id === itemId);
    
    if (item) {
      setSelectedItem(item);
      setSelectedMenu(menu);
      setIssueTo('kitchen');
      const fifoBatch = getFIFOBatch(item.id, 1);
      setSelectedBatch(fifoBatch);
      if (fifoBatch) {
        setIssueQuantity(Math.min(fifoBatch.remainingQuantity, 10).toString());
      }
    }
  };

  const handleIssue = () => {
    if (!selectedItem || !selectedBatch || !issueQuantity) return;

    const quantity = parseFloat(issueQuantity);
    if (quantity <= 0 || quantity > selectedBatch.remainingQuantity) {
      alert('Invalid quantity');
      return;
    }

    try {
      // Update batch
      const updatedBatch: StockBatch = {
        ...selectedBatch,
        remainingQuantity: selectedBatch.remainingQuantity - quantity,
        status: selectedBatch.remainingQuantity - quantity === 0 ? 'consumed' : 'active',
      };
      saveStockBatch(updatedBatch);

      // Update item stock
      updateItemStock(selectedItem.id);

      // Record movement
      saveStockMovement({
        id: `movement-${Date.now()}`,
        itemId: selectedItem.id,
        batchId: selectedBatch.id,
        type: 'issue',
        quantity: quantity,
        date: new Date().toISOString(),
        reason: issueTo === 'kitchen' && selectedMenu ? `Issued to ${selectedMenu.name}` : otherPurpose || 'Stock issued',
        issuedTo: selectedMenu?.id,
        createdBy: 'Admin',
      });

      alert('Stock issued successfully!');
      
      // Reset
      setSelectedItem(null);
      setSelectedBatch(null);
      setSelectedMenu(null);
      setIssueQuantity('');
      setOtherPurpose('');
      
      loadData();
    } catch (error) {
      console.error('Error issuing stock:', error);
      alert('Error issuing stock. Please try again.');
    }
  };

  return (
    <ModuleLayout
      title={
        <div className="flex items-center justify-between w-full">
          <span>Issue Stock</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowBulkModal(true);
                setSelectedItem(null);
              }}
              className="px-4 py-2 bg-white border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-all text-sm font-medium"
            >
              Bulk Issue
            </button>
            <button
              onClick={() => {
                setShowAddModal(true);
                setSelectedItem(null);
              }}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm font-medium shadow-md"
            >
              + Issue Stock
            </button>
          </div>
        </div>
      }
      description="Issue stock to kitchen or other purposes using FIFO method"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Warehouse Shelf */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Available Stock</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items
                .filter(item => item.currentStock > 0)
                .map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onClick={() => handleItemSelect(item)}
                    className={`p-3 rounded-lg border-2 cursor-move transition-all duration-200 hover:scale-105 ${
                      selectedItem?.id === item.id
                        ? 'border-blue-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-600">
                      {item.currentStock} {item.unit} available
                    </div>
                    <div className="text-xs text-gray-500">{item.location}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Middle: Kitchen Menus */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Issue to Kitchen Menu</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {menus.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No active menus available</p>
                </div>
              ) : (
                menus.map((menu) => (
                  <div
                    key={menu.id}
                    onDragOver={(e) => handleDragOver(e, menu.id)}
                    onDragLeave={() => setHoveredMenu(null)}
                    onDrop={(e) => handleDrop(e, menu)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      hoveredMenu === menu.id
                        ? 'border-blue-500 bg-amber-50 scale-105 shadow-lg'
                        : selectedMenu?.id === menu.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FoodIcon mealType={menu.mealType} size={24} />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{menu.name}</div>
                        <div className="text-xs text-gray-600">
                          {menu.startTime} • {menu.items.length} items
                        </div>
                      </div>
                    </div>
                    {selectedMenu?.id === menu.id && (
                      <div className="mt-2 text-xs text-amber-700 font-medium">
                        Selected for stock issue
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Other Purpose Option */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="issueTo"
                  checked={issueTo === 'other'}
                  onChange={() => {
                    setIssueTo('other');
                    setSelectedMenu(null);
                  }}
                  className="text-amber-600"
                />
                <span className="text-sm text-gray-700">Other Purpose</span>
              </label>
              {issueTo === 'other' && (
                <input
                  type="text"
                  value={otherPurpose}
                  onChange={(e) => setOtherPurpose(e.target.value)}
                  placeholder="Enter purpose..."
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: Issue Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Details</h3>

            {selectedItem ? (
              <div className="space-y-4">
                {/* Selected Item */}
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                  <div className="font-semibold text-gray-900">{selectedItem.name}</div>
                  <div className="text-sm text-gray-600">
                    {selectedItem.category} • {selectedItem.unit}
                  </div>
                  <div className="text-sm text-gray-600">
                    Available: {selectedItem.currentStock} {selectedItem.unit}
                  </div>
                </div>

                {/* Batch Selection (FIFO) */}
                {selectedItem && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Batch (FIFO - First In First Out)
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {getAvailableBatches(selectedItem.id).map((batch) => {
                        const daysUntilExpiry = Math.ceil(
                          (new Date(batch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                        );
                        const isSelected = selectedBatch?.id === batch.id;

                        return (
                          <div
                            key={batch.id}
                            onClick={() => handleBatchSelect(batch)}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? 'border-blue-500 bg-amber-50'
                                : 'border-gray-200 hover:border-amber-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-medium text-sm text-gray-900">
                                {batch.batchNumber || 'No Batch Number'}
                              </div>
                              <div className={`text-xs font-medium ${
                                daysUntilExpiry <= 3 ? 'text-red-600' :
                                daysUntilExpiry <= 7 ? 'text-amber-600' : 'text-amber-600'
                              }`}>
                                {daysUntilExpiry}d left
                              </div>
                            </div>
                            <div className="text-xs text-gray-600">
                              Available: {batch.remainingQuantity} {selectedItem.unit}
                            </div>
                            <div className="text-xs text-gray-500">
                              Purchase: {new Date(batch.purchaseDate).toLocaleDateString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                {selectedBatch && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity to Issue ({selectedItem.unit}) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={issueQuantity}
                      onChange={(e) => setIssueQuantity(e.target.value)}
                      max={selectedBatch.remainingQuantity}
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max available: {selectedBatch.remainingQuantity} {selectedItem.unit}
                    </p>
                  </div>
                )}

                {/* Issue To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue To *
                  </label>
                  {selectedMenu ? (
                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
                      <div className="font-medium text-sm text-gray-900">{selectedMenu.name}</div>
                      <div className="text-xs text-gray-600">
                        {selectedMenu.startTime} • {selectedMenu.mealType}
                      </div>
                    </div>
                  ) : issueTo === 'other' ? (
                    <div className="text-sm text-gray-700">{otherPurpose || 'Other purpose'}</div>
                  ) : (
                    <p className="text-sm text-gray-500">Select a menu or choose other purpose</p>
                  )}
                </div>

                {/* Issue Button */}
                <button
                  onClick={handleIssue}
                  disabled={!selectedBatch || !issueQuantity || (issueTo === 'kitchen' && !selectedMenu) || (issueTo === 'other' && !otherPurpose)}
                  className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Issue Stock
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <p className="text-sm">Select an item from the left or drag to a kitchen menu</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <HelpButton module="perishable-inventory" />

      {/* Bulk Issue Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bulk Issue Stock</h3>
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkItems([{ itemId: '', itemName: '', batchId: '', quantity: '', issueTo: 'kitchen' }]);
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
                  <h4 className="text-sm font-semibold text-gray-700">Items to Issue</h4>
                  <button
                    type="button"
                    onClick={() => setBulkItems([...bulkItems, { itemId: '', itemName: '', batchId: '', quantity: '', issueTo: 'kitchen' }])}
                    className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium"
                  >
                    + Add Row
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bulkItems.map((bulkItem, index) => {
                    const item = items.find(i => i.id === bulkItem.itemId);
                    const availableBatches = batches.filter(b => b.itemId === bulkItem.itemId && b.status === 'active' && b.remainingQuantity > 0);
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
                                  quantity: fifoBatch ? fifoBatch.remainingQuantity.toString() : '',
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
                            <label className="block text-xs font-medium text-gray-700 mb-1">Issue To *</label>
                            <select
                              value={bulkItem.issueTo}
                              onChange={(e) => {
                                const updated = [...bulkItems];
                                updated[index] = { ...updated[index], issueTo: e.target.value as 'kitchen' | 'other' };
                                setBulkItems(updated);
                              }}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                              <option value="kitchen">Kitchen</option>
                              <option value="other">Other Purpose</option>
                            </select>
                          </div>
                          {bulkItem.issueTo === 'other' && (
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Purpose *</label>
                              <input
                                type="text"
                                value={bulkItem.otherPurpose || ''}
                                onChange={(e) => {
                                  const updated = [...bulkItems];
                                  updated[index] = { ...updated[index], otherPurpose: e.target.value };
                                  setBulkItems(updated);
                                }}
                                required
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="Enter purpose"
                              />
                            </div>
                          )}
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
                    setBulkItems([{ itemId: '', itemName: '', batchId: '', quantity: '', issueTo: 'kitchen' }]);
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const validItems = bulkItems.filter(b => b.itemId && b.quantity && (b.issueTo === 'other' ? b.otherPurpose : true));
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
                      if (quantity <= 0 || quantity > batch.remainingQuantity) return;

                      try {
                        const updatedBatch: StockBatch = {
                          ...batch,
                          remainingQuantity: batch.remainingQuantity - quantity,
                          status: batch.remainingQuantity - quantity === 0 ? 'consumed' : 'active',
                        };
                        saveStockBatch(updatedBatch);
                        updateItemStock(item.id);
                        saveStockMovement({
                          id: `movement-${Date.now()}-${Math.random()}`,
                          itemId: item.id,
                          batchId: batch.id,
                          type: 'issue',
                          quantity: quantity,
                          date: new Date().toISOString(),
                          reason: bulkItem.issueTo === 'kitchen' ? 'Issued to kitchen' : bulkItem.otherPurpose || 'Stock issued',
                          createdBy: 'Admin',
                        });
                        successCount++;
                      } catch (error) {
                        console.error('Error issuing stock:', error);
                      }
                    });

                    setShowBulkModal(false);
                    setBulkItems([{ itemId: '', itemName: '', batchId: '', quantity: '', issueTo: 'kitchen' }]);
                    alert(`Successfully issued stock for ${successCount} item(s)!`);
                    loadData();
                  }}
                  className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium"
                >
                  Issue Stock for {bulkItems.filter(b => b.itemId && b.quantity).length} Item(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}

