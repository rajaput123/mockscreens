'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Certificate80G } from '../../../components/finance/types';
import Generate80GModal from '../../../components/finance/Generate80GModal';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import ModuleNavigation from '../../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../../components/navigation/navigationData';

export default function Generate80GPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);

  const handleGenerate = (certificateData: Omit<Certificate80G, 'id' | 'certificateNumber' | 'createdAt' | 'updatedAt'>) => {
    console.log('Certificate generated:', certificateData);
    router.push('/finance/donations-80g/80g-certificates');
  };

  const module = navigationMenus.finance.find(m => m.id === 'donations-80g');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  return (
    <ModuleLayout
      title="Generate 80G Certificate"
      description="Create a new 80G tax exemption certificate"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance', href: '#' },
        { label: 'Donations & 80G', href: '#' },
        { label: 'Generate 80G Certificate' },
      ]}
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="donations-80g"
        category="finance"
      />

      {showModal && (
        <Generate80GModal 
          onClose={() => router.push('/finance/donations-80g/80g-certificates')}
          onGenerate={handleGenerate}
        />
      )}
    </ModuleLayout>
  );
}

