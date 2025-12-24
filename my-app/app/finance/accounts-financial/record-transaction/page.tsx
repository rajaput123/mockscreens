'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Transaction } from '../../../components/finance/types';
import RecordTransactionModal from '../../../components/finance/RecordTransactionModal';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import ModuleNavigation from '../../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../../components/navigation/navigationData';

export default function RecordTransactionPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);

  const handleSave = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Transaction saved:', transactionData);
    router.push('/finance/accounts-financial/financial-dashboard');
  };

  const module = navigationMenus.finance.find(m => m.id === 'accounts-financial');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  return (
    <ModuleLayout
      title="Record Transaction"
      description="Add a new financial transaction"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance', href: '#' },
        { label: 'Accounts & Financial Workflow', href: '#' },
        { label: 'Record Transaction' },
      ]}
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="accounts-financial"
        category="finance"
      />

      {showModal && (
        <RecordTransactionModal 
          onClose={() => router.push('/finance/accounts-financial/financial-dashboard')}
          onSave={handleSave}
        />
      )}
    </ModuleLayout>
  );
}

