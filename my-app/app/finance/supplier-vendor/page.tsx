'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../components/layout/ModuleLayout';

export default function SupplierVendorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the actual vendors page
    router.replace('/finance/vendors');
  }, [router]);

  return (
    <ModuleLayout
      title="Supplier / Vendor Management"
      description="Manage vendors, contracts, and performance"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Supplier / Vendor Management' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to vendor directory...</p>
      </div>
    </ModuleLayout>
  );
}

