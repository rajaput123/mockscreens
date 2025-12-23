'use client';

import { colors, spacing, typography } from '../../design-system';
import Header from '../../components/layout/Header';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

export default function ProjectsHelpPage() {
  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background.base }}
    >
      <Header />
      <main 
        className="mx-auto"
        style={{ 
          maxWidth: spacing.containerMaxWidth,
          paddingLeft: spacing.contentPadding,
          paddingRight: spacing.contentPadding,
          paddingTop: spacing.contentPaddingY,
          paddingBottom: spacing.contentPaddingY,
        }}
      >
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Help', href: '/help' },
          { label: 'Projects' }
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
            Projects Help
          </h1>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              lineHeight: typography.body.lineHeight,
              color: colors.text.muted,
            }}
          >
            Learn how to manage events, initiatives, and donations.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              title: 'Event Management',
              content: 'Create, execute, and manage temple events and festivals. View event calendars and generate reports.',
            },
            {
              title: 'Event Donations',
              content: 'Accept and track donations for specific events.',
            },
            {
              title: 'Initiative & Project Management',
              content: 'Create initiatives, update progress, and manage project timelines.',
            },
            {
              title: 'Initiative Donations',
              content: 'Receive and track donations for specific initiatives and projects.',
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
