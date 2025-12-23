'use client';

import ModuleLayout from '../../../components/layout/ModuleLayout';
import { colors, spacing, typography } from '../../../design-system';

export default function CreateDailyPlanPage() {
  return (
    <ModuleLayout
      title="Create Daily Operations Plan"
      description="Create a new daily operations plan"
    >
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
          Daily Operations Plan Form
        </h2>
        <p
          style={{
            fontFamily: typography.body.fontFamily,
            fontSize: typography.body.fontSize,
            color: colors.text.muted,
          }}
        >
          Daily operations plan form will be implemented here.
        </p>
      </div>
    </ModuleLayout>
  );
}
