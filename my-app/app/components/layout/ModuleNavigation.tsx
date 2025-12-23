'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { colors, spacing, typography } from '../../design-system';
import { MenuItem } from '../navigation/navigationData';

interface ModuleNavigationProps {
  subServices: MenuItem[];
  functions: MenuItem[];
  moduleId: string;
  category: 'operations' | 'people' | 'projects' | 'finance';
}

export default function ModuleNavigation({ 
  subServices, 
  functions, 
  moduleId,
  category 
}: ModuleNavigationProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'subServices' | 'functions'>('subServices');

  const getRoute = (itemId: string, type: 'subService' | 'function') => {
    if (type === 'subService') {
      return `/${category}/${moduleId}/${itemId}`;
    }
    return `/${category}/${moduleId}/${itemId}`;
  };

  const isActive = (itemId: string, type: 'subService' | 'function') => {
    const route = getRoute(itemId, type);
    return pathname === route || pathname?.startsWith(route + '/');
  };

  return (
    <div 
      className="mb-8"
      style={{ marginBottom: spacing.xl }}
    >
      {/* Tab Selector */}
      <div 
        className="flex border-b"
        style={{ 
          borderColor: colors.border,
          gap: spacing.lg,
        }}
      >
        <button
          onClick={() => setActiveTab('subServices')}
          className="transition-colors"
          style={{
            paddingBottom: spacing.base,
            paddingTop: spacing.base,
            borderBottom: activeTab === 'subServices' ? `2px solid ${colors.primary.base}` : '2px solid transparent',
            fontFamily: typography.nav.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: activeTab === 'subServices' ? 600 : 400,
            color: activeTab === 'subServices' ? colors.primary.base : colors.text.muted,
            cursor: 'pointer',
          }}
        >
          Sub Modules
        </button>
        <button
          onClick={() => setActiveTab('functions')}
          className="transition-colors"
          style={{
            paddingBottom: spacing.base,
            paddingTop: spacing.base,
            borderBottom: activeTab === 'functions' ? `2px solid ${colors.primary.base}` : '2px solid transparent',
            fontFamily: typography.nav.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: activeTab === 'functions' ? 600 : 400,
            color: activeTab === 'functions' ? colors.primary.base : colors.text.muted,
            cursor: 'pointer',
          }}
        >
          Functions
        </button>
      </div>

      {/* Navigation Items */}
      <div 
        className="flex flex-wrap gap-4 mt-6"
        style={{ 
          marginTop: spacing.lg,
          gap: spacing.base,
        }}
      >
        {activeTab === 'subServices' && subServices.map((item) => (
          <Link
            key={item.id}
            href={getRoute(item.id, 'subService')}
            className="flex items-center rounded-2xl transition-colors"
            style={{
              padding: `${spacing.sm} ${spacing.base}`,
              backgroundColor: isActive(item.id, 'subService') 
                ? colors.background.subtle 
                : 'transparent',
              border: `1px solid ${isActive(item.id, 'subService') ? colors.primary.base : colors.border}`,
              color: isActive(item.id, 'subService') 
                ? colors.primary.base 
                : colors.text.primary,
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.id, 'subService')) {
                e.currentTarget.style.backgroundColor = colors.background.subtle;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.id, 'subService')) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                fontWeight: isActive(item.id, 'subService') ? 500 : 400,
              }}
            >
              {item.label}
            </span>
          </Link>
        ))}

        {activeTab === 'functions' && functions.map((item) => (
          <Link
            key={item.id}
            href={getRoute(item.id, 'function')}
            className="flex items-center rounded-2xl transition-colors"
            style={{
              padding: `${spacing.sm} ${spacing.base}`,
              backgroundColor: isActive(item.id, 'function') 
                ? colors.background.subtle 
                : 'transparent',
              border: `1px solid ${isActive(item.id, 'function') ? colors.primary.base : colors.border}`,
              color: isActive(item.id, 'function') 
                ? colors.primary.base 
                : colors.text.primary,
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.id, 'function')) {
                e.currentTarget.style.backgroundColor = colors.background.subtle;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.id, 'function')) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                fontWeight: isActive(item.id, 'function') ? 500 : 400,
              }}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
