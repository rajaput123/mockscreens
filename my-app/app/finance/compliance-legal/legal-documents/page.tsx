'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function LegalDocumentsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to compliance page (legal documents are managed there)
    router.replace('/finance/compliance');
  }, [router]);

  return (
    <ModuleLayout
      title="Legal Documents"
      description="Manage legal documents and filings"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance' },
        { label: 'Compliance & Legal', href: '/finance/compliance' },
        { label: 'Legal Documents' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to legal documents...</p>
      </div>
    </ModuleLayout>
  );
}

