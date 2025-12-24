'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function AcceptDonationsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main event donations page with action to open donation modal
    router.replace('/projects/event-donations?action=record');
  }, [router]);

  return (
    <ModuleLayout
      title="Accept Donations"
      description="Accept donations for events"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Event Donations', href: '/projects/event-donations' },
        { label: 'Accept Donations' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to donation form...</p>
      </div>
    </ModuleLayout>
  );
}

