'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function VendorDirectoryPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to vendors page
    router.replace('/finance/vendors');
  }, [router]);

  return (
    <ModuleLayout
      title="Vendor Directory"
      description="View and manage vendor directory"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Supplier / Vendor Management', href: '/finance/vendors' },
        { label: 'Vendor Directory' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to vendor directory...</p>
      </div>
    </ModuleLayout>
  );
}

