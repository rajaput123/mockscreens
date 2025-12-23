'use client';

import { navigationMenus } from '../../components/navigation/navigationData';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import { colors, spacing, typography } from '../../design-system';

export default function BranchManagementPage() {
  const module = navigationMenus.finance.find(m => m.id === 'branch-management');
  
  if (!module) {
    return <div>Module not found</div>;
  }

  return (
    <ModuleLayout
      title="Branch Management"
      description="Manage branches and multi-location operations"
    >
      <ModuleNavigation
        subServices={module.subServices}
        functions={module.functions}
        moduleId={module.id}
        category="finance"
      />

      {/* Dashboard Overview */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        style={{ gap: spacing.lg, marginBottom: spacing.xl }}
      >
        <div 
          className="rounded-3xl p-6"
          style={{
            backgroundColor: colors.background.base,
            border: `1px solid ${colors.border}`,
            padding: spacing.xl,
          }}
        >
          <h3
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              marginBottom: spacing.sm,
              color: colors.text.primary,
            }}
          >
            Total Branches
          </h3>
          <p
            style={{
              fontFamily: typography.kpi.fontFamily,
              fontSize: '32px',
              fontWeight: typography.kpi.fontWeight,
              color: colors.primary.base,
            }}
          >
            0
          </p>
        </div>

        <div 
          className="rounded-3xl p-6"
          style={{
            backgroundColor: colors.background.base,
            border: `1px solid ${colors.border}`,
            padding: spacing.xl,
          }}
        >
          <h3
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              marginBottom: spacing.sm,
              color: colors.text.primary,
            }}
          >
            Active Branches
          </h3>
          <p
            style={{
              fontFamily: typography.kpi.fontFamily,
              fontSize: '32px',
              fontWeight: typography.kpi.fontWeight,
              color: colors.primary.base,
            }}
          >
            0
          </p>
        </div>

        <div 
          className="rounded-3xl p-6"
          style={{
            backgroundColor: colors.background.base,
            border: `1px solid ${colors.border}`,
            padding: spacing.xl,
          }}
        >
          <h3
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              marginBottom: spacing.sm,
              color: colors.text.primary,
            }}
          >
            Total Operations
          </h3>
          <p
            style={{
              fontFamily: typography.kpi.fontFamily,
              fontSize: '32px',
              fontWeight: typography.kpi.fontWeight,
              color: colors.primary.base,
            }}
          >
            0
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div 
        className="rounded-3xl p-6"
        style={{
          backgroundColor: colors.background.base,
          border: `1px solid ${colors.border}`,
          padding: spacing.xl,
        }}
      >
        <h2
          style={{
            fontFamily: typography.sectionHeader.fontFamily,
            fontSize: typography.sectionHeader.fontSize,
            fontWeight: typography.sectionHeader.fontWeight,
            marginBottom: spacing.lg,
            color: colors.text.primary,
          }}
        >
          Quick Actions
        </h2>
        <p
          style={{
            fontFamily: typography.body.fontFamily,
            fontSize: typography.body.fontSize,
            color: colors.text.muted,
          }}
        >
          Use the navigation above to access branch directory, add or update branches, manage branch operations, and view branch reports.
        </p>
      </div>
    </ModuleLayout>
  );
}
