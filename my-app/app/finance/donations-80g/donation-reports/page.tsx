'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function DonationReportsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to 80G certificates page (reports can be generated from there)
    router.replace('/finance/donations-80g/80g-certificates');
  }, [router]);

  return (
    <ModuleLayout
      title="Donation Reports"
      description="Generate and view donation reports"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Donations & 80G', href: '/finance/donations-80g/80g-certificates' },
        { label: 'Donation Reports' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to donation reports...</p>
      </div>
    </ModuleLayout>
  );
}

