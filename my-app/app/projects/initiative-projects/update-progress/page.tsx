'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function UpdateProgressPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main initiative projects page (progress can be updated from project detail modal)
    router.replace('/projects/initiative-projects');
  }, [router]);

  return (
    <ModuleLayout
      title="Update Progress"
      description="Update progress for initiatives and projects"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Initiative & Project Management', href: '/projects/initiative-projects' },
        { label: 'Update Progress' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to project management...</p>
      </div>
    </ModuleLayout>
  );
}

