'use client';

import { useState } from 'react';
import { Transaction } from '../../../components/finance/types';
import FinancialReportsTab from '../../../components/finance/FinancialReportsTab';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import ModuleNavigation from '../../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../../components/navigation/navigationData';

export default function FinancialReportsPage() {
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

  const stats = {
    totalIncome: 175000,
    totalExpenses: 50000,
    netBalance: 125000,
    monthlyIncome: 175000,
    monthlyExpenses: 50000,
    pendingTransactions: 1,
    totalDonations: 150000,
    totalAssets: 5000000,
    totalVendors: 25,
    totalBranches: 5,
    compliancePending: 3,
  };

  const module = navigationMenus.finance.find(m => m.id === 'accounts-financial');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  return (
    <ModuleLayout
      title="Financial Reports"
      description="Generate and view comprehensive financial reports"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance', href: '#' },
        { label: 'Accounts & Financial Workflow', href: '#' },
        { label: 'Financial Reports' },
      ]}
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="accounts-financial"
        category="finance"
      />

      <FinancialReportsTab 
        transactions={transactions}
        stats={stats}
      />
    </ModuleLayout>
  );
}

