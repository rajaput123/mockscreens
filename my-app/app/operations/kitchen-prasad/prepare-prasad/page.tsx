'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import { 
  getAllKitchenPlans, 
  getTodayPlans,
  saveKitchenPlan,
  getPlanProgress,
  KitchenPlan,
  saveWastageRecord,
  WastageRecord
} from '../prasadData';
import { getAllTemples } from '../../temple-management/templeData';
import { PRASAD_CATEGORY, PRASAD_CATEGORY_METADATA, DISTRIBUTION_POINT } from '../prasadTypes';
import MenuClusterView from '../components/MenuClusterView';
import { autoDeductStockForMenu } from '../../perishable-inventory/utils/kitchenIntegration';

function PreparePrasadContent() {
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<KitchenPlan[]>([]);
  const [temples, setTemples] = useState<Array<{ id: string; name: string; deity?: string }>>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<PRASAD_CATEGORY | 'all'>('all');
  const [wastageModal, setWastageModal] = useState<{ open: boolean; itemId?: string; planId?: string }>({ open: false });

  useEffect(() => {
    loadData();
    const planParam = searchParams?.get('plan');
    if (planParam) {
      setSelectedPlanId(planParam);
    }
    const categoryParam = searchParams?.get('category');
    if (categoryParam && Object.values(PRASAD_CATEGORY).includes(categoryParam as PRASAD_CATEGORY)) {
      setCategoryFilter(categoryParam as PRASAD_CATEGORY);
    }
  }, [searchParams]);

  const loadData = () => {
    const allPlans = getAllKitchenPlans();
    setPlans(allPlans);
    
    const allTemples = getAllTemples();
    setTemples(allTemples.map(t => ({ id: t.id, name: t.name, deity: t.deity })));
  };

  const getTempleName = (templeId: string) => {
    const temple = temples.find(t => t.id === templeId);
    return temple?.deity || temple?.name || templeId;
  };

  const todayPlans = getTodayPlans();
  
  // Filter by category
  let filteredPlans = todayPlans;
  if (categoryFilter !== 'all') {
    filteredPlans = filteredPlans.filter(p => p.category === categoryFilter);
  }
  
  // Filter by meal type if provided
  const mealTypeFilter = searchParams?.get('mealType') as 'breakfast' | 'lunch' | 'dinner' | null;
  if (mealTypeFilter) {
    filteredPlans = filteredPlans.filter(p => p.mealType === mealTypeFilter);
  }
  
  const selectedPlan = selectedPlanId 
    ? filteredPlans.find(p => p.id === selectedPlanId) || filteredPlans[0]
    : filteredPlans[0];

  const handleItemStatusChange = (planId: string, itemId: string, status: 'pending' | 'preparing' | 'prepared') => {
    const plan = filteredPlans.find(p => p.id === planId);
    if (!plan) return;

    const updatedItems = plan.items.map(item =>
      item.id === itemId ? { ...item, status } : item
    );

    const updatedPlan: KitchenPlan = {
      ...plan,
      items: updatedItems,
      status: updatedItems.every(item => item.status === 'prepared') 
        ? 'prepared' 
        : updatedItems.some(item => item.status === 'prepared' || item.status === 'preparing')
        ? 'in-progress'
        : plan.status,
    };

    saveKitchenPlan(updatedPlan);
    loadData();
  };

  const handleMarkPrepared = () => {
    if (!selectedPlan) return;

    // Auto-deduct stock from inventory (using legacy function for now)
    try {
      const deductionResult = autoDeductStockForMenu(selectedPlan as any);
      
      if (deductionResult.errors.length > 0) {
        const errorMessages = deductionResult.errors.map(e => `${e.item}: ${e.message}`).join('\n');
        if (!confirm(`Some items have insufficient stock:\n\n${errorMessages}\n\nDo you want to proceed anyway?`)) {
          return;
        }
      }

      const updatedPlan: KitchenPlan = {
        ...selectedPlan,
        items: selectedPlan.items.map(item => ({ ...item, status: 'prepared' as const })),
        status: 'prepared',
        preparedAt: new Date().toISOString(),
      };

      saveKitchenPlan(updatedPlan);
      
      if (deductionResult.success && deductionResult.deducted.length > 0) {
        const deductedItems = deductionResult.deducted.map(d => `${d.quantity} ${d.unit} ${d.item}`).join(', ');
        alert(`Plan marked as prepared!\n\nStock deducted: ${deductedItems}`);
      }
      
      loadData();
    } catch (error) {
      console.error('Stock deduction error:', error);
    }
  };

  const handleRecordWastage = (planId: string, itemId: string, quantity: number, unit: string, reason: string) => {
    const plan = filteredPlans.find(p => p.id === planId);
    if (!plan) return;

    const item = plan.items.find(i => i.id === itemId);
    if (!item) return;

    const wastage: WastageRecord = {
      id: `wastage-${Date.now()}`,
      planId,
      itemId,
      itemName: item.name,
      quantity,
      unit,
      reason,
      recordedBy: 'Kitchen Staff', // In production, get from auth
      recordedAt: new Date().toISOString(),
    };

    saveWastageRecord(wastage);
    setWastageModal({ open: false });
    loadData();
  };

  const getDistributionPointLabel = (point: DISTRIBUTION_POINT) => {
    switch (point) {
      case DISTRIBUTION_POINT.ANNADAN_HALL:
        return 'Annadan Hall';
      case DISTRIBUTION_POINT.COUNTER:
        return 'Counter';
      case DISTRIBUTION_POINT.SEVA_AREA:
        return 'Seva Area';
      default:
        return point;
    }
  };

  return (
    <ModuleLayout
      title="Prepare & Distribute Prasad"
      description="Track preparation and distribution by category"
    >
      {/* Header with Create Button */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Prepare & Distribute Prasad</h3>
          <Link
            href="/operations/kitchen-prasad/kitchen-planning"
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Plan
          </Link>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter by category:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {Object.values(PRASAD_CATEGORY).map((category) => {
                const metadata = PRASAD_CATEGORY_METADATA[category];
                return (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      categoryFilter === category
                        ? `${metadata.color.bg} ${metadata.color.text}`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{metadata.icon}</span>
                    <span>{metadata.ui.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Meal Type Filter */}
          <div className="flex items-center gap-2">
            <a
              href="/operations/kitchen-prasad/prepare-prasad?mealType=breakfast"
              className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
            >
              Breakfast
            </a>
            <a
              href="/operations/kitchen-prasad/prepare-prasad?mealType=lunch"
              className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
            >
              Lunch
            </a>
            <a
              href="/operations/kitchen-prasad/prepare-prasad?mealType=dinner"
              className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
            >
              Dinner
            </a>
          </div>
        </div>
      </div>

      {/* Plans List with Category and Distribution Labels */}
      {filteredPlans.length > 0 ? (
        <div className="space-y-4">
          {filteredPlans.map((plan) => {
            const metadata = PRASAD_CATEGORY_METADATA[plan.category];
            const progress = getPlanProgress(plan);
            
            return (
              <div
                key={plan.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${metadata.color.bg} ${metadata.color.text}`}>
                        {metadata.icon} {metadata.ui.shortLabel}
                      </span>
                      <span className="text-sm text-gray-600">
                        {getDistributionPointLabel(plan.distributionPoint)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        plan.status === 'prepared' ? 'bg-amber-100 text-amber-700' :
                        plan.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {plan.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
                    <div className="text-sm text-gray-600">
                      {getTempleName(plan.templeId)} • {plan.startTime} - {plan.distributionTime}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">Progress: {progress}%</div>
                    <div className="text-xs text-gray-500">
                      {plan.items.filter(i => i.status === 'prepared').length} / {plan.items.length} items
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2 mb-4">
                  {plan.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        item.status === 'prepared'
                          ? 'bg-amber-50 border-amber-200'
                          : item.status === 'preparing'
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.quantity} {item.unit}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={(e) => handleItemStatusChange(plan.id, item.id, e.target.value as any)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="prepared">Prepared</option>
                        </select>
                        <button
                          onClick={() => setWastageModal({ open: true, itemId: item.id, planId: plan.id })}
                          className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                          title="Record wastage"
                        >
                          Wastage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category-specific information */}
                {plan.category === PRASAD_CATEGORY.ANNADAN && plan.annadanExpectedCount !== undefined && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-sm font-medium text-red-900">Expected Count: {plan.annadanExpectedCount}</div>
                    {plan.annadanActualCount !== undefined && (
                      <div className="text-sm text-red-700 mt-1">Actual Count: {plan.annadanActualCount}</div>
                    )}
                  </div>
                )}

                {plan.category === PRASAD_CATEGORY.COUNTER_PAID && plan.batches && plan.batches.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Batches:</div>
                    <div className="space-y-2">
                      {plan.batches.map((batch) => (
                        <div key={batch.id} className="p-2 bg-amber-50 border border-amber-200 rounded text-sm">
                          <div className="font-medium">{batch.batchNumber}</div>
                          <div className="text-xs text-gray-600">
                            Available: {batch.available} / {batch.quantity} | Distributed: {batch.distributed}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(plan.category === PRASAD_CATEGORY.SEVA_PRASAD_PAID || 
                  plan.category === PRASAD_CATEGORY.SEVA_PRASAD_FREE) && plan.sevaLinks && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="text-sm font-medium text-amber-900 mb-2">Linked Sevas:</div>
                    {plan.sevaLinks.map((link) => (
                      <div key={link.sevaId} className="text-sm text-amber-700">
                        {link.sevaName}: Expected {link.expectedQuantity.toFixed(2)} kg, 
                        Distributed {link.distributedQuantity.toFixed(2)} kg
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleMarkPrepared}
                    disabled={plan.items.some(i => i.status !== 'prepared')}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Mark All Prepared
                  </button>
                  {plan.status === 'prepared' && (
                    <button
                      onClick={() => {
                        const updated = { ...plan, status: 'distributing' as const };
                        saveKitchenPlan(updated);
                        loadData();
                      }}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
                    >
                      Start Distribution
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-2">No plans found</p>
            <a
              href="/operations/kitchen-prasad/kitchen-planning"
              className="inline-block mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Plan Kitchen
            </a>
          </div>
        </div>
      )}

      {/* Wastage Modal */}
      {wastageModal.open && wastageModal.itemId && wastageModal.planId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Record Wastage</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const quantity = parseFloat((form.querySelector('[name="quantity"]') as HTMLInputElement).value);
                const unit = (form.querySelector('[name="unit"]') as HTMLSelectElement).value;
                const reason = (form.querySelector('[name="reason"]') as HTMLTextAreaElement).value;
                
                if (quantity > 0 && reason) {
                  handleRecordWastage(wastageModal.planId!, wastageModal.itemId!, quantity, unit, reason);
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="quantity"
                      step="0.1"
                      min="0"
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <select
                      name="unit"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="kg">kg</option>
                      <option value="liters">liters</option>
                      <option value="pieces">pieces</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    name="reason"
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Why was this wasted?"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setWastageModal({ open: false })}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Record
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <HelpButton module="kitchen-prasad" />
    </ModuleLayout>
  );
}

export default function PreparePrasadPage() {
  return (
    <Suspense fallback={
      <ModuleLayout
        title="Prepare Prasad"
        description="Prepare and manage prasad for today"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </ModuleLayout>
    }>
      <PreparePrasadContent />
    </Suspense>
  );
}
