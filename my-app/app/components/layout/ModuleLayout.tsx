'use client';

import { colors, spacing, typography, animations } from '../../design-system';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';

interface ModuleLayoutProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  action?: React.ReactNode;
}

export default function ModuleLayout({ children, title, description, breadcrumbs, action }: ModuleLayoutProps) {
  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background.base }}
    >
      <Header />

      {/* Main Content */}
      <main 
        className="mx-auto max-w-7xl container-responsive"
        style={{ 
          paddingLeft: spacing.contentPadding,
          paddingRight: spacing.contentPadding,
          paddingTop: spacing.contentPaddingY,
          paddingBottom: spacing.contentPaddingY,
        }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Page Header */}
        <div 
          className={`mb-12 flex items-start justify-between ${animations.fadeInUp}`}
          style={{ marginBottom: spacing.lg }}
        >
          <div className="flex-1 w-full">
            {typeof title === 'string' ? (
              <h1 
                style={{
                  fontFamily: typography.pageTitle.fontFamily,
                  fontSize: typography.pageTitle.fontSize,
                  fontWeight: typography.pageTitle.fontWeight,
                  lineHeight: typography.pageTitle.lineHeight,
                  marginBottom: spacing.sm,
                  color: colors.text.primary,
                }}
              >
                {title}
              </h1>
            ) : (
              <div style={{ marginBottom: spacing.sm }}>
                {title}
              </div>
            )}
            {description && (
              <p 
                style={{
                  fontFamily: typography.subtext.fontFamily,
                  fontSize: typography.subtext.fontSize,
                  fontWeight: typography.subtext.fontWeight,
                  lineHeight: typography.subtext.lineHeight,
                  color: typography.subtext.color,
                }}
              >
                {description}
              </p>
            )}
          </div>
          {action && (
            <div>
              {action}
            </div>
          )}
        </div>

        {/* Module Content */}
        <div className={animations.fadeInUp}>
          {children}
        </div>
      </main>
    </div>
  );
}
