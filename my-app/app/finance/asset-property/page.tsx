'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../components/layout/ModuleLayout';

export default function AssetPropertyPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the actual assets page
    router.replace('/finance/assets');
  }, [router]);

  return (
    <ModuleLayout
      title="Asset & Property Management"
      description="Manage assets, properties, and valuations"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Asset & Property Management' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to asset register...</p>
      </div>
    </ModuleLayout>
  );
}

