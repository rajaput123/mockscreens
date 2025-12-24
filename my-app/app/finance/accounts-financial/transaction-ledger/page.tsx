'use client';

import { useState } from 'react';
import { Transaction } from '../../../components/finance/types';
import TransactionLedgerTab from '../../../components/finance/TransactionLedgerTab';
import TransactionDetailModal from '../../../components/finance/TransactionDetailModal';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import ModuleNavigation from '../../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../../components/navigation/navigationData';

export default function TransactionLedgerPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      category: 'Donations',
      subCategory: 'General',
      amount: 50000,
      description: 'Monthly donation from devotees',
      date: '2024-03-15',
      paymentMethod: 'bank_transfer',
      referenceNumber: 'TXN-2024-001',
      status: 'completed',
      createdAt: '2024-03-15T10:00:00Z',
      updatedAt: '2024-03-15T10:00:00Z',
    },
  ]);

  const module = navigationMenus.finance.find(m => m.id === 'accounts-financial');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  return (
    <ModuleLayout
      title="Transaction Ledger"
      description="View and manage all financial transactions"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance', href: '#' },
        { label: 'Accounts & Financial Workflow', href: '#' },
        { label: 'Transaction Ledger' },
      ]}
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="accounts-financial"
        category="finance"
      />

      <TransactionLedgerTab 
        transactions={transactions} 
        onTransactionClick={setSelectedTransaction}
      />

      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onEdit={(transaction) => {
            console.log('Edit transaction:', transaction);
          }}
          onDelete={(transactionId) => {
            console.log('Delete transaction:', transactionId);
          }}
        />
      )}
    </ModuleLayout>
  );
}

