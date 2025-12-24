'use client';

import { colors, spacing, typography } from '../../design-system';
import Header from '../../components/layout/Header';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

export default function FinanceHelpPage() {
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
          { label: 'Finance' }
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
            Finance Help
          </h1>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              lineHeight: typography.body.lineHeight,
              color: colors.text.muted,
            }}
          >
            Learn how to manage accounts, donations, compliance, and financial reporting.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              title: 'Accounts & Financial Workflow',
              content: 'Record transactions, view financial dashboards, manage transaction ledgers, and generate financial reports.',
            },
            {
              title: 'Donations & 80G',
              content: 'Manage donations, generate 80G certificates, and create donation reports.',
            },
            {
              title: 'Compliance & Legal',
              content: 'File returns, manage audits, and maintain legal documents.',
            },
            {
              title: 'Asset & Property Management',
              content: 'Update property values, manage asset registers, and track asset valuations.',
            },
            {
              title: 'Supplier / Vendor Management',
              content: 'Add vendors, manage contracts, and track vendor performance.',
            },
            {
              title: 'Branch Management',
              content: 'Add and update branch information, manage branch operations, and generate branch reports.',
            },
            {
              title: 'Reports & Audit',
              content: 'View dashboards, access audit trails, and generate custom reports.',
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
