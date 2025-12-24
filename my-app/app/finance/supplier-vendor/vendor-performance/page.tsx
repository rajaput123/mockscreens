'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function VendorPerformancePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to vendors page (performance metrics are shown there)
    router.replace('/finance/vendors');
  }, [router]);

  return (
    <ModuleLayout
      title="Vendor Performance"
      description="View vendor performance metrics and ratings"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Supplier / Vendor Management', href: '/finance/vendors' },
        { label: 'Vendor Performance' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to vendor performance...</p>
      </div>
    </ModuleLayout>
  );
}

