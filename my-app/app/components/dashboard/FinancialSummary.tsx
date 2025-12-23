'use client';

import { colors, spacing, typography } from '../../design-system';

interface FinancialData {
  daily: {
    revenue: number;
    expenses: number;
    net: number;
    donations: number;
    trend: 'up' | 'down';
  };
  monthly: {
    revenue: number;
    expenses: number;
    net: number;
    donations: number;
    trend: 'up' | 'down';
  };
  yearly: {
    revenue: number;
    expenses: number;
    net: number;
    donations: number;
    trend: 'up' | 'down';
  };
}

interface ExpenseCategory {
  name: string;
  percentage: number;
  amount: number;
}

interface FinancialSummaryProps {
  financialData: FinancialData;
  expenseCategories: ExpenseCategory[];
}

export default function FinancialSummary({ financialData, expenseCategories }: FinancialSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6" style={{ gap: spacing.base, marginBottom: spacing.lg }}>
          <div>
            <div style={{ color: colors.text.muted, fontSize: typography.bodySmall.fontSize, marginBottom: spacing.xs }}>
              Daily Revenue
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600, color: colors.text.primary }}>
              {formatCurrency(financialData.daily.revenue)}
            </div>
          </div>
          <div>
            <div style={{ color: colors.text.muted, fontSize: typography.bodySmall.fontSize, marginBottom: spacing.xs }}>
              Monthly Revenue
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600, color: colors.text.primary }}>
              {formatCurrency(financialData.monthly.revenue)}
            </div>
          </div>
          <div>
            <div style={{ color: colors.text.muted, fontSize: typography.bodySmall.fontSize, marginBottom: spacing.xs }}>
              Yearly Revenue
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600, color: colors.text.primary }}>
              {formatCurrency(financialData.yearly.revenue)}
            </div>
          </div>
        </div>

        {/* Expense Categories */}
        <div>
          <h3 style={{ fontSize: typography.body.fontSize, fontWeight: 600, marginBottom: spacing.base, color: colors.text.primary }}>
            Expense Breakdown
          </h3>
          <div className="space-y-2">
            {expenseCategories.map((category, index) => (
              <div key={index} style={{ marginBottom: spacing.sm }}>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ fontSize: typography.bodySmall.fontSize, color: colors.text.primary }}>
                    {category.name}
                  </span>
                  <span style={{ fontSize: typography.bodySmall.fontSize, fontWeight: 600, color: colors.text.primary }}>
                    {formatCurrency(category.amount)}
                  </span>
                </div>
                <div 
                  className="h-2 rounded-xl"
                  style={{
                    backgroundColor: colors.background.subtle,
                  }}
                >
                  <div
                    className="h-full rounded-xl"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: colors.primary.base,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
