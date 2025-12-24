'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function DonationAnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main initiative donations page with donations tab active (analytics can be viewed from stats)
    router.replace('/projects/initiative-donations?tab=donations');
  }, [router]);

  return (
    <ModuleLayout
      title="Donation Analytics"
      description="Analytics and insights for initiative donations"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Initiative Donations', href: '/projects/initiative-donations' },
        { label: 'Donation Analytics' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to donation analytics...</p>
      </div>
    </ModuleLayout>
  );
}

