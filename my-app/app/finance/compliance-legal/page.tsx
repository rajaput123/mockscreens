'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../components/layout/ModuleLayout';

export default function ComplianceLegalPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the actual compliance page
    router.replace('/finance/compliance');
  }, [router]);

  return (
    <ModuleLayout
      title="Compliance & Legal"
      description="Manage compliance, audits, and legal documents"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Compliance & Legal' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to compliance management...</p>
      </div>
    </ModuleLayout>
  );
}

