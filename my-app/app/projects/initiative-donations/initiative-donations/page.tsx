'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function InitiativeDonationsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main initiative donations page
    router.replace('/projects/initiative-donations');
  }, [router]);

  return (
    <ModuleLayout
      title="Initiative Donations"
      description="Manage donations for initiatives"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Initiative Donations', href: '/projects/initiative-donations' },
        { label: 'Initiative Donations' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to initiative donations...</p>
      </div>
    </ModuleLayout>
  );
}

