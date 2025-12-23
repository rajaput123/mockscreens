'use client';

import { navigationMenus } from '../../components/navigation/navigationData';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import HelpButton from '../../components/help/HelpButton';
import { colors, spacing, typography } from '../../design-system';

export default function RitualSevaBookingPage() {
  const module = navigationMenus.operations.find(m => m.id === 'ritual-seva-booking');
  
  if (!module) {
    return <div>Module not found</div>;
  }

  return (
    <ModuleLayout
      title="Ritual, Seva & Booking Management"
      description="Manage rituals, seva, and bookings"
    >
      <ModuleNavigation
        subServices={module.subServices}
        functions={module.functions}
        moduleId={module.id}
        category="operations"
      />

      {/* Dashboard Overview */}
      <div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
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
            Total Bookings
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
            Scheduled Seva
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
            Today's Rituals
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
            Pending Actions
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
          Use the navigation above to define seva, schedule seva, execute seva, create bookings, view seva calendar, manage bookings, and view ritual schedules.
        </p>
      </div>
      <HelpButton module="ritual-seva-booking" />
    </ModuleLayout>
  );
}
