'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function AuditTrailPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to compliance page (audit trail is shown there)
    router.replace('/finance/compliance');
  }, [router]);

  return (
    <ModuleLayout
      title="Audit Trail"
      description="View audit trail and activity logs"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Reports & Audit' },
        { label: 'Audit Trail' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to audit trail...</p>
      </div>
    </ModuleLayout>
  );
}

