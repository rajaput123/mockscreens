'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function ViewDashboardsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to financial dashboard
    router.replace('/finance/accounts-financial/financial-dashboard');
  }, [router]);

  return (
    <ModuleLayout
      title="View Dashboards"
      description="View all available financial dashboards"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Reports & Audit' },
        { label: 'View Dashboards' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to dashboards...</p>
      </div>
    </ModuleLayout>
  );
}

