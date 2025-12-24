'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function ProjectTimelinePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main initiative projects page with timeline tab active
    router.replace('/projects/initiative-projects?tab=timeline');
  }, [router]);

  return (
    <ModuleLayout
      title="Project Timeline"
      description="View project timelines and milestones"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Initiative & Project Management', href: '/projects/initiative-projects' },
        { label: 'Project Timeline' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to project timeline...</p>
      </div>
    </ModuleLayout>
  );
}

