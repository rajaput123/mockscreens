'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function AddBranchPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to branches page (add branch functionality is available there)
    router.replace('/finance/branches?action=add');
  }, [router]);

  return (
    <ModuleLayout
      title="Add / Update Branch"
      description="Add a new branch or update existing branch"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Branch Management', href: '/finance/branches' },
        { label: 'Add / Update Branch' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to add branch...</p>
      </div>
    </ModuleLayout>
  );
}

