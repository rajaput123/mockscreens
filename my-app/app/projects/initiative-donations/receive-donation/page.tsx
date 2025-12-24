'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function ReceiveDonationPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main initiative donations page with action to open donation modal
    router.replace('/projects/initiative-donations?action=record');
  }, [router]);

  return (
    <ModuleLayout
      title="Receive Donation"
      description="Receive donations for initiatives"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Initiative Donations', href: '/projects/initiative-donations' },
        { label: 'Receive Donation' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to donation form...</p>
      </div>
    </ModuleLayout>
  );
}

