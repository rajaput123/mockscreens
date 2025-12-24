'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function ProjectReportsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main initiative projects page with reports tab active
    router.replace('/projects/initiative-projects?tab=reports');
  }, [router]);

  return (
    <ModuleLayout
      title="Project Reports"
      description="Generate and view project reports"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Initiative & Project Management', href: '/projects/initiative-projects' },
        { label: 'Project Reports' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to project reports...</p>
      </div>
    </ModuleLayout>
  );
}

