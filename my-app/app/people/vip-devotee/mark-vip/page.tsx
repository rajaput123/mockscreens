'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { ModernCard } from '../../components';
import MarkVIPModal from '../components/MarkVIPModal';
import { getAllDevotees, Devotee } from '../../peopleData';

export default function MarkVIPPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log('VIP marked:', data);
    setIsModalOpen(false);
    alert('Devotee marked as VIP successfully!');
  };

  const devotees = getAllDevotees();
  const nonVIPDevotees = devotees.filter(d => !d.isVIP);

  return (
    <ModuleLayout
      title="Mark / Manage VIP"
      description="Mark a devotee as VIP or manage VIP status"
    >
      <ModernCard elevation="lg" className="text-center p-12 mb-6">
        <div className="space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mark Devotee as VIP</h2>
            <p className="text-gray-600 mb-4">
              Select a devotee and assign VIP status with special services and privileges.
            </p>
            <p className="text-sm text-gray-500">
              {nonVIPDevotees.length} {nonVIPDevotees.length === 1 ? 'devotee' : 'devotees'} available for VIP status
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={nonVIPDevotees.length === 0}
            className="px-8 py-4 rounded-2xl bg-amber-600 text-white font-semibold transition-all hover:bg-amber-700 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Mark Devotee as VIP
          </button>
        </div>
      </ModernCard>

      {nonVIPDevotees.length === 0 && (
        <ModernCard elevation="md" className="p-6">
          <div className="text-center">
            <p className="text-gray-600">All devotees are already marked as VIP.</p>
          </div>
        </ModernCard>
      )}

      <MarkVIPModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  );
}
