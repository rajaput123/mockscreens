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
  CounterBatch,
  DistributionRecord
} from '../../prasadData';
import { PRASAD_CATEGORY, DISTRIBUTION_POINT } from '../../prasadTypes';

export default function CounterDistributionPage() {
  const [plans, setPlans] = useState<KitchenPlan[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<{ plan: KitchenPlan; batch: CounterBatch } | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [receiptNumber, setReceiptNumber] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const todayPlans = getTodayPlans();
    const counterPlans = todayPlans.filter(
      p => p.category === PRASAD_CATEGORY.COUNTER_PAID && 
           p.distributionPoint === DISTRIBUTION_POINT.COUNTER &&
           (p.status === 'prepared' || p.status === 'distributing')
    );
    setPlans(counterPlans);
  };

  const handleIssue = () => {
    if (!selectedBatch || quantity <= 0 || !receiptNumber.trim()) {
      alert('Please fill all fields');
      return;
    }

    if (quantity > selectedBatch.batch.available) {
      alert('Quantity exceeds available stock');
      return;
    }

    // Update batch
    const updatedPlan = { ...selectedBatch.plan };
    const batchIndex = updatedPlan.batches!.findIndex(b => b.id === selectedBatch.batch.id);
    
    if (batchIndex >= 0) {
      updatedPlan.batches![batchIndex] = {
        ...updatedPlan.batches![batchIndex],
        distributed: updatedPlan.batches![batchIndex].distributed + quantity,
        available: updatedPlan.batches![batchIndex].available - quantity,
        status: updatedPlan.batches![batchIndex].available - quantity === 0 ? 'exhausted' : 'distributing',
      };
    }

    updatedPlan.status = 'distributing';
    updatedPlan.distributionStarted = true;
    updatedPlan.categoryLocked = true;

    // Create distribution record
    const item = updatedPlan.items.find(i => i.id === selectedBatch.batch.itemId);
    const record: DistributionRecord = {
      id: `dist-${Date.now()}`,
      planId: updatedPlan.id,
      category: PRASAD_CATEGORY.COUNTER_PAID,
      distributionPoint: DISTRIBUTION_POINT.COUNTER,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      quantity,
      unit: item?.unit || 'kg',
      itemName: item?.name || '',
      distributedBy: 'Counter Staff',
      distributedTo: receiptNumber,
      notes: `Batch: ${selectedBatch.batch.batchNumber}`,
      createdAt: new Date().toISOString(),
    };

    saveDistributionRecord(record);
    saveKitchenPlan(updatedPlan);
    
    alert(`Issued ${quantity} ${item?.unit} of ${item?.name}\nReceipt: ${receiptNumber}`);
    
    setQuantity(0);
    setReceiptNumber('');
    loadData();
  };

  const getTotalAvailable = () => {
    if (!selectedBatch) return 0;
    return selectedBatch.plan.batches?.reduce((sum, b) => sum + b.available, 0) || 0;
  };

  return (
    <ModuleLayout
      title="Counter Distribution"
      description="Issue counter-paid prasad to devotees"
    >
      {/* Header with Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Counter Distribution</h3>
            <p className="text-sm text-gray-600">Issue prasad to devotees at counter</p>
          </div>
          <Link
            href="/operations/kitchen-prasad/kitchen-planning?category=COUNTER_PAID"
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Counter Plan
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Stock */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Stock</h3>
          
          {plans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No counter-paid prasad available for distribution
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan) => (
                <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-2">{plan.name}</div>
                  {plan.batches && plan.batches.length > 0 ? (
                    <div className="space-y-2">
                      {plan.batches
                        .filter(b => b.status !== 'exhausted')
                        .map((batch) => {
                          const item = plan.items.find(i => i.id === batch.itemId);
                          return (
                            <button
                              key={batch.id}
                              onClick={() => setSelectedBatch({ plan, batch })}
                              className={`w-full text-left p-3 border rounded-lg transition-colors ${
                                selectedBatch?.batch.id === batch.id
                                  ? 'border-amber-500 bg-amber-50'
                                  : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                              }`}
                            >
                              <div className="font-medium text-sm">{batch.batchNumber}</div>
                              <div className="text-xs text-gray-600">
                                {item?.name}: {batch.available} / {batch.quantity} {item?.unit} available
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No batches available</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Issue Interface */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Prasad</h3>
          
          {selectedBatch ? (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-sm font-medium text-amber-900 mb-2">Selected Batch</div>
                <div className="text-sm text-amber-700">
                  {selectedBatch.batch.batchNumber} - {selectedBatch.plan.items.find(i => i.id === selectedBatch.batch.itemId)?.name}
                </div>
                <div className="text-sm text-amber-700 mt-1">
                  Available: {selectedBatch.batch.available} {selectedBatch.plan.items.find(i => i.id === selectedBatch.batch.itemId)?.unit}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Issue <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(Math.max(0, parseFloat(e.target.value) || 0))}
                  max={selectedBatch.batch.available}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt/Token Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter receipt number"
                />
              </div>

              <button
                onClick={handleIssue}
                disabled={quantity <= 0 || quantity > selectedBatch.batch.available || !receiptNumber.trim()}
                className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Issue Prasad
              </button>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-xs text-amber-700">
                  <strong>Total Available:</strong> {getTotalAvailable()} {selectedBatch.plan.items.find(i => i.id === selectedBatch.batch.itemId)?.unit}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a batch from the left to issue prasad
            </div>
          )}
        </div>
      </div>

      <HelpButton module="kitchen-prasad" />
    </ModuleLayout>
  );
}

