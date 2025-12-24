'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function BranchReportsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to branches page (reports can be generated from there)
    router.replace('/finance/branches');
  }, [router]);

  return (
    <ModuleLayout
      title="Branch Reports"
      description="Generate and view branch reports"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Branch Management', href: '/finance/branches' },
        { label: 'Branch Reports' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to branch reports...</p>
      </div>
    </ModuleLayout>
  );
}

