'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import { 
  getAllKitchenPlans, 
  deleteKitchenPlan,
  KitchenPlan 
} from '../prasadData';
import { getAllTemples } from '../../temple-management/templeData';
import { PRASAD_CATEGORY, PRASAD_CATEGORY_METADATA } from '../prasadTypes';
import PrasadMenuModal from '../components/PrasadMenuModal';

function PrasadMenuManagementContent() {
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<KitchenPlan[]>([]);
  const [temples, setTemples] = useState<Array<{ id: string; name: string; deity?: string }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<KitchenPlan | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<PRASAD_CATEGORY | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const userRole = 'kitchen_staff'; // In production, get from auth context

  useEffect(() => {
    loadData();
    const categoryParam = searchParams?.get('category');
    if (categoryParam && Object.values(PRASAD_CATEGORY).includes(categoryParam as PRASAD_CATEGORY)) {
      setActiveCategoryTab(categoryParam as PRASAD_CATEGORY);
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

  const handleOpenModal = (plan?: KitchenPlan) => {
    setEditingPlan(plan || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
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
    let filtered = plans;

    // Filter by category
    if (activeCategoryTab !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategoryTab);
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getTempleName(p.templeId).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredPlans = getFilteredPlans();
  
  // Group by category
  const plansByCategory = Object.values(PRASAD_CATEGORY).reduce((acc, category) => {
    acc[category] = filteredPlans.filter(p => p.category === category);
    return acc;
  }, {} as Record<PRASAD_CATEGORY, KitchenPlan[]>);

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

  const canModifyCategory = (plan: KitchenPlan) => {
    // Kitchen staff cannot modify categories
    if (userRole === 'kitchen_staff') return false;
    // Cannot modify if distribution started
    if (plan.distributionStarted || plan.categoryLocked) return false;
    return true;
  };

  return (
    <ModuleLayout
      title="Prasad Category Management"
      description="View and manage prasad plans by category"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Prasad Category Management</h2>
            <p className="text-sm text-gray-600 mt-1">View all prasad plans organized by category</p>
          </div>
          {userRole !== 'kitchen_staff' && (
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium"
            >
              + Create Plan
            </button>
          )}
        </div>
        
        {/* Search */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search plans..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategoryTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategoryTab === 'all'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Categories ({filteredPlans.length})
            </button>
            {Object.values(PRASAD_CATEGORY).map((category) => {
              const metadata = PRASAD_CATEGORY_METADATA[category];
              return (
                <button
                  key={category}
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
                    {plansByCategory[category]?.length || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Plans List by Category */}
        <div className="p-6">
          {activeCategoryTab === 'all' ? (
            // Show all categories
            <div className="space-y-8">
              {Object.values(PRASAD_CATEGORY).map((category) => {
                const metadata = PRASAD_CATEGORY_METADATA[category];
                const categoryPlans = plansByCategory[category] || [];
                
                if (categoryPlans.length === 0) return null;
                
                return (
                  <div key={category} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className={`p-4 rounded-lg mb-4 ${metadata.color.bg} ${metadata.color.border} border-2`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{metadata.icon}</span>
                        <div>
                          <h3 className={`font-semibold text-lg ${metadata.color.text}`}>
                            {metadata.label}
                          </h3>
                          <p className={`text-sm ${metadata.color.text} opacity-75`}>
                            {metadata.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2 text-sm">
                        <div className={`${metadata.color.text}`}>
                          <strong>Accounting:</strong> {metadata.accounting.description}
                        </div>
                        <div className={`${metadata.color.text}`}>
                          <strong>Distribution:</strong> {metadata.distribution.flow}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {categoryPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(plan.status)}`}>
                                  {plan.status}
                                </span>
                                {plan.categoryLocked && (
                                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                    🔒 Locked
                                  </span>
                                )}
                              </div>
                              <div className="font-semibold text-gray-900 mb-1">{plan.name}</div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div>Temple: {getTempleName(plan.templeId)}</div>
                                <div>Date: {new Date(plan.date).toLocaleDateString()} | Time: {plan.startTime} - {plan.distributionTime}</div>
                                <div>Items: {plan.items.length} | Distribution: {plan.distributionPoint}</div>
                              </div>
                            </div>
                            
                            {userRole !== 'kitchen_staff' && (
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => handleOpenModal(plan)}
                                  disabled={!canModifyCategory(plan)}
                                  className="px-3 py-1 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title={!canModifyCategory(plan) ? 'Cannot modify: category locked' : 'Edit'}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(plan.id)}
                                  disabled={plan.distributionStarted}
                                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title={plan.distributionStarted ? 'Cannot delete: distribution started' : 'Delete'}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Show single category
            <div>
              {(() => {
                const metadata = PRASAD_CATEGORY_METADATA[activeCategoryTab];
                const categoryPlans = plansByCategory[activeCategoryTab] || [];
                
                if (categoryPlans.length === 0) {
                  return (
                    <div className="text-center py-8 text-gray-500">
                      No plans found for {metadata.label}
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-3">
                    {categoryPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(plan.status)}`}>
                                {plan.status}
                              </span>
                              {plan.categoryLocked && (
                                <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                  🔒 Category Locked
                                </span>
                              )}
                            </div>
                            <div className="font-semibold text-gray-900 mb-1">{plan.name}</div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Temple: {getTempleName(plan.templeId)}</div>
                              <div>Date: {new Date(plan.date).toLocaleDateString()} | Time: {plan.startTime} - {plan.distributionTime}</div>
                              <div>Items: {plan.items.length} | Distribution: {plan.distributionPoint}</div>
                            </div>
                          </div>
                          
                          {userRole !== 'kitchen_staff' && (
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleOpenModal(plan)}
                                disabled={!canModifyCategory(plan)}
                                className="px-3 py-1 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(plan.id)}
                                disabled={plan.distributionStarted}
                                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      <PrasadMenuModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingMenu={editingPlan}
        temples={temples}
      />

      <HelpButton module="kitchen-prasad" />
    </ModuleLayout>
  );
}

export default function PrasadMenuManagementPage() {
  return (
    <Suspense fallback={
      <ModuleLayout
        title="Prasad Category Management"
        description="View and manage prasad plans by category"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </ModuleLayout>
    }>
      <PrasadMenuManagementContent />
    </Suspense>
  );
}
