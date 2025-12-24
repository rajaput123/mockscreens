'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function FileReturnsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to compliance page (file returns/audits are managed there)
    router.replace('/finance/compliance');
  }, [router]);

  return (
    <ModuleLayout
      title="File Returns / Audits"
      description="File tax returns and manage audits"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Compliance & Legal', href: '/finance/compliance' },
        { label: 'File Returns / Audits' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to file returns...</p>
      </div>
    </ModuleLayout>
  );
}

