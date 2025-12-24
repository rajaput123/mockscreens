'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function DashboardHubPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main dashboard
    router.replace('/');
  }, [router]);

  return (
    <ModuleLayout
      title="Dashboard Hub"
      description="View all financial dashboards and reports"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Reports & Audit' },
        { label: 'Dashboard Hub' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to dashboard hub...</p>
      </div>
    </ModuleLayout>
  );
}

