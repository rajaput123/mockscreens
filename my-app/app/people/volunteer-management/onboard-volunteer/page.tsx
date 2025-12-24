'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { ModernCard } from '../../components';
import OnboardVolunteerModal from '../components/OnboardVolunteerModal';

export default function OnboardVolunteerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log('Volunteer onboarded:', data);
    setIsModalOpen(false);
    alert('Volunteer onboarded successfully!');
  };

  return (
    <ModuleLayout
      title="Onboard Volunteer"
      description="Register a new volunteer"
    >
      <ModernCard elevation="lg" className="text-center p-12">
        <div className="space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Onboard New Volunteer</h2>
            <p className="text-gray-600 mb-6">
              Click the button below to register a new volunteer. Fill in their personal information, address, and skills.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 rounded-2xl bg-amber-600 text-white font-semibold transition-all hover:bg-amber-700 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            + Onboard New Volunteer
          </button>
        </div>
      </ModernCard>

      <OnboardVolunteerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  );
}
