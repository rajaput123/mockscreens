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

export default function SevaDistributionPage() {
  const [plans, setPlans] = useState<KitchenPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<KitchenPlan | null>(null);
  const [selectedSevaLink, setSelectedSevaLink] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [tokenOrName, setTokenOrName] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const todayPlans = getTodayPlans();
    const sevaPlans = todayPlans.filter(
      p => (p.category === PRASAD_CATEGORY.SEVA_PRASAD_PAID || 
            p.category === PRASAD_CATEGORY.SEVA_PRASAD_FREE) &&
           p.distributionPoint === DISTRIBUTION_POINT.SEVA_AREA &&
           (p.status === 'prepared' || p.status === 'distributing')
    );
    setPlans(sevaPlans);
  };

  const handleDistribute = () => {
    if (!selectedPlan || !selectedSevaLink || quantity <= 0 || !tokenOrName.trim()) {
      alert('Please fill all fields');
      return;
    }

    const link = selectedPlan.sevaLinks?.find(l => l.sevaId === selectedSevaLink);
    if (!link) return;

    if (link.distributedQuantity + quantity > link.expectedQuantity) {
      alert('Quantity exceeds expected amount');
      return;
    }

    // Update seva link
    const updatedPlan = { ...selectedPlan };
    const linkIndex = updatedPlan.sevaLinks!.findIndex(l => l.sevaId === selectedSevaLink);
    
    if (linkIndex >= 0) {
      updatedPlan.sevaLinks![linkIndex] = {
        ...updatedPlan.sevaLinks![linkIndex],
        distributedQuantity: updatedPlan.sevaLinks![linkIndex].distributedQuantity + quantity,
        distributionTime: new Date().toTimeString().slice(0, 5),
      };
    }

    updatedPlan.status = 'distributing';
    updatedPlan.distributionStarted = true;
    updatedPlan.categoryLocked = true;

    // Create distribution record
    const record: DistributionRecord = {
      id: `dist-${Date.now()}`,
      planId: updatedPlan.id,
      category: updatedPlan.category,
      distributionPoint: DISTRIBUTION_POINT.SEVA_AREA,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      quantity,
      unit: 'kg',
      itemName: `${link.sevaName} Prasad`,
      distributedBy: 'Seva Staff',
      distributedTo: tokenOrName,
      notes: `Seva: ${link.sevaName}`,
      createdAt: new Date().toISOString(),
    };

    saveDistributionRecord(record);
    saveKitchenPlan(updatedPlan);
    
    alert(`Distributed ${quantity} kg of ${link.sevaName} prasad\nToken/Name: ${tokenOrName}`);
    
    setQuantity(0);
    setTokenOrName('');
    loadData();
  };

  return (
    <ModuleLayout
      title="Seva Prasad Distribution"
      description="Track seva prasad distribution by seva bookings"
    >
      {/* Header with Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Seva Prasad Distribution</h3>
            <p className="text-sm text-gray-600">Track prasad distribution for seva bookings</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/operations/kitchen-prasad/kitchen-planning?category=SEVA_PRASAD_PAID"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Paid Seva Plan
            </Link>
            <Link
              href="/operations/kitchen-prasad/kitchen-planning?category=SEVA_PRASAD_FREE"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Free Seva Plan
            </Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Plans */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seva Prasad Plans</h3>
          
          {plans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No seva prasad available for distribution
            </div>
          ) : (
            <div className="space-y-3">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full text-left p-4 border rounded-lg transition-colors ${
                    selectedPlan?.id === plan.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <div className="font-medium text-gray-900 mb-1">{plan.name}</div>
                  <div className="text-sm text-gray-600">
                    {plan.sevaLinks?.length || 0} seva(s) linked
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Distribution Interface */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribute Prasad</h3>
          
          {selectedPlan && selectedPlan.sevaLinks && selectedPlan.sevaLinks.length > 0 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Seva <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSevaLink}
                  onChange={(e) => {
                    setSelectedSevaLink(e.target.value);
                    const link = selectedPlan.sevaLinks?.find(l => l.sevaId === e.target.value);
                    if (link) {
                      setQuantity(link.expectedQuantity - link.distributedQuantity);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select Seva</option>
                  {selectedPlan.sevaLinks.map((link) => (
                    <option key={link.sevaId} value={link.sevaId}>
                      {link.sevaName} - Expected: {link.expectedQuantity.toFixed(2)} kg, 
                      Distributed: {link.distributedQuantity.toFixed(2)} kg, 
                      Remaining: {(link.expectedQuantity - link.distributedQuantity).toFixed(2)} kg
                    </option>
                  ))}
                </select>
              </div>

              {selectedSevaLink && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity (kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={quantity || ''}
                      onChange={(e) => setQuantity(Math.max(0, parseFloat(e.target.value) || 0))}
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter quantity"
                    />
                    {selectedPlan.sevaLinks?.find(l => l.sevaId === selectedSevaLink) && (
                      <div className="text-xs text-gray-500 mt-1">
                        Remaining: {(selectedPlan.sevaLinks.find(l => l.sevaId === selectedSevaLink)!.expectedQuantity - 
                                     selectedPlan.sevaLinks.find(l => l.sevaId === selectedSevaLink)!.distributedQuantity).toFixed(2)} kg
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seva Token / Devotee Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={tokenOrName}
                      onChange={(e) => setTokenOrName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter token number or devotee name"
                    />
                  </div>

                  <button
                    onClick={handleDistribute}
                    disabled={!selectedSevaLink || quantity <= 0 || !tokenOrName.trim()}
                    className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Record Distribution
                  </button>
                </>
              )}
            </div>
          ) : selectedPlan ? (
            <div className="text-center py-8 text-gray-500">
              No seva links found for this plan
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a plan from the left to distribute prasad
            </div>
          )}
        </div>
      </div>

      <HelpButton module="kitchen-prasad" />
    </ModuleLayout>
  );
}

