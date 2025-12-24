'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function UpdatePropertyValuePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to assets page (property value can be updated there)
    router.replace('/finance/assets');
  }, [router]);

  return (
    <ModuleLayout
      title="Update Property Value"
      description="Update property values and valuations"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Asset & Property Management', href: '/finance/assets' },
        { label: 'Update Property Value' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to update property value...</p>
      </div>
    </ModuleLayout>
  );
}

