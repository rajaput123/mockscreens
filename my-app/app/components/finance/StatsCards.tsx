'use client';

interface StatsCardsProps {
  stats: {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    pendingTransactions: number;
    totalDonations: number;
    totalAssets: number;
    totalVendors: number;
    totalBranches: number;
    compliancePending: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-md border border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-700 mb-2">Total Income</p>
            <p className="text-3xl font-bold text-amber-900">{formatCurrency(stats.totalIncome)}</p>
          </div>
          <div className="w-14 h-14 bg-green-200 rounded-2xl flex items-center justify-center">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-md border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-700 mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-red-900">{formatCurrency(stats.totalExpenses)}</p>
          </div>
          <div className="w-14 h-14 bg-red-200 rounded-2xl flex items-center justify-center">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-md border border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-700 mb-2">Net Balance</p>
            <p className={`text-3xl font-bold ${stats.netBalance >= 0 ? 'text-amber-900' : 'text-red-900'}`}>
              {formatCurrency(stats.netBalance)}
            </p>
          </div>
          <div className="w-14 h-14 bg-blue-200 rounded-2xl flex items-center justify-center">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-md border border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-700 mb-2">Total Donations</p>
            <p className="text-3xl font-bold text-purple-900">{formatCurrency(stats.totalDonations)}</p>
          </div>
          <div className="w-14 h-14 bg-purple-200 rounded-2xl flex items-center justify-center">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

