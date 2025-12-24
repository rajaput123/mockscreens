'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function BranchDirectoryPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to branches page
    router.replace('/finance/branches');
  }, [router]);

  return (
    <ModuleLayout
      title="Branch Directory"
      description="View and manage branch directory"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Branch Management', href: '/finance/branches' },
        { label: 'Branch Directory' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to branch directory...</p>
      </div>
    </ModuleLayout>
  );
}

