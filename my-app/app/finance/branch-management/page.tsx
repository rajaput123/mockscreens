'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../components/layout/ModuleLayout';

export default function BranchManagementPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the actual branches page
    router.replace('/finance/branches');
  }, [router]);

  return (
    <ModuleLayout
      title="Branch Management"
      description="Manage branches, operations, and reports"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Branch Management' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to branch directory...</p>
      </div>
    </ModuleLayout>
  );
}

