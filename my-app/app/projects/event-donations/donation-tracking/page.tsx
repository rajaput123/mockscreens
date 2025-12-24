'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function DonationTrackingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main event donations page with donations tab active
    router.replace('/projects/event-donations?tab=donations');
  }, [router]);

  return (
    <ModuleLayout
      title="Donation Tracking"
      description="Track donations for events"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Event Donations', href: '/projects/event-donations' },
        { label: 'Donation Tracking' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to donation tracking...</p>
      </div>
    </ModuleLayout>
  );
}

