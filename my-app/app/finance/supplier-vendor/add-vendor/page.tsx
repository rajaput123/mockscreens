'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function AddVendorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to vendors page (add vendor functionality is available there)
    router.replace('/finance/vendors?action=add');
  }, [router]);

  return (
    <ModuleLayout
      title="Add / Assign Vendor"
      description="Add a new vendor or assign to projects"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Supplier / Vendor Management', href: '/finance/vendors' },
        { label: 'Add / Assign Vendor' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to add vendor...</p>
      </div>
    </ModuleLayout>
  );
}

