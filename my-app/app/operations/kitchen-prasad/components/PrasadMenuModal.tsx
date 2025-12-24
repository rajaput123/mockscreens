'use client';

import { useState, useEffect } from 'react';
import { KitchenPlan, PrasadItem, saveKitchenPlan } from '../prasadData';
import { checkStockAvailability } from '../../perishable-inventory/utils/kitchenIntegration';
import { PRASAD_CATEGORY, PRASAD_CATEGORY_METADATA, DISTRIBUTION_POINT } from '../prasadTypes';
import CategorySelector from './CategorySelector';
import DistributionPointSelector from './DistributionPointSelector';
import SevaPrasadLinker from './SevaPrasadLinker';

interface PrasadMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMenu: KitchenPlan | null;
  temples: Array<{ id: string; name: string; deity?: string }>;
  initialCategory?: PRASAD_CATEGORY | null;
}

export default function PrasadMenuModal({ isOpen, onClose, editingMenu, temples, initialCategory = null }: PrasadMenuModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'items' | 'seva' | 'schedule' | 'notes'>('basic');
  const [formData, setFormData] = useState<Partial<KitchenPlan>>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    templeId: '',
    category: undefined,
    distributionPoint: undefined,
    mealType: 'breakfast',
    items: [],
    startTime: '08:00',
    preparationDuration: 60,
    distributionTime: '09:00',
    status: 'draft',
    notes: '',
    categoryLocked: false,
    distributionStarted: false,
  });

  const [newItem, setNewItem] = useState<Partial<PrasadItem>>({
    name: '',
    quantity: 0,
    unit: 'kg',
    preparationTime: 0,
    status: 'pending',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingMenu) {
      setFormData({
        ...editingMenu,
      });
    } else {
      setFormData({
        name: '',
        date: new Date().toISOString().split('T')[0],
        templeId: '',
        category: initialCategory || undefined,
        distributionPoint: undefined,
        mealType: 'breakfast',
        items: [],
        startTime: '08:00',
        preparationDuration: 60,
        distributionTime: '09:00',
        status: 'draft',
        notes: '',
        categoryLocked: false,
        distributionStarted: false,
      });
    }
    setActiveTab('basic');
    setErrors({});
  }, [editingMenu, isOpen, initialCategory]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-update distribution point when category changes
      if (field === 'category' && value) {
        const metadata = PRASAD_CATEGORY_METADATA[value as PRASAD_CATEGORY];
        if (metadata.requirements.sevaLinkRequired && !updated.distributionPoint) {
          updated.distributionPoint = DISTRIBUTION_POINT.SEVA_AREA;
        } else if (metadata.requirements.counterRequired && !updated.distributionPoint) {
          updated.distributionPoint = DISTRIBUTION_POINT.COUNTER;
        } else if (value === PRASAD_CATEGORY.ANNADAN && !updated.distributionPoint) {
          updated.distributionPoint = DISTRIBUTION_POINT.ANNADAN_HALL;
        }
      }
      
      return updated;
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Menu name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.templeId) newErrors.templeId = 'Temple is required';
    if (!formData.category) newErrors.category = 'Prasad category is required';
    if (!formData.distributionPoint) newErrors.distributionPoint = 'Distribution point is required';
    
    // Category-specific validation
    if (formData.category === PRASAD_CATEGORY.ANNADAN) {
      if (!formData.annadanExpectedCount || formData.annadanExpectedCount <= 0) {
        newErrors.annadanExpectedCount = 'Expected count is required for Annadan';
      }
    }
    
    if (formData.category === PRASAD_CATEGORY.SEVA_PRASAD_PAID || 
        formData.category === PRASAD_CATEGORY.SEVA_PRASAD_FREE) {
      if (!formData.sevaLinks || formData.sevaLinks.length === 0) {
        newErrors.sevaLinks = 'At least one seva link is required for seva prasad';
      }
    }
    
    if (!formData.items || formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity) return;
    
    const item: PrasadItem = {
      id: `item-${Date.now()}`,
      name: newItem.name!,
      quantity: newItem.quantity!,
      unit: newItem.unit || 'kg',
      preparationTime: newItem.preparationTime || 0,
      status: 'pending',
    };

    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), item],
    }));

    setNewItem({
      name: '',
      quantity: 0,
      unit: 'kg',
      preparationTime: 0,
      status: 'pending',
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items?.filter(item => item.id !== itemId) || [],
    }));
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    // Prevent category changes if distribution has started
    if (editingMenu && (editingMenu.distributionStarted || editingMenu.categoryLocked)) {
      if (editingMenu.category !== formData.category) {
        alert('Cannot change category after distribution has started');
        return;
      }
    }

    const plan: KitchenPlan = {
      id: editingMenu?.id || `plan-${Date.now()}`,
      name: formData.name!,
      date: formData.date!,
      templeId: formData.templeId!,
      category: formData.category!,
      distributionPoint: formData.distributionPoint!,
      mealType: formData.mealType,
      items: formData.items || [],
      startTime: formData.startTime!,
      preparationDuration: formData.preparationDuration!,
      distributionTime: formData.distributionTime!,
      status: formData.status!,
      notes: formData.notes,
      createdAt: editingMenu?.createdAt || new Date().toISOString(),
      createdBy: editingMenu?.createdBy || 'Admin',
      categoryLocked: editingMenu?.categoryLocked || false,
      distributionStarted: editingMenu?.distributionStarted || false,
      
      // Category-specific fields
      annadanExpectedCount: formData.annadanExpectedCount,
      sevaLinks: formData.sevaLinks,
      batches: formData.batches,
    };

    try {
      saveKitchenPlan(plan);
      onClose();
    } catch (error: any) {
      alert(error.message || 'Error saving plan');
    }
  };

  const categoryMetadata = formData.category ? PRASAD_CATEGORY_METADATA[formData.category] : null;
  const isCategoryLocked = editingMenu?.categoryLocked || editingMenu?.distributionStarted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingMenu ? 'Edit Kitchen Plan' : 'Create Kitchen Plan'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">Configure prasad planning details</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-1 px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-3 rounded-t-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === 'basic'
                  ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`px-4 py-3 rounded-t-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === 'items'
                  ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Items ({formData.items?.length || 0})
            </button>
            {(formData.category === PRASAD_CATEGORY.SEVA_PRASAD_PAID || 
              formData.category === PRASAD_CATEGORY.SEVA_PRASAD_FREE) && (
              <button
                onClick={() => setActiveTab('seva')}
                className={`px-4 py-3 rounded-t-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'seva'
                    ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Seva Links ({formData.sevaLinks?.length || 0})
              </button>
            )}
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-3 rounded-t-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === 'schedule'
                  ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-3 rounded-t-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === 'notes'
                  ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Notes
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Daily Breakfast Annadan"
                />
                {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                      errors.date ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && <div className="text-xs text-red-600 mt-1">{errors.date}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temple <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.templeId || ''}
                    onChange={(e) => handleChange('templeId', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                      errors.templeId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Temple</option>
                    {temples.map(temple => (
                      <option key={temple.id} value={temple.id}>
                        {temple.deity || temple.name}
                      </option>
                    ))}
                  </select>
                  {errors.templeId && <div className="text-xs text-red-600 mt-1">{errors.templeId}</div>}
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <CategorySelector
                  selectedCategory={formData.category ?? null}
                  onSelect={(category) => handleChange('category', category)}
                  disabled={isCategoryLocked}
                  showDescriptions={true}
                />
                {errors.category && <div className="text-xs text-red-600 mt-1">{errors.category}</div>}
                {isCategoryLocked && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                    ⚠️ Category cannot be changed after distribution has started
                  </div>
                )}
              </div>

              {/* Distribution Point Selector */}
              {formData.category && (
                <div>
                  <DistributionPointSelector
                    selectedPoint={formData.distributionPoint ?? null}
                    category={formData.category ?? null}
                    onSelect={(point) => handleChange('distributionPoint', point)}
                    disabled={isCategoryLocked}
                  />
                  {errors.distributionPoint && (
                    <div className="text-xs text-red-600 mt-1">{errors.distributionPoint}</div>
                  )}
                </div>
              )}

              {/* Meal Type - Optional, only for certain categories */}
              {(formData.category === PRASAD_CATEGORY.ANNADAN || !formData.category) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Meal Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
                      <button
                        key={mealType}
                        type="button"
                        onClick={() => handleChange('mealType', mealType)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.mealType === mealType
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">
                            {mealType === 'breakfast' ? '🌅' : mealType === 'lunch' ? '☀️' : '🌙'}
                          </div>
                          <div className={`font-medium text-sm ${
                            formData.mealType === mealType ? 'text-amber-700' : 'text-gray-700'
                          }`}>
                            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Annadan Expected Count */}
              {formData.category === PRASAD_CATEGORY.ANNADAN && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Devotee Count <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.annadanExpectedCount || ''}
                    onChange={(e) => handleChange('annadanExpectedCount', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                      errors.annadanExpectedCount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="1"
                    placeholder="Expected number of devotees"
                  />
                  {errors.annadanExpectedCount && (
                    <div className="text-xs text-red-600 mt-1">{errors.annadanExpectedCount}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    No per-unit tracking for Annadan - this is for planning purposes only
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-4">
              {/* Add New Item */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Add Item</h3>
                <div className="grid grid-cols-5 gap-3">
                  <input
                    type="text"
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Item name"
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                  <input
                    type="number"
                    value={newItem.quantity || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                    placeholder="Quantity"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                  <select
                    value={newItem.unit || 'kg'}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  >
                    <option value="kg">kg</option>
                    <option value="liters">liters</option>
                    <option value="pieces">pieces</option>
                  </select>
                  <button
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Items</h3>
                {errors.items && <div className="text-xs text-red-600 mb-2">{errors.items}</div>}
                {formData.items && formData.items.length > 0 ? (
                  <div className="space-y-2">
                    {formData.items.map((item) => {
                      const stockAvailability = checkStockAvailability(item);
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 border rounded-lg ${
                            stockAvailability.available
                              ? 'bg-white border-gray-200'
                              : stockAvailability.availableQuantity > 0
                              ? 'bg-amber-50 border-amber-300'
                              : 'bg-red-50 border-red-300'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{item.name}</span>
                              <span className="text-sm text-gray-600">
                                {item.quantity} {item.unit}
                              </span>
                              {stockAvailability.available ? (
                                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                                  ✓ In Stock
                                </span>
                              ) : stockAvailability.availableQuantity > 0 ? (
                                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                                  ⚠ Low Stock
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                                  ✗ Out of Stock
                                </span>
                              )}
                            </div>
                            {!stockAvailability.available && (
                              <div className="text-xs text-gray-600 mt-1">
                                {stockAvailability.message}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No items added yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'seva' && formData.category && 
           (formData.category === PRASAD_CATEGORY.SEVA_PRASAD_PAID || 
            formData.category === PRASAD_CATEGORY.SEVA_PRASAD_FREE) && (
            <div>
              {errors.sevaLinks && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {errors.sevaLinks}
                </div>
              )}
              <SevaPrasadLinker
                plan={formData as KitchenPlan}
                date={formData.date || ''}
                sevaLinks={formData.sevaLinks || []}
                onLinksChange={(links) => handleChange('sevaLinks', links)}
                disabled={isCategoryLocked}
              />
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.startTime || '08:00'}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preparation Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.preparationDuration || 60}
                    onChange={(e) => handleChange('preparationDuration', parseInt(e.target.value) || 60)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distribution Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.distributionTime || '09:00'}
                    onChange={(e) => handleChange('distributionTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions / Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Add any special instructions or notes..."
              />
            </div>
          )}
        </div>

        {/* Footer - Sticky */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            {editingMenu ? 'Update Plan' : 'Create Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}
