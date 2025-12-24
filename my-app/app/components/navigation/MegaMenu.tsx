'use client';

import Link from 'next/link';
import { colors, spacing, typography, animations } from '../../design-system';
import { MenuCategory } from './navigationData';

interface MegaMenuProps {
  categories: MenuCategory[];
  activeCategory: string | null;
  onCategoryChange: (categoryId: string) => void;
  onMouseLeave: () => void;
  onMouseEnter?: () => void;
}

export default function MegaMenu({
  categories,
  activeCategory,
  onCategoryChange,
  onMouseLeave,
  onMouseEnter,
}: MegaMenuProps) {
  const currentCategory = categories.find(cat => cat.id === activeCategory) || categories[0];

  return (
    <div
      data-mega-menu
      className="fixed left-0"
      style={{
        zIndex: 1000,
        width: '100vw',
        top: spacing.headerHeight,
        left: 0,
        paddingTop: '8px',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Invisible bridge area to prevent gap */}
      <div
        style={{
          position: 'absolute',
          top: '-8px',
          left: 0,
          right: 0,
          height: '8px',
          pointerEvents: 'auto',
        }}
      />
      <div
        className={`bg-white rounded-3xl shadow-xl border border-gray-200 ${animations.fadeInDown} ${animations.transitionAll}`}
        style={{
          maxWidth: '95vw',
          width: '95vw',
          margin: '0 auto',
          padding: spacing.lg,
          paddingLeft: spacing.contentPadding,
          paddingRight: spacing.contentPadding,
        }}
      >
        <div 
          className="flex"
          style={{ gap: spacing.xl }}
        >
          {/* Left Column - Main Categories */}
          <div 
            className="flex-shrink-0 border-r"
            style={{ 
              width: '320px',
              paddingRight: spacing.lg,
              borderColor: colors.border,
            }}
          >
            {categories.map((category) => {
              // Determine category from context - we need to get this from props
              const categoryMap: Record<string, string> = {
                'operational-planning': 'operations',
                'task-workflow': 'operations',
                'ritual-seva-booking': 'operations',
                'crowd-capacity': 'operations',
                'kitchen-prasad': 'operations',
                'perishable-inventory': 'operations',
                'facilities-infrastructure': 'operations',
                'employee-management': 'people',
                'task-assignment': 'people',
                'volunteer-management': 'people',
                'freelancer-management': 'people',
                'devotee-management': 'people',
                'vip-devotee': 'people',
                'content-management': 'people',
                'pr-communications': 'people',
                'event-management': 'projects',
                'event-donations': 'projects',
                'initiative-projects': 'projects',
                'initiative-donations': 'projects',
                'accounts-financial': 'finance',
                'donations-80g': 'finance',
                'compliance-legal': 'finance',
                'asset-property': 'finance',
                'supplier-vendor': 'finance',
                'branch-management': 'finance',
                'reports-audit': 'finance',
              };
              const cat = categoryMap[category.id] || 'operations';
              const href = `/${cat}/${category.id}`;
              
              return (
                <Link
                  key={category.id}
                  href={href}
                  className={`rounded-2xl cursor-pointer ${animations.transitionAll} ${animations.hoverLift}`}
                  style={{
                    paddingTop: spacing.base,
                    paddingBottom: spacing.base,
                    paddingLeft: spacing.base,
                    paddingRight: spacing.base,
                    marginBottom: spacing.sm,
                    backgroundColor: activeCategory === category.id ? colors.background.subtle : 'transparent',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                  onMouseEnter={() => onCategoryChange(category.id)}
                >
                  <span
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 500,
                      color: activeCategory === category.id ? colors.primary.base : colors.text.primary,
                      lineHeight: '1.5',
                    }}
                  >
                    {category.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Columns - Sub Services and Functions */}
          <div 
            className="flex-1 grid grid-cols-3"
            style={{ gap: spacing.xl }}
          >
            {/* Sub Services Column */}
            <div>
              <div
                className="border-b"
                style={{
                  marginBottom: spacing.base,
                  paddingBottom: spacing.sm,
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: colors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Manage
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {currentCategory.subServices.map((item) => {
                  // Determine category from currentCategory context
                  const categoryMap: Record<string, string> = {
                    'operational-planning': 'operations',
                    'task-workflow': 'operations',
                    'ritual-seva-booking': 'operations',
                    'crowd-capacity': 'operations',
                    'kitchen-prasad': 'operations',
                    'perishable-inventory': 'operations',
                    'facilities-infrastructure': 'operations',
                    'employee-management': 'people',
                    'task-assignment': 'people',
                    'volunteer-management': 'people',
                    'freelancer-management': 'people',
                    'devotee-management': 'people',
                    'vip-devotee': 'people',
                    'content-management': 'people',
                    'pr-communications': 'people',
                    'event-management': 'projects',
                    'event-donations': 'projects',
                    'initiative-projects': 'projects',
                    'initiative-donations': 'projects',
                    'accounts-financial': 'finance',
                    'donations-80g': 'finance',
                    'compliance-legal': 'finance',
                    'asset-property': 'finance',
                    'supplier-vendor': 'finance',
                    'branch-management': 'finance',
                    'reports-audit': 'finance',
                  };
                  const category = categoryMap[currentCategory.id] || 'operations';
                  // Special handling for create-event - link to event management page with query param
                  let href = `/${category}/${currentCategory.id}/${item.id}`;
                  if (item.id === 'create-event' && currentCategory.id === 'event-management') {
                    href = `/${category}/${currentCategory.id}?action=create`;
                  }
                  
                  return (
                    <Link
                      key={item.id}
                      href={href}
                      className={`flex items-center rounded-2xl hover:bg-gray-50 cursor-pointer ${animations.transitionAll} ${animations.hoverLift}`}
                      style={{
                        gap: spacing.md,
                        paddingTop: spacing.sm,
                        paddingBottom: spacing.sm,
                        paddingLeft: spacing.sm,
                        paddingRight: spacing.sm,
                        textDecoration: 'none',
                      }}
                    >
                      <div
                        className="rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: colors.background.subtle,
                          color: colors.primary.base,
                        }}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                          lineHeight: '1.5',
                        }}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Functions Column */}
            <div>
              <div
                className="border-b"
                style={{
                  marginBottom: spacing.base,
                  paddingBottom: spacing.sm,
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: colors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                View
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {currentCategory.functions.map((item) => {
                  // Determine category from currentCategory context
                  const categoryMap: Record<string, string> = {
                    'operational-planning': 'operations',
                    'task-workflow': 'operations',
                    'ritual-seva-booking': 'operations',
                    'crowd-capacity': 'operations',
                    'kitchen-prasad': 'operations',
                    'perishable-inventory': 'operations',
                    'facilities-infrastructure': 'operations',
                    'employee-management': 'people',
                    'task-assignment': 'people',
                    'volunteer-management': 'people',
                    'freelancer-management': 'people',
                    'devotee-management': 'people',
                    'vip-devotee': 'people',
                    'content-management': 'people',
                    'pr-communications': 'people',
                    'event-management': 'projects',
                    'event-donations': 'projects',
                    'initiative-projects': 'projects',
                    'initiative-donations': 'projects',
                    'accounts-financial': 'finance',
                    'donations-80g': 'finance',
                    'compliance-legal': 'finance',
                    'asset-property': 'finance',
                    'supplier-vendor': 'finance',
                    'branch-management': 'finance',
                    'reports-audit': 'finance',
                  };
                  const category = categoryMap[currentCategory.id] || 'operations';
                  // If item.id is empty, it means it's the main dashboard (root page)
                  const href = item.id ? `/${category}/${currentCategory.id}/${item.id}` : `/${category}/${currentCategory.id}`;
                  
                  return (
                    <Link
                      key={item.id}
                      href={href}
                      className={`flex items-center rounded-2xl hover:bg-gray-50 cursor-pointer ${animations.transitionAll} ${animations.hoverLift}`}
                      style={{
                        gap: spacing.md,
                        paddingTop: spacing.sm,
                        paddingBottom: spacing.sm,
                        paddingLeft: spacing.sm,
                        paddingRight: spacing.sm,
                        textDecoration: 'none',
                      }}
                    >
                      <div
                        className="rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: colors.background.subtle,
                          color: colors.primary.base,
                        }}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                          lineHeight: '1.5',
                        }}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
