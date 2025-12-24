'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';

export default function DonationReportsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main event donations page with donations tab active (reports can be exported from there)
    router.replace('/projects/event-donations?tab=donations');
  }, [router]);

  return (
    <ModuleLayout
      title="Donation Reports"
      description="Generate reports for event donations"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Event Donations', href: '/projects/event-donations' },
        { label: 'Donation Reports' },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Redirecting to donation reports...</p>
      </div>
    </ModuleLayout>
  );
}

