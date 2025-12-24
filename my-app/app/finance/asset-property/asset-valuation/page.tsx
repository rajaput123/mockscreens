'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function AssetValuationPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to assets page (asset valuation is shown there)
    router.replace('/finance/assets');
  }, [router]);

  return (
    <ModuleLayout
      title="Asset Valuation"
      description="View and update asset valuations"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Asset & Property Management', href: '/finance/assets' },
        { label: 'Asset Valuation' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to asset valuation...</p>
      </div>
    </ModuleLayout>
  );
}

