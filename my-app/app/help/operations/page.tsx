'use client';

import { colors, spacing, typography } from '../../design-system';
import Header from '../../components/layout/Header';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

export default function OperationsHelpPage() {
  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background.base }}
    >
      <Header />
      <main 
        className="mx-auto max-w-7xl container-responsive"
        style={{ 
          paddingLeft: spacing.contentPadding,
          paddingRight: spacing.contentPadding,
          paddingTop: spacing.contentPaddingY,
          paddingBottom: spacing.contentPaddingY,
        }}
      >
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Help', href: '/help' },
          { label: 'Operations' }
        ]} />
        
        <div className="mb-8">
          <h1
            style={{
              fontFamily: typography.pageTitle.fontFamily,
              fontSize: typography.pageTitle.fontSize,
              fontWeight: typography.pageTitle.fontWeight,
              color: colors.primary.base,
              marginBottom: spacing.base,
            }}
          >
            Operations Help
          </h1>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              lineHeight: typography.body.lineHeight,
              color: colors.text.muted,
            }}
          >
            Learn how to manage daily operations, tasks, rituals, bookings, and facilities.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              title: 'Creating Daily Operations Plans',
              content: 'Plan and manage your daily temple operations efficiently.',
            },
            {
              title: 'Task & Workflow Orchestration',
              content: 'Create, assign, and track tasks across your organization.',
            },
            {
              title: 'Ritual, Seva & Booking Management',
              content: 'Define seva types, schedule services, create bookings, and execute rituals.',
            },
            {
              title: 'Crowd & Capacity Management',
              content: 'Monitor and manage crowd capacity for events and daily operations.',
            },
            {
              title: 'Kitchen & Prasad Operations',
              content: 'Plan prasad menus and manage kitchen schedules.',
            },
            {
              title: 'Inventory Management',
              content: 'Track perishable inventory, stock levels, and wastage.',
            },
            {
              title: 'Facilities Management',
              content: 'Manage lodges, parking, and infrastructure maintenance.',
            },
          ].map((section, index) => (
            <div
              key={index}
              className="p-6 rounded-3xl"
              style={{
                backgroundColor: colors.background.base,
                border: `1px solid ${colors.border}`,
              }}
            >
              <h2
                style={{
                  fontFamily: typography.sectionHeader.fontFamily,
                  fontSize: typography.sectionHeader.fontSize,
                  fontWeight: typography.sectionHeader.fontWeight,
                  color: colors.primary.base,
                  marginBottom: spacing.sm,
                }}
              >
                {section.title}
              </h2>
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.primary,
                }}
              >
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
