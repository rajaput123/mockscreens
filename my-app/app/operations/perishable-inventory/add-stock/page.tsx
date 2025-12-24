'use client';

import { useState, useEffect, DragEvent } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllInventoryItems,
  saveInventoryItem,
  saveStockBatch,
  saveStockMovement,
  InventoryItem,
  StockBatch,
} from '../inventoryData';

export default function AddStockPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [formData, setFormData] = useState({
    batchNumber: '',
    quantity: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    purchasePrice: '',
    supplier: '',
    notes: '',
  });
  const [newItemData, setNewItemData] = useState({
    name: '',
    category: 'vegetables' as 'vegetables' | 'grains' | 'spices' | 'dairy' | 'fruits' | 'other',
    unit: 'kg' as 'kg' | 'liters' | 'pieces' | 'packets',
    minStockLevel: '',
    maxStockLevel: '',
    location: '',
    supplier: '',
    costPerUnit: '',
    expiryDays: '',
  });
  const [bulkItems, setBulkItems] = useState<Array<{
    itemId: string;
    itemName: string;
    quantity: string;
    batchNumber: string;
    purchasePrice: string;
    expiryDate: string;
  }>>([{ itemId: '', itemName: '', quantity: '', batchNumber: '', purchasePrice: '', expiryDate: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allItems = getAllInventoryItems();
    setItems(allItems);
  };

  const locations = Array.from(new Set(items.map(item => item.location)));

  const handleItemSelect = (item: InventoryItem) => {
    setSelectedItem(item);
    setSelectedLocation(item.location);
    
    // Auto-calculate expiry date based on item's expiryDays
    if (item.expiryDays) {
      const purchaseDate = new Date(formData.purchaseDate);
      const expiryDate = new Date(purchaseDate);
      expiryDate.setDate(expiryDate.getDate() + item.expiryDays);
      setFormData(prev => ({
        ...prev,
        expiryDate: expiryDate.toISOString().split('T')[0],
      }));
    }
  };

  const handleAddNewItem = () => {
    if (!newItemData.name || !newItemData.minStockLevel || !newItemData.maxStockLevel || !newItemData.location) {
      alert('Please fill all required fields for the new item');
      return;
    }

    try {
      const newItem: InventoryItem = {
        id: `item-${Date.now()}`,
        name: newItemData.name,
        category: newItemData.category,
        unit: newItemData.unit,
        currentStock: 0,
        minStockLevel: parseFloat(newItemData.minStockLevel),
        maxStockLevel: parseFloat(newItemData.maxStockLevel),
        location: newItemData.location,
        supplier: newItemData.supplier || undefined,
        costPerUnit: parseFloat(newItemData.costPerUnit) || 0,
        lastRestocked: new Date().toISOString(),
        expiryDays: parseFloat(newItemData.expiryDays) || 0,
        createdAt: new Date().toISOString(),
        createdBy: 'Admin',
      };

      saveInventoryItem(newItem);
      loadData();
      
      // Select the newly created item
      setSelectedItem(newItem);
      setSelectedLocation(newItem.location);
      setShowAddItemModal(false);
      
      // Reset new item form
      setNewItemData({
        name: '',
        category: 'vegetables',
        unit: 'kg',
        minStockLevel: '',
        maxStockLevel: '',
        location: '',
        supplier: '',
        costPerUnit: '',
        expiryDays: '',
      });
    } catch (error) {
      console.error('Error adding new item:', error);
      alert('Error adding new item. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsSubmitting(true);

    try {
      const quantity = parseFloat(formData.quantity);
      const purchasePrice = parseFloat(formData.purchasePrice);

      // Create new batch
      const newBatch: StockBatch = {
        id: `batch-${Date.now()}`,
        itemId: selectedItem.id,
        batchNumber: formData.batchNumber || undefined,
        quantity: quantity,
        remainingQuantity: quantity,
        purchaseDate: formData.purchaseDate,
        expiryDate: formData.expiryDate,
        purchasePrice: purchasePrice,
        supplier: formData.supplier || undefined,
        location: selectedLocation || selectedItem.location,
        status: 'active',
        createdAt: new Date().toISOString(),
        createdBy: 'Admin', // TODO: Get from auth
      };

      saveStockBatch(newBatch);

      // Update item stock
      const updatedItem: InventoryItem = {
        ...selectedItem,
        currentStock: selectedItem.currentStock + quantity,
        lastRestocked: new Date().toISOString(),
        location: selectedLocation || selectedItem.location,
        costPerUnit: purchasePrice / quantity,
      };
      saveInventoryItem(updatedItem);

      // Record movement
      saveStockMovement({
        id: `movement-${Date.now()}`,
        itemId: selectedItem.id,
        batchId: newBatch.id,
        type: 'add',
        quantity: quantity,
        date: new Date().toISOString(),
        reason: 'Stock addition',
        createdBy: 'Admin',
        notes: formData.notes || undefined,
      });

      // Reset form
      setFormData({
        batchNumber: '',
        quantity: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        purchasePrice: '',
        supplier: '',
        notes: '',
      });
      setSelectedItem(null);
      setSelectedLocation('');

      alert('Stock added successfully!');
      loadData();
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Error adding stock. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkAdd = () => {
    const validItems = bulkItems.filter(b => b.itemId && b.quantity && b.purchasePrice);
    if (validItems.length === 0) {
      alert('Please add at least one item with quantity and price');
      return;
    }

    setIsSubmitting(true);

    try {
      let successCount = 0;
      const commonDate = formData.purchaseDate;

      validItems.forEach((bulkItem) => {
        const item = items.find(i => i.id === bulkItem.itemId);
        if (!item) return;

        const quantity = parseFloat(bulkItem.quantity);
        const purchasePrice = parseFloat(bulkItem.purchasePrice);

        // Create batch
        const newBatch: StockBatch = {
          id: `batch-${Date.now()}-${Math.random()}`,
          itemId: item.id,
          batchNumber: bulkItem.batchNumber || undefined,
          quantity: quantity,
          remainingQuantity: quantity,
          purchaseDate: commonDate,
          expiryDate: bulkItem.expiryDate || formData.expiryDate,
          purchasePrice: purchasePrice,
          supplier: formData.supplier || undefined,
          location: selectedLocation || item.location,
          status: 'active',
          createdAt: new Date().toISOString(),
          createdBy: 'Admin',
        };

        saveStockBatch(newBatch);

        // Update item stock
        const updatedItem: InventoryItem = {
          ...item,
          currentStock: item.currentStock + quantity,
          lastRestocked: new Date().toISOString(),
          location: selectedLocation || item.location,
          costPerUnit: purchasePrice / quantity,
        };
        saveInventoryItem(updatedItem);

        // Record movement
        saveStockMovement({
          id: `movement-${Date.now()}-${Math.random()}`,
          itemId: item.id,
          batchId: newBatch.id,
          type: 'add',
          quantity: quantity,
          date: new Date().toISOString(),
          reason: 'Bulk stock addition',
          createdBy: 'Admin',
          notes: formData.notes || undefined,
        });

        successCount++;
      });

      // Reset forms
      setBulkItems([{ itemId: '', itemName: '', quantity: '', batchNumber: '', purchasePrice: '', expiryDate: '' }]);
      setFormData({
        batchNumber: '',
        quantity: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        purchasePrice: '',
        supplier: '',
        notes: '',
      });
      setSelectedLocation('');
      setShowBulkAddModal(false);

      alert(`Successfully added stock for ${successCount} item(s)!`);
      loadData();
    } catch (error) {
      console.error('Error adding bulk stock:', error);
      alert('Error adding bulk stock. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addBulkRow = () => {
    setBulkItems([...bulkItems, { itemId: '', itemName: '', quantity: '', batchNumber: '', purchasePrice: '', expiryDate: '' }]);
  };

  const removeBulkRow = (index: number) => {
    if (bulkItems.length > 1) {
      setBulkItems(bulkItems.filter((_, i) => i !== index));
    }
  };

  const updateBulkItem = (index: number, field: string, value: string) => {
    const updated = [...bulkItems];
    if (field === 'itemId') {
      const item = items.find(i => i.id === value);
      updated[index] = {
        ...updated[index],
        itemId: value,
        itemName: item?.name || '',
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setBulkItems(updated);
  };

  return (
    <ModuleLayout
      title={
        <div className="flex items-center justify-between w-full">
          <span>Add Stock</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowBulkAddModal(true);
                setSelectedItem(null);
              }}
              className="px-4 py-2 bg-white border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-all text-sm font-medium"
            >
              Bulk Add
            </button>
            <button
              onClick={() => {
                setShowAddItemModal(true);
                setSelectedItem(null);
              }}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm font-medium shadow-md"
            >
              + Add New Item
            </button>
          </div>
        </div>
      }
      description="Add new inventory stock with batch tracking"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Item Selection */}
        <div className="space-y-6">
          {/* Item Palette */}
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
        </div>

        {/* Right: Form */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Details</h3>

          {selectedItem ? (
            /* Bulk Add Form */
            <div className="space-y-4">
              {/* Common Fields */}
              <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-200">
                <h4 className="text-sm font-semibold text-amber-900 mb-3">Common Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date *</label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Storage Location</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Supplier name"
                    />
                  </div>
                </div>
              </div>

              {/* Bulk Items List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">Items to Add</h4>
                  <button
                    type="button"
                    onClick={addBulkRow}
                    className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium"
                  >
                    + Add Row
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bulkItems.map((bulkItem, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-amber-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-600">Item {index + 1}</span>
                        <div className="flex gap-2">
                          {bulkItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBulkRow(index)}
                              className="text-amber-600 hover:text-amber-700 p-1 hover:bg-amber-50 rounded"
                              title="Remove row"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Item *</label>
                          <select
                            value={bulkItem.itemId}
                            onChange={(e) => updateBulkItem(index, 'itemId', e.target.value)}
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
                            onChange={(e) => updateBulkItem(index, 'quantity', e.target.value)}
                            required
                            min="0"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Purchase Price (₹) *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={bulkItem.purchasePrice}
                            onChange={(e) => updateBulkItem(index, 'purchasePrice', e.target.value)}
                            required
                            min="0"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Batch Number</label>
                          <input
                            type="text"
                            value={bulkItem.batchNumber}
                            onChange={(e) => updateBulkItem(index, 'batchNumber', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Optional"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date (if different)</label>
                          <input
                            type="date"
                            value={bulkItem.expiryDate}
                            onChange={(e) => updateBulkItem(index, 'expiryDate', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Additional notes for all items..."
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleBulkAdd}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding Stock...' : `Add Stock for ${bulkItems.filter(b => b.itemId && b.quantity && b.purchasePrice).length} Item(s)`}
              </button>
            </div>
          ) : selectedItem ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected Item Display */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{(selectedItem as any).name}</div>
                    <div className="text-sm text-gray-600">
                      {(selectedItem as any).category} • {(selectedItem as any).unit}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItem(null);
                      setSelectedLocation('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Location Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Location *
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="e.g., RICE-2024-001"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity ({(selectedItem as any).unit}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Purchase Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, purchaseDate: e.target.value }));
                    // Recalculate expiry date
                    if ((selectedItem as any).expiryDays) {
                      const purchaseDate = new Date(e.target.value);
                      const expiryDate = new Date(purchaseDate);
                      expiryDate.setDate(expiryDate.getDate() + (selectedItem as any).expiryDays);
                      setFormData(prev => ({ ...prev, expiryDate: expiryDate.toISOString().split('T')[0] }));
                    }
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Purchase Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price (Total) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                {formData.quantity && formData.purchasePrice && (
                  <p className="text-xs text-gray-500 mt-1">
                    Per unit: ₹{(parseFloat(formData.purchasePrice) / parseFloat(formData.quantity)).toFixed(2)}
                  </p>
                )}
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier (Optional)
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Supplier name"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Additional notes..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding Stock...' : 'Add Stock'}
              </button>
            </form>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-sm">Select an item from the list or drag to shelf location</p>
            </div>
          )}
        </div>
      </div>

      <HelpButton module="perishable-inventory" />

      {/* Add New Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>
              <button
                onClick={() => {
                  setShowAddItemModal(false);
                  setNewItemData({
                    name: '',
                    category: 'vegetables',
                    unit: 'kg',
                    minStockLevel: '',
                    maxStockLevel: '',
                    location: '',
                    supplier: '',
                    costPerUnit: '',
                    expiryDays: '',
                  });
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                <input
                  type="text"
                  value={newItemData.name}
                  onChange={(e) => setNewItemData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="e.g., Rice, Dal, Tomatoes"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={newItemData.category}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="grains">Grains</option>
                    <option value="spices">Spices</option>
                    <option value="dairy">Dairy</option>
                    <option value="fruits">Fruits</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                  <select
                    value={newItemData.unit}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, unit: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="liters">Liters</option>
                    <option value="pieces">Pieces</option>
                    <option value="packets">Packets</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Stock Level *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItemData.minStockLevel}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, minStockLevel: e.target.value }))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Stock Level *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItemData.maxStockLevel}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, maxStockLevel: e.target.value }))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Storage Location *</label>
                <input
                  type="text"
                  value={newItemData.location}
                  onChange={(e) => setNewItemData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="e.g., Dry Storage A, Cold Storage"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost Per Unit (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItemData.costPerUnit}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, costPerUnit: e.target.value }))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Days</label>
                  <input
                    type="number"
                    value={newItemData.expiryDays}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, expiryDays: e.target.value }))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Supplier</label>
                <input
                  type="text"
                  value={newItemData.supplier}
                  onChange={(e) => setNewItemData(prev => ({ ...prev, supplier: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Supplier name"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddItemModal(false);
                    setNewItemData({
                      name: '',
                      category: 'vegetables',
                      unit: 'kg',
                      minStockLevel: '',
                      maxStockLevel: '',
                      location: '',
                      supplier: '',
                      costPerUnit: '',
                      expiryDays: '',
                    });
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewItem}
                  className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium"
                >
                  Create Item & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {showBulkAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bulk Stock Details</h3>
              <button
                onClick={() => {
                  setShowBulkAddModal(false);
                  setBulkItems([{ itemId: '', itemName: '', quantity: '', batchNumber: '', purchasePrice: '', expiryDate: '' }]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Common Fields */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h4 className="text-sm font-semibold text-amber-900 mb-3">Common Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date *</label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Storage Location</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Supplier name"
                    />
                  </div>
                </div>
              </div>

              {/* Bulk Items List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">Items to Add</h4>
                  <button
                    type="button"
                    onClick={addBulkRow}
                    className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium"
                  >
                    + Add Row
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bulkItems.map((bulkItem, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-amber-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-600">Item {index + 1}</span>
                        <div className="flex gap-2">
                          {bulkItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBulkRow(index)}
                              className="text-amber-600 hover:text-amber-700 p-1 hover:bg-amber-50 rounded"
                              title="Remove row"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Item *</label>
                          <select
                            value={bulkItem.itemId}
                            onChange={(e) => updateBulkItem(index, 'itemId', e.target.value)}
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
                            onChange={(e) => updateBulkItem(index, 'quantity', e.target.value)}
                            required
                            min="0"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Purchase Price (₹) *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={bulkItem.purchasePrice}
                            onChange={(e) => updateBulkItem(index, 'purchasePrice', e.target.value)}
                            required
                            min="0"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Batch Number</label>
                          <input
                            type="text"
                            value={bulkItem.batchNumber}
                            onChange={(e) => updateBulkItem(index, 'batchNumber', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Optional"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date (if different)</label>
                          <input
                            type="date"
                            value={bulkItem.expiryDate}
                            onChange={(e) => updateBulkItem(index, 'expiryDate', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Additional notes for all items..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowBulkAddModal(false);
                    setBulkItems([{ itemId: '', itemName: '', quantity: '', batchNumber: '', purchasePrice: '', expiryDate: '' }]);
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkAdd}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding Stock...' : `Add Stock for ${bulkItems.filter(b => b.itemId && b.quantity && b.purchasePrice).length} Item(s)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}

