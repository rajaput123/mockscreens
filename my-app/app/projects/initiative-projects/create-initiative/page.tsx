'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function CreateInitiativePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main initiative projects page with action to open create modal
    router.replace('/projects/initiative-projects?action=create');
  }, [router]);

  return (
    <ModuleLayout
      title="Create Initiative"
      description="Create a new initiative or project"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Initiative & Project Management', href: '/projects/initiative-projects' },
        { label: 'Create Initiative' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to create initiative form...</p>
      </div>
    </ModuleLayout>
  );
}

