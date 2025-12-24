'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function DonationManagementPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to 80G certificates page (donation management is handled there)
    router.replace('/finance/donations-80g/80g-certificates');
  }, [router]);

  return (
    <ModuleLayout
      title="Donation Management"
      description="Manage donations and 80G certificates"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Donations & 80G', href: '/finance/donations-80g/80g-certificates' },
        { label: 'Donation Management' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to donation management...</p>
      </div>
    </ModuleLayout>
  );
}

