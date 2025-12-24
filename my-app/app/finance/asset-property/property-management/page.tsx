'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function PropertyManagementPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to assets page (property management is handled there)
    router.replace('/finance/assets');
  }, [router]);

  return (
    <ModuleLayout
      title="Property Management"
      description="Manage temple properties and real estate"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Asset & Property Management', href: '/finance/assets' },
        { label: 'Property Management' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to property management...</p>
      </div>
    </ModuleLayout>
  );
}

