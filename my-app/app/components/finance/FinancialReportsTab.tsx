'use client';

import { Transaction } from './types';

interface FinancialReportsTabProps {
  transactions: Transaction[];
  stats: {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    pendingTransactions: number;
    totalDonations: number;
  };
}

export default function FinancialReportsTab({ transactions, stats }: FinancialReportsTabProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(2)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  // Calculate category-wise breakdown
  const categoryBreakdown = transactions.reduce((acc, t) => {
    if (t.status === 'completed') {
      if (!acc[t.category]) {
        acc[t.category] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        acc[t.category].income += t.amount;
      } else {
        acc[t.category].expense += t.amount;
      }
    }
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Income</span>
              <span className="font-semibold text-amber-600">{formatCurrency(stats.monthlyIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expenses</span>
              <span className="font-semibold text-red-600">{formatCurrency(stats.monthlyExpenses)}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between">
              <span className="text-gray-600">Net</span>
              <span className={`font-semibold ${stats.monthlyIncome - stats.monthlyExpenses >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                {formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Income</span>
              <span className="font-semibold text-amber-600">{formatCurrency(stats.totalIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Expenses</span>
              <span className="font-semibold text-red-600">{formatCurrency(stats.totalExpenses)}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between">
              <span className="text-gray-600">Net Balance</span>
              <span className={`font-semibold ${stats.netBalance >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                {formatCurrency(stats.netBalance)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Transactions</span>
              <span className="font-semibold text-amber-600">{stats.pendingTransactions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Donations</span>
              <span className="font-semibold text-amber-600">{formatCurrency(stats.totalDonations)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Income</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Expenses</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(categoryBreakdown).map(([category, amounts]) => (
                <tr key={category}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{category}</td>
                  <td className="px-4 py-3 text-sm text-right text-amber-600">{formatCurrency(amounts.income)}</td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(amounts.expense)}</td>
                  <td className={`px-4 py-3 text-sm text-right font-semibold ${
                    amounts.income - amounts.expense >= 0 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(amounts.income - amounts.expense)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

