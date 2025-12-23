'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { colors, spacing, typography } from '../../design-system';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Auto-generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    
    const paths = pathname?.split('/').filter(Boolean) || [];
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/' },
    ];

    if (paths.length === 0) return breadcrumbs;

    // Map category names
    const categoryMap: Record<string, string> = {
      'operations': 'Operations',
      'people': 'People',
      'projects': 'Projects',
      'finance': 'Finance',
    };

    // Map module IDs to labels (from navigationData)
    const moduleMap: Record<string, string> = {
      'operational-planning': 'Operational Planning & Control',
      'task-workflow': 'Task & Workflow Orchestration',
      'ritual-seva-booking': 'Ritual, Seva & Booking Management',
      'crowd-capacity': 'Crowd & Capacity Management',
      'kitchen-prasad': 'Kitchen & Prasad Operations',
      'perishable-inventory': 'Perishable Inventory Management',
      'facilities-infrastructure': 'Facilities & Infrastructure Management',
      'employee-management': 'Employee Management',
      'task-assignment': 'Task Assignment',
      'volunteer-management': 'Volunteer Management',
      'freelancer-management': 'Freelancer Management',
      'devotee-management': 'Devotee Management',
      'vip-devotee': 'VIP Devotee Management',
      'content-management': 'Content Management',
      'pr-communications': 'PR & Communications',
      'event-management': 'Event Management',
      'event-donations': 'Event Donations',
      'initiative-projects': 'Initiative & Project Management',
      'initiative-donations': 'Initiative Donations',
      'accounts-financial': 'Accounts & Financial Workflow',
      'donations-80g': 'Donations & 80G',
      'compliance-legal': 'Compliance & Legal',
      'asset-property': 'Asset & Property Management',
      'supplier-vendor': 'Supplier / Vendor Management',
      'branch-management': 'Branch Management',
      'reports-audit': 'Reports & Audit',
    };

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      let label = path;

      // First path is usually category
      if (index === 0 && categoryMap[path]) {
        label = categoryMap[path];
      } 
      // Second path is usually module
      else if (index === 1 && moduleMap[path]) {
        label = moduleMap[path];
      }
      // Third+ paths are sub-modules/functions - format them
      else if (index >= 2) {
        label = path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }

      // Last item is not a link
      const isLast = index === paths.length - 1;
      const isCategory = index === 0; // e.g. /operations, /people, etc. – often no dedicated page
      breadcrumbs.push({
        label,
        // For top-level category (Operations, People, etc.) avoid linking to non-existent routes
        href: isLast || isCategory ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav 
      className="flex items-center mb-6"
      style={{ marginBottom: spacing.lg }}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2" style={{ gap: spacing.sm }}>
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="mx-2"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  color: colors.text.muted,
                  marginLeft: spacing.sm,
                  marginRight: spacing.sm,
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {item.href ? (
              <Link
                href={item.href}
                style={{
                  fontFamily: typography.bodySmall.fontFamily,
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.text.muted,
                  textDecoration: 'none',
                }}
                className="hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span
                style={{
                  fontFamily: typography.bodySmall.fontFamily,
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.text.primary,
                  fontWeight: 500,
                }}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
