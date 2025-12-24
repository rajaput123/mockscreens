'use client';

import { useState } from 'react';
import { Transaction } from '../../../components/finance/types';
import StatsCards from '../../../components/finance/StatsCards';
import TransactionLedgerTab from '../../../components/finance/TransactionLedgerTab';
import FinancialReportsTab from '../../../components/finance/FinancialReportsTab';
import RecordTransactionModal from '../../../components/finance/RecordTransactionModal';
import TransactionDetailModal from '../../../components/finance/TransactionDetailModal';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import ModuleNavigation from '../../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../../components/navigation/navigationData';

export default function FinancialDashboardPage() {
  const [activeTab, setActiveTab] = useState<'ledger' | 'reports'>('ledger');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([
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
    {
      id: '2',
      type: 'expense',
      category: 'Operations',
      subCategory: 'Utilities',
      amount: 15000,
      description: 'Electricity bill for March',
      date: '2024-03-14',
      paymentMethod: 'online',
      referenceNumber: 'EB-2024-03',
      status: 'completed',
      createdAt: '2024-03-14T09:00:00Z',
      updatedAt: '2024-03-14T09:00:00Z',
    },
    {
      id: '3',
      type: 'income',
      category: 'Temple Collections',
      amount: 25000,
      description: 'Prasad sales revenue',
      date: '2024-03-13',
      paymentMethod: 'cash',
      status: 'completed',
      createdAt: '2024-03-13T15:00:00Z',
      updatedAt: '2024-03-13T15:00:00Z',
    },
    {
      id: '4',
      type: 'expense',
      category: 'Maintenance',
      subCategory: 'Repairs',
      amount: 35000,
      description: 'Temple hall renovation work',
      date: '2024-03-12',
      paymentMethod: 'cheque',
      referenceNumber: 'CHQ-12345',
      vendorId: 'v1',
      vendorName: 'ABC Construction',
      status: 'pending',
      createdAt: '2024-03-12T11:00:00Z',
      updatedAt: '2024-03-12T11:00:00Z',
    },
    {
      id: '5',
      type: 'income',
      category: 'Donations',
      subCategory: 'Event',
      amount: 100000,
      description: 'Festival donation collection',
      date: '2024-03-10',
      paymentMethod: 'bank_transfer',
      referenceNumber: 'TXN-2024-002',
      status: 'completed',
      createdAt: '2024-03-10T14:00:00Z',
      updatedAt: '2024-03-10T14:00:00Z',
    },
  ]);

  const calculateStats = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyIncome = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && 
               t.status === 'completed' &&
               date.getMonth() === currentMonth &&
               date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               t.status === 'completed' &&
               date.getMonth() === currentMonth &&
               date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDonations = transactions
      .filter(t => t.type === 'income' && t.category === 'Donations' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      pendingTransactions: transactions.filter(t => t.status === 'pending').length,
      totalDonations,
      totalAssets: 5000000,
      totalVendors: 25,
      totalBranches: 5,
      compliancePending: 3,
    };
  };

  const stats = calculateStats();

  const handleSaveTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const module = navigationMenus.finance.find(m => m.id === 'accounts-financial');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  return (
    <ModuleLayout
      title="Financial Dashboard"
      description="Manage accounts, transactions, and financial workflows"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance', href: '#' },
        { label: 'Accounts & Financial Workflow', href: '#' },
        { label: 'Financial Dashboard' },
      ]}
      action={
        <button
          onClick={() => setShowRecordModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Record Transaction
        </button>
      }
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="accounts-financial"
        category="finance"
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 bg-gray-50/50 rounded-t-2xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-6 py-3 font-medium transition-all duration-200 rounded-xl ${
            activeTab === 'ledger'
              ? 'bg-white text-amber-600 shadow-sm border border-amber-100'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          Transaction Ledger
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 font-medium transition-all duration-200 rounded-xl ${
            activeTab === 'reports'
              ? 'bg-white text-amber-600 shadow-sm border border-amber-100'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          Financial Reports
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Tab Content */}
      {activeTab === 'ledger' && (
        <TransactionLedgerTab 
          transactions={transactions} 
          onTransactionClick={setSelectedTransaction}
        />
      )}

      {activeTab === 'reports' && (
        <FinancialReportsTab 
          transactions={transactions}
          stats={stats}
        />
      )}

      {/* Modals */}
      {showRecordModal && (
        <RecordTransactionModal 
          onClose={() => setShowRecordModal(false)}
          onSave={handleSaveTransaction}
        />
      )}

      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onEdit={(transaction) => {
            console.log('Edit transaction:', transaction);
          }}
          onDelete={(transactionId) => {
            setTransactions(transactions.filter(t => t.id !== transactionId));
          }}
        />
      )}
    </ModuleLayout>
  );
}

