'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import { 
  getAllKitchenPlans, 
  saveKitchenPlan, 
  deleteKitchenPlan,
  KitchenPlan
} from '../prasadData';
import { getAllTemples } from '../../temple-management/templeData';
import { PRASAD_CATEGORY, PRASAD_CATEGORY_METADATA, DISTRIBUTION_POINT } from '../prasadTypes';
import { getSevasByDate, estimatePrasadFromSevas } from '../kitchenPlanning';
import PrasadMenuModal from '../components/PrasadMenuModal';

export default function KitchenPlanningPage() {
  const [plans, setPlans] = useState<KitchenPlan[]>([]);
  const [temples, setTemples] = useState<Array<{ id: string; name: string; deity?: string }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<KitchenPlan | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<PRASAD_CATEGORY | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sevaEstimates, setSevaEstimates] = useState<any[]>([]);
  const [preSelectedCategory, setPreSelectedCategory] = useState<PRASAD_CATEGORY | null>(null);

  useEffect(() => {
    loadData();
    loadSevaEstimates();
    
    // Check for category filter from URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get('category');
      if (categoryParam && Object.values(PRASAD_CATEGORY).includes(categoryParam as PRASAD_CATEGORY)) {
        setActiveCategoryTab(categoryParam as PRASAD_CATEGORY);
        setPreSelectedCategory(categoryParam as PRASAD_CATEGORY);
      }
    }
  }, [selectedDate]);

  const loadData = () => {
    const allPlans = getAllKitchenPlans();
    setPlans(allPlans);
    
    const allTemples = getAllTemples();
    setTemples(allTemples.map(t => ({ id: t.id, name: t.name, deity: t.deity })));
  };

  const loadSevaEstimates = () => {
    const estimates = estimatePrasadFromSevas(selectedDate);
    setSevaEstimates(estimates);
  };

  const getTempleName = (templeId: string) => {
    const temple = temples.find(t => t.id === templeId);
    return temple?.deity || temple?.name || templeId;
  };

  const handleOpenModal = (plan?: KitchenPlan, presetCategory?: PRASAD_CATEGORY) => {
    if (!plan && presetCategory) {
      // Create new plan with preset category
      const newPlan: Partial<KitchenPlan> = {
        category: presetCategory,
        date: selectedDate,
        distributionPoint: presetCategory === PRASAD_CATEGORY.ANNADAN 
          ? DISTRIBUTION_POINT.ANNADAN_HALL
          : presetCategory === PRASAD_CATEGORY.COUNTER_PAID
          ? DISTRIBUTION_POINT.COUNTER
          : DISTRIBUTION_POINT.SEVA_AREA,
      };
      setEditingPlan(newPlan as KitchenPlan);
    } else {
      setEditingPlan(plan || null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
    setPreSelectedCategory(null);
    loadData();
  };

  const handleDelete = (planId: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        deleteKitchenPlan(planId);
        loadData();
      } catch (error: any) {
        alert(error.message || 'Cannot delete plan');
      }
    }
  };

  const getFilteredPlans = () => {
    let filtered = plans.filter(p => p.date === selectedDate);

    if (activeCategoryTab !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategoryTab);
    }

    return filtered;
  };

  const filteredPlans = getFilteredPlans();
  const categoryPlans = {
    [PRASAD_CATEGORY.ANNADAN]: filteredPlans.filter(p => p.category === PRASAD_CATEGORY.ANNADAN),
    [PRASAD_CATEGORY.COUNTER_PAID]: filteredPlans.filter(p => p.category === PRASAD_CATEGORY.COUNTER_PAID),
    [PRASAD_CATEGORY.SEVA_PRASAD_PAID]: filteredPlans.filter(p => p.category === PRASAD_CATEGORY.SEVA_PRASAD_PAID),
    [PRASAD_CATEGORY.SEVA_PRASAD_FREE]: filteredPlans.filter(p => p.category === PRASAD_CATEGORY.SEVA_PRASAD_FREE),
  };

  const getStatusColor = (status: KitchenPlan['status']) => {
    switch (status) {
      case 'completed':
      case 'distributed':
        return 'bg-amber-100 text-amber-700';
      case 'prepared':
        return 'bg-amber-100 text-amber-700';
      case 'distributing':
        return 'bg-amber-100 text-amber-700';
      case 'in-progress':
        return 'bg-amber-100 text-amber-700';
      case 'scheduled':
        return 'bg-gray-100 text-gray-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <ModuleLayout
      title="Kitchen Planning"
      description="Plan prasad preparation by category for all temples"
    >
      {/* Floating Add Button - Always Visible */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => handleOpenModal(undefined, activeCategoryTab !== 'all' ? activeCategoryTab : preSelectedCategory || undefined)}
          className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center w-16 h-16"
          title="Create New Plan"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Kitchen Planning</h2>
            <p className="text-sm text-gray-600 mt-1">Plan prasad quantities by category</p>
          </div>
          <div className="flex gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <button
              onClick={() => handleOpenModal(undefined, preSelectedCategory || (activeCategoryTab !== 'all' ? activeCategoryTab : undefined))}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Create New Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategoryTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategoryTab === 'all'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {Object.values(PRASAD_CATEGORY).map((category) => {
              const metadata = PRASAD_CATEGORY_METADATA[category];
              return (
                <div key={category} className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveCategoryTab(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      activeCategoryTab === category
                        ? `${metadata.color.bg} ${metadata.color.text}`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{metadata.icon}</span>
                    <span>{metadata.ui.shortLabel}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      activeCategoryTab === category
                        ? 'bg-white/50'
                        : 'bg-gray-200'
                    }`}>
                      {categoryPlans[category].length}
                    </span>
                  </button>
                  <button
                    onClick={() => handleOpenModal(undefined, category)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${metadata.color.bg} ${metadata.color.text} hover:opacity-80`}
                    title={`Add ${metadata.ui.shortLabel} Plan`}
                  >
                    +
                  </button>
                </div>
              );
            })}
            </div>
          </div>
        </div>

        {/* Seva Estimates for Seva Prasad Categories */}
        {(activeCategoryTab === PRASAD_CATEGORY.SEVA_PRASAD_PAID || 
          activeCategoryTab === PRASAD_CATEGORY.SEVA_PRASAD_FREE ||
          activeCategoryTab === 'all') && sevaEstimates.length > 0 && (
          <div className="p-4 bg-amber-50 border-b border-amber-200">
            <h4 className="text-sm font-semibold text-amber-900 mb-2">Seva-Based Quantity Estimates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sevaEstimates
                .filter(e => 
                  activeCategoryTab === 'all' || 
                  (activeCategoryTab === PRASAD_CATEGORY.SEVA_PRASAD_PAID && e.category === PRASAD_CATEGORY.SEVA_PRASAD_PAID) ||
                  (activeCategoryTab === PRASAD_CATEGORY.SEVA_PRASAD_FREE && e.category === PRASAD_CATEGORY.SEVA_PRASAD_FREE)
                )
                .map((estimate) => (
                  <div
                    key={estimate.sevaId}
                    className="p-3 bg-white border border-amber-200 rounded-lg"
                  >
                    <div className="font-medium text-sm text-gray-900">{estimate.sevaName}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Suggested quantities:
                    </div>
                    <div className="mt-2 space-y-1">
                      {estimate.suggestedItems.map((item: any, idx: number) => (
                        <div key={idx} className="text-xs text-gray-700">
                          • {item.name}: {item.quantity.toFixed(2)} {item.unit}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Plans List */}
        <div className="p-6">
          {filteredPlans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg mb-2">
                No plans found for {new Date(selectedDate).toLocaleDateString()}
              </p>
              <div className="flex gap-3 justify-center mt-4">
                <button
                  onClick={() => handleOpenModal(undefined, activeCategoryTab !== 'all' ? activeCategoryTab : preSelectedCategory || undefined)}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>+ Create New Plan</span>
                  {activeCategoryTab !== 'all' && activeCategoryTab in PRASAD_CATEGORY_METADATA && (
                    <span className="text-sm opacity-90 ml-1">({PRASAD_CATEGORY_METADATA[activeCategoryTab as PRASAD_CATEGORY].ui.shortLabel})</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlans.map((plan) => {
                const metadata = PRASAD_CATEGORY_METADATA[plan.category];
                return (
                  <div
                    key={plan.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                            {plan.status}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${metadata.color.bg} ${metadata.color.text}`}>
                            {metadata.icon} {metadata.ui.shortLabel}
                          </span>
                        </div>
                        <div className="font-semibold text-gray-900 mb-1">{plan.name}</div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Temple: {getTempleName(plan.templeId)}</div>
                          <div>Time: {plan.startTime} - {plan.distributionTime}</div>
                          <div>Items: {plan.items.length} | Prepared: {plan.items.filter(i => i.status === 'prepared').length}</div>
                          
                          {/* Category-specific info */}
                          {plan.category === PRASAD_CATEGORY.ANNADAN && plan.annadanExpectedCount && (
                            <div>Expected Count: {plan.annadanExpectedCount} devotees</div>
                          )}
                          
                          {plan.category === PRASAD_CATEGORY.COUNTER_PAID && plan.batches && (
                            <div>Batches: {plan.batches.length} | Total Stock: {plan.batches.reduce((sum, b) => sum + b.available, 0)} units</div>
                          )}
                          
                          {(plan.category === PRASAD_CATEGORY.SEVA_PRASAD_PAID || 
                            plan.category === PRASAD_CATEGORY.SEVA_PRASAD_FREE) && plan.sevaLinks && (
                            <div>Linked Sevas: {plan.sevaLinks.length} | Total Expected: {plan.sevaLinks.reduce((sum, l) => sum + l.expectedQuantity, 0).toFixed(2)} kg</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleOpenModal(plan)}
                          className="px-3 py-1 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          disabled={plan.distributionStarted}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <PrasadMenuModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingMenu={editingPlan}
        temples={temples}
        initialCategory={preSelectedCategory}
      />

      <HelpButton module="kitchen-prasad" />
    </ModuleLayout>
  );
}

