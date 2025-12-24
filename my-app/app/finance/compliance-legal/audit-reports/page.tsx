'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function AuditReportsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to compliance page (audit reports are shown there)
    router.replace('/finance/compliance');
  }, [router]);

  return (
    <ModuleLayout
      title="Audit Reports"
      description="View and generate audit reports"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Compliance & Legal', href: '/finance/compliance' },
        { label: 'Audit Reports' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to audit reports...</p>
      </div>
    </ModuleLayout>
  );
}

