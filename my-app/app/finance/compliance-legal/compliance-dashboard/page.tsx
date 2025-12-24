'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function ComplianceDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to compliance page
    router.replace('/finance/compliance');
  }, [router]);

  return (
    <ModuleLayout
      title="Compliance Dashboard"
      description="View compliance status and overview"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Compliance & Legal', href: '/finance/compliance' },
        { label: 'Compliance Dashboard' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to compliance dashboard...</p>
      </div>
    </ModuleLayout>
  );
}

