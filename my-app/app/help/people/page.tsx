'use client';

import { colors, spacing, typography } from '../../design-system';
import Header from '../../components/layout/Header';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

export default function PeopleHelpPage() {
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
          { label: 'People' }
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
            People Management Help
          </h1>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              lineHeight: typography.body.lineHeight,
              color: colors.text.muted,
            }}
          >
            Learn how to manage employees, volunteers, devotees, and content.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              title: 'Employee Management',
              content: 'Add, update, and manage employee records, roles, and access permissions.',
            },
            {
              title: 'Task Assignment',
              content: 'Assign tasks to employees and track their progress.',
            },
            {
              title: 'Volunteer Management',
              content: 'Onboard volunteers and assign duties.',
            },
            {
              title: 'Freelancer Management',
              content: 'Create contracts and manage freelancer work logs.',
            },
            {
              title: 'Devotee Management',
              content: 'Create and update devotee records and view their history.',
            },
            {
              title: 'VIP Devotee Management',
              content: 'Mark and manage VIP devotees with special services.',
            },
            {
              title: 'Content Management',
              content: 'Edit temple content and manage the content library.',
            },
            {
              title: 'PR & Communications',
              content: 'Publish announcements and manage communications.',
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
