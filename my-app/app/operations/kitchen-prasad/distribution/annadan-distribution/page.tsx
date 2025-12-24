'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ModuleLayout from '../../../../components/layout/ModuleLayout';
import HelpButton from '../../../../components/help/HelpButton';
import { 
  getAllKitchenPlans, 
  getTodayPlans,
  saveKitchenPlan,
  saveDistributionRecord,
  KitchenPlan,
  DistributionRecord
} from '../../prasadData';
import { PRASAD_CATEGORY, DISTRIBUTION_POINT } from '../../prasadTypes';

export default function AnnadanDistributionPage() {
  const [plans, setPlans] = useState<KitchenPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<KitchenPlan | null>(null);
  const [actualCount, setActualCount] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const todayPlans = getTodayPlans();
    const annadanPlans = todayPlans.filter(
      p => p.category === PRASAD_CATEGORY.ANNADAN &&
           p.distributionPoint === DISTRIBUTION_POINT.ANNADAN_HALL &&
           (p.status === 'prepared' || p.status === 'distributing')
    );
    setPlans(annadanPlans);
  };

  const handleUpdateCount = () => {
    if (!selectedPlan) return;

    if (actualCount < 0) {
      alert('Count cannot be negative');
      return;
    }

    // Update plan
    const updatedPlan: KitchenPlan = {
      ...selectedPlan,
      annadanActualCount: actualCount,
      status: 'distributing',
      distributionStarted: true,
      categoryLocked: true,
    };

    // Create distribution record (summary record for annadan)
    if (actualCount > 0) {
      const record: DistributionRecord = {
        id: `dist-${Date.now()}`,
        planId: updatedPlan.id,
        category: PRASAD_CATEGORY.ANNADAN,
        distributionPoint: DISTRIBUTION_POINT.ANNADAN_HALL,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        quantity: actualCount,
        unit: 'count',
        itemName: 'Annadan',
        distributedBy: 'Annadan Staff',
        notes: `Annadan distribution - ${actualCount} devotees served`,
        createdAt: new Date().toISOString(),
      };

      saveDistributionRecord(record);
    }

    saveKitchenPlan(updatedPlan);
    alert(`Annadan count updated: ${actualCount} devotees served`);
    loadData();
  };

  const handleComplete = () => {
    if (!selectedPlan) return;

    const updatedPlan: KitchenPlan = {
      ...selectedPlan,
      status: 'completed',
      distributedAt: new Date().toISOString(),
    };

    saveKitchenPlan(updatedPlan);
    alert('Annadan distribution marked as completed');
    loadData();
  };

  return (
    <ModuleLayout
      title="Annadan Distribution"
      description="Track free community food (Annadan) distribution"
    >
      {/* Header with Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Annadan Distribution</h3>
            <p className="text-sm text-gray-600">Track free community food distribution</p>
          </div>
          <Link
            href="/operations/kitchen-prasad/kitchen-planning?category=ANNADAN"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Annadan Plan
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Plans */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Annadan Plans</h3>
          
          {plans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No annadan plans available for distribution
            </div>
          ) : (
            <div className="space-y-3">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setActualCount(plan.annadanActualCount || 0);
                  }}
                  className={`w-full text-left p-4 border rounded-lg transition-colors ${
                    selectedPlan?.id === plan.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <div className="font-medium text-gray-900 mb-1">{plan.name}</div>
                  <div className="text-sm text-gray-600">
                    Expected: {plan.annadanExpectedCount || 0} | 
                    Actual: {plan.annadanActualCount || 0}
                  </div>
                  {plan.mealType && (
                    <div className="text-xs text-gray-500 mt-1 capitalize">{plan.mealType}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Distribution Tracking */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Track Distribution</h3>
          
          {selectedPlan ? (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm font-medium text-red-900 mb-2">Plan Details</div>
                <div className="text-sm text-red-700">
                  <div>{selectedPlan.name}</div>
                  {selectedPlan.mealType && (
                    <div className="mt-1 capitalize">{selectedPlan.mealType}</div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-sm font-medium text-amber-900 mb-2">Expected Count</div>
                <div className="text-2xl font-bold text-amber-700">
                  {selectedPlan.annadanExpectedCount || 0}
                </div>
                <div className="text-xs text-amber-600 mt-1">devotees</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Count <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={actualCount || ''}
                  onChange={(e) => setActualCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter actual count"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Number of devotees actually served
                </div>
              </div>

              {selectedPlan.annadanExpectedCount !== undefined && (
                <div className={`p-3 rounded-lg ${
                  actualCount >= (selectedPlan.annadanExpectedCount || 0)
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-amber-50 border border-amber-200'
                }`}>
                  <div className="text-sm">
                    <strong>Difference:</strong> {actualCount - (selectedPlan.annadanExpectedCount || 0)} 
                    {actualCount >= (selectedPlan.annadanExpectedCount || 0) ? ' (More served)' : ' (Less served)'}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleUpdateCount}
                  className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium"
                >
                  Update Count
                </button>
                {selectedPlan.status !== 'completed' && (
                  <button
                    onClick={handleComplete}
                    className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium"
                  >
                    Complete
                  </button>
                )}
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-600">
                  <strong>Note:</strong> Annadan is free community food. No tokens or receipts required. 
                  Only count tracking is needed.
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a plan from the left to track distribution
            </div>
          )}
        </div>
      </div>

      <HelpButton module="kitchen-prasad" />
    </ModuleLayout>
  );
}

