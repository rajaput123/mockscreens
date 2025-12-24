'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function CustomReportsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to financial reports page
    router.replace('/finance/accounts-financial/financial-reports');
  }, [router]);

  return (
    <ModuleLayout
      title="Custom Reports"
      description="Generate custom financial reports"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Reports & Audit' },
        { label: 'Custom Reports' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to custom reports...</p>
      </div>
    </ModuleLayout>
  );
}

