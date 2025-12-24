'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function ViewAuditLogsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to compliance page (audit logs are shown there)
    router.replace('/finance/compliance');
  }, [router]);

  return (
    <ModuleLayout
      title="View Audit Logs"
      description="View audit logs and activity history"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Reports & Audit' },
        { label: 'View Audit Logs' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to audit logs...</p>
      </div>
    </ModuleLayout>
  );
}

