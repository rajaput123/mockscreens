'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import {
  getAllInventoryItems,
  saveStockRequest,
  InventoryItem,
  StockRequest,
} from '../inventoryData';

export default function RequestStockPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    quantity: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    reason: '',
    location: '',
    supplier: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkItems, setBulkItems] = useState<Array<{
    itemId: string;
    itemName: string;
    quantity: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    reason: string;
  }>>([{ itemId: '', itemName: '', quantity: '', priority: 'medium', reason: '' }]);

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
    setFormData(prev => ({
      ...prev,
      location: item.location,
    }));
  };

  const calculateEstimatedCost = (): number => {
    if (!selectedItem || !formData.quantity) return 0;
    const quantity = parseFloat(formData.quantity);
    return selectedItem.costPerUnit * quantity;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsSubmitting(true);

    try {
      const quantity = parseFloat(formData.quantity);
      const estimatedCost = calculateEstimatedCost();

      const newRequest: StockRequest = {
        id: `request-${Date.now()}`,
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        category: selectedItem.category,
        unit: selectedItem.unit,
        requestedQuantity: quantity,
        estimatedCost: estimatedCost,
        priority: formData.priority,
        reason: formData.reason,
        requestedBy: 'Admin', // TODO: Get from auth
        requestedDate: new Date().toISOString(),
        status: 'pending',
        location: formData.location || selectedItem.location,
        supplier: formData.supplier || undefined,
        notes: formData.notes || undefined,
      };

      saveStockRequest(newRequest);

      // Reset form
      setFormData({
        quantity: '',
        priority: 'medium',
        reason: '',
        location: '',
        supplier: '',
        notes: '',
      });
      setSelectedItem(null);

      alert('Stock request submitted successfully! It will be reviewed by Finance.');
      router.push('/operations/perishable-inventory');
    } catch (error) {
      console.error('Error submitting stock request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModuleLayout
      title={
        <div className="flex items-center justify-between w-full">
          <span>Request Stock</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowBulkModal(true);
                setSelectedItem(null);
              }}
              className="px-4 py-2 bg-white border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-all text-sm font-medium"
            >
              Bulk Request
            </button>
            <button
              onClick={() => {
                setShowAddModal(true);
                setSelectedItem(null);
              }}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm font-medium shadow-md"
            >
              + Request Stock
            </button>
          </div>
        </div>
      }
      description="Submit a stock request for finance approval"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Stock Request Form</h3>

          {selectedItem ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selected Item Display */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{selectedItem.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedItem.category} • {selectedItem.unit} • Current Stock: {selectedItem.currentStock}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Cost per unit: ₹{selectedItem.costPerUnit}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItem(null);
                      setFormData(prev => ({ ...prev, location: '' }));
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested Quantity ({selectedItem.unit}) *
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

              {/* Estimated Cost Display */}
              {formData.quantity && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Estimated Cost:</span>
                    <span className="text-lg font-bold text-amber-600">
                      ₹{calculateEstimatedCost().toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Request *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Explain why this stock is needed..."
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
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

              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Supplier (Optional)
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
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Any additional information..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Select Item to Request</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                      item.currentStock <= item.minStockLevel
                        ? 'border-red-300 bg-red-50 hover:border-red-400'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-600">{item.category} • {item.unit}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Current: {item.currentStock} | Min: {item.minStockLevel}
                    </div>
                    {item.currentStock <= item.minStockLevel && (
                      <div className="text-xs text-red-600 font-semibold mt-1">⚠️ Low Stock</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Bulk Request Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bulk Stock Request</h3>
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkItems([{ itemId: '', itemName: '', quantity: '', priority: 'medium', reason: '' }]);
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
                  <h4 className="text-sm font-semibold text-gray-700">Items to Request</h4>
                  <button
                    type="button"
                    onClick={() => setBulkItems([...bulkItems, { itemId: '', itemName: '', quantity: '', priority: 'medium', reason: '' }])}
                    className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium"
                  >
                    + Add Row
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bulkItems.map((bulkItem, index) => {
                    const item = items.find(i => i.id === bulkItem.itemId);
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
                            <label className="block text-xs font-medium text-gray-700 mb-1">Priority *</label>
                            <select
                              value={bulkItem.priority}
                              onChange={(e) => {
                                const updated = [...bulkItems];
                                updated[index] = { ...updated[index], priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' };
                                setBulkItems(updated);
                              }}
                              required
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                            </select>
                          </div>
                          <div>
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
                              placeholder="Reason for request"
                            />
                          </div>
                        </div>
                        {item && bulkItem.quantity && (
                          <div className="mt-2 text-xs text-gray-600">
                            Estimated Cost: ₹{(item.costPerUnit * parseFloat(bulkItem.quantity)).toFixed(2)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowBulkModal(false);
                    setBulkItems([{ itemId: '', itemName: '', quantity: '', priority: 'medium', reason: '' }]);
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
                      if (!item) return;

                      const quantity = parseFloat(bulkItem.quantity);
                      const estimatedCost = item.costPerUnit * quantity;

                      try {
                        const newRequest: StockRequest = {
                          id: `request-${Date.now()}-${Math.random()}`,
                          itemId: item.id,
                          itemName: item.name,
                          category: item.category,
                          unit: item.unit,
                          requestedQuantity: quantity,
                          estimatedCost: estimatedCost,
                          priority: bulkItem.priority,
                          reason: bulkItem.reason,
                          requestedBy: 'Admin',
                          requestedDate: new Date().toISOString(),
                          status: 'pending',
                          location: item.location,
                          supplier: item.supplier || undefined,
                        };
                        saveStockRequest(newRequest);
                        successCount++;
                      } catch (error) {
                        console.error('Error submitting stock request:', error);
                      }
                    });

                    setShowBulkModal(false);
                    setBulkItems([{ itemId: '', itemName: '', quantity: '', priority: 'medium', reason: '' }]);
                    alert(`Successfully submitted ${successCount} stock request(s)! They will be reviewed by Finance.`);
                    router.push('/operations/perishable-inventory');
                  }}
                  className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium"
                >
                  Submit {bulkItems.filter(b => b.itemId && b.quantity && b.reason).length} Request(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Request Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bulk Stock Request</h3>
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkItems([{ itemId: '', itemName: '', quantity: '', priority: 'medium', reason: '' }]);
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
                  <h4 className="text-sm font-semibold text-gray-700">Items to Request</h4>
                  <button
                    type="button"
                    onClick={() => setBulkItems([...bulkItems, { itemId: '', itemName: '', quantity: '', priority: 'medium', reason: '' }])}
                    className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium"
                  >
                    + Add Row
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bulkItems.map((bulkItem, index) => {
                    const item = items.find(i => i.id === bulkItem.itemId);
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
                                };
                                setBulkItems(updated);
                              }}
                              required
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                              <option value="">Select item</option>
                              {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name} ({item.unit}) - Current: {item.currentStock}
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
                            <label className="block text-xs font-medium text-gray-700 mb-1">Priority *</label>
                            <select
                              value={bulkItem.priority}
                              onChange={(e) => {
                                const updated = [...bulkItems];
                                updated[index] = { ...updated[index], priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' };
                                setBulkItems(updated);
                              }}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Estimated Cost</label>
                            <div className="px-2 py-1.5 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                              ₹{item && bulkItem.quantity ? (item.costPerUnit * parseFloat(bulkItem.quantity)).toFixed(2) : '0.00'}
                            </div>
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
                              placeholder="Enter reason for request..."
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
                    setBulkItems([{ itemId: '', itemName: '', quantity: '', priority: 'medium', reason: '' }]);
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const validItems = bulkItems.filter(b => b.itemId && b.quantity && b.reason);
                    if (validItems.length === 0) {
                      alert('Please fill all required fields');
                      return;
                    }

                    let successCount = 0;
                    validItems.forEach((bulkItem) => {
                      const item = items.find(i => i.id === bulkItem.itemId);
                      if (!item) return;

                      const quantity = parseFloat(bulkItem.quantity);
                      const estimatedCost = item.costPerUnit * quantity;

                      const newRequest: StockRequest = {
                        id: `request-${Date.now()}-${Math.random()}`,
                        itemId: item.id,
                        itemName: item.name,
                        category: item.category,
                        unit: item.unit,
                        requestedQuantity: quantity,
                        estimatedCost: estimatedCost,
                        priority: bulkItem.priority,
                        reason: bulkItem.reason,
                        requestedBy: 'Admin',
                        requestedDate: new Date().toISOString(),
                        status: 'pending',
                        location: item.location,
                        supplier: item.supplier,
                      };

                      saveStockRequest(newRequest);
                      successCount++;
                    });

                    alert(`Successfully submitted ${successCount} stock request(s)! They will be reviewed by Finance.`);
                    setShowBulkModal(false);
                    setBulkItems([{ itemId: '', itemName: '', quantity: '', priority: 'medium', reason: '' }]);
                    router.push('/operations/perishable-inventory');
                  }}
                  className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium"
                >
                  Submit {bulkItems.filter(b => b.itemId && b.quantity && b.reason).length} Request(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}

