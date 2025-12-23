'use client';

import Link from 'next/link';
import { colors, spacing, typography } from '../design-system';
import Header from '../components/layout/Header';
import Breadcrumbs from '../components/layout/Breadcrumbs';

export default function HelpPage() {
  const categories = [
    {
      id: 'operations',
      title: 'Operations',
      description: 'Daily operations, tasks, rituals, bookings, and facility management',
      icon: '⚙️',
      topics: [
        'Creating daily operations plans',
        'Task and workflow management',
        'Ritual, Seva & Booking Management',
        'Crowd & capacity management',
        'Kitchen & prasad operations',
        'Inventory management',
        'Facilities management',
      ],
    },
    {
      id: 'people',
      title: 'People',
      description: 'Employees, volunteers, devotees, and content management',
      icon: '👥',
      topics: [
        'Employee Management',
        'Task assignment',
        'Volunteer management',
        'Freelancer management',
        'Devotee management',
        'VIP devotee management',
        'Content management',
        'PR & communications',
      ],
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Events, initiatives, and donation management',
      icon: '📅',
      topics: [
        'Event Management',
        'Event donations',
        'Initiative & project management',
        'Initiative donations',
      ],
    },
    {
      id: 'finance',
      title: 'Finance',
      description: 'Accounts, donations, compliance, and financial reporting',
      icon: '💰',
      topics: [
        'Accounts & financial workflow',
        'Donations & 80G',
        'Compliance & legal',
        'Asset & property management',
        'Supplier/vendor management',
        'Branch management',
        'Reports & audit',
      ],
    },
  ];

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
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/' }, { label: 'Help' }]} />
        
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
            Help & Documentation
          </h1>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              lineHeight: typography.body.lineHeight,
              color: colors.text.muted,
            }}
          >
            Find guides, tutorials, and answers to common questions about using the Namaha Temple Management System.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/help/${category.id}`}
              className="block p-6 rounded-3xl transition-all hover:shadow-lg"
              style={{
                backgroundColor: colors.background.base,
                border: `1px solid ${colors.border}`,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.primary.base;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{category.icon}</div>
                <div className="flex-1">
                  <h2
                    style={{
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.sectionHeader.fontSize,
                      fontWeight: typography.sectionHeader.fontWeight,
                      color: colors.primary.base,
                      marginBottom: spacing.sm,
                    }}
                  >
                    {category.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.muted,
                      marginBottom: spacing.base,
                    }}
                  >
                    {category.description}
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    {category.topics.slice(0, 3).map((topic, index) => (
                      <li
                        key={index}
                        style={{
                          fontFamily: typography.bodySmall.fontFamily,
                          fontSize: typography.bodySmall.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {topic}
                      </li>
                    ))}
                    {category.topics.length > 3 && (
                      <li
                        style={{
                          fontFamily: typography.bodySmall.fontFamily,
                          fontSize: typography.bodySmall.fontSize,
                          color: colors.text.muted,
                          fontStyle: 'italic',
                        }}
                      >
                        +{category.topics.length - 3} more topics
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div
          className="p-6 rounded-3xl"
          style={{
            backgroundColor: colors.background.subtle,
            border: `1px solid ${colors.border}`,
          }}
        >
          <h2
            className="mb-4"
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              color: colors.primary.base,
            }}
          >
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Dashboard Overview', href: '/help#dashboard' },
              { label: 'Add Employee', href: '/help#employee-management' },
              { label: 'Create Booking', href: '/help#create-booking' },
              { label: 'Financial Dashboard', href: '/help#financial-dashboard' },
              { label: 'Create Event', href: '/help#create-event' },
            ].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="px-4 py-2 rounded-2xl transition-colors"
                style={{
                  fontFamily: typography.link.fontFamily,
                  fontSize: typography.link.fontSize,
                  color: colors.primary.base,
                  backgroundColor: colors.background.base,
                  textDecoration: 'none',
                  border: `1px solid ${colors.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary.base;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background.base;
                  e.currentTarget.style.color = colors.primary.base;
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
