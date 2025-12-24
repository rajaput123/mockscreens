'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function BranchOperationsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to branches page (operations can be viewed from branch details)
    router.replace('/finance/branches');
  }, [router]);

  return (
    <ModuleLayout
      title="Branch Operations"
      description="View and manage branch operations"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Branch Management', href: '/finance/branches' },
        { label: 'Branch Operations' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to branch operations...</p>
      </div>
    </ModuleLayout>
  );
}

