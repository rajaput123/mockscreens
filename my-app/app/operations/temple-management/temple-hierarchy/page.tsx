'use client';

import { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { colors, spacing, typography } from '../../../design-system';

interface TempleNode {
  id: string;
  name: string;
  location: string;
  type: 'parent' | 'child';
  children?: TempleNode[];
}

export default function TempleHierarchyPage() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1']));

  // Mock hierarchical data
  const templeHierarchy: TempleNode[] = [
    {
      id: '1',
      name: 'Main Temple Complex',
      location: 'City Center',
      type: 'parent',
      children: [
        {
          id: '2',
          name: 'North Branch Temple',
          location: 'North District',
          type: 'child',
        },
        {
          id: '3',
          name: 'South Branch Temple',
          location: 'South District',
          type: 'child',
        },
      ],
    },
  ];

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: TempleNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} style={{ marginLeft: level * spacing.xl, marginBottom: spacing.base }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            padding: spacing.base,
            className="rounded-2xl"
            backgroundColor: level === 0 ? colors.background.subtle : colors.background.base,
            border: `1px solid ${colors.border}`,
            cursor: hasChildren ? 'pointer' : 'default',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (hasChildren) {
              e.currentTarget.style.backgroundColor = colors.background.light;
            }
          }}
          onMouseLeave={(e) => {
            if (hasChildren) {
              e.currentTarget.style.backgroundColor = level === 0 ? colors.background.subtle : colors.background.base;
            }
          }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren && (
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '16px',
                color: colors.primary.base,
                width: '20px',
                display: 'inline-block',
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          {!hasChildren && <span style={{ width: '20px', display: 'inline-block' }} />}
          
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
              }}
            >
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 600,
                  color: colors.text.primary,
                }}
              >
                {node.name}
              </span>
              <span
                style={{
                  padding: `${spacing.xs} ${spacing.sm}`,
                  className="rounded-xl"
                  backgroundColor: node.type === 'parent' ? colors.primary.base : colors.background.light,
                  color: node.type === 'parent' ? '#ffffff' : colors.text.muted,
                  fontFamily: typography.body.fontFamily,
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {node.type === 'parent' ? 'Parent' : 'Child'}
              </span>
            </div>
            <div
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                color: colors.text.muted,
                marginTop: spacing.xs,
              }}
            >
              {node.location}
            </div>
          </div>
          
          <Link
            href={`/operations/temple-management/temple-details?templeId=${node.id}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: `${spacing.xs} ${spacing.base}`,
              className="rounded-xl"
              backgroundColor: colors.primary.base,
              color: '#ffffff',
              textDecoration: 'none',
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 500,
            }}
          >
            View Details
          </Link>
        </div>

        {hasChildren && isExpanded && (
          <div style={{ marginTop: spacing.sm }}>
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <ModuleLayout
      title="Temple Hierarchy View"
      description="Visual representation of temple parent-child relationships"
    >
      <div 
        className="rounded-3xl p-6 mb-6"
        style={{
          backgroundColor: colors.background.base,
          border: `1px solid ${colors.border}`,
          padding: spacing.xl,
          marginBottom: spacing.lg,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <div>
            <h2
              style={{
                fontFamily: typography.sectionHeader.fontFamily,
                fontSize: typography.sectionHeader.fontSize,
                fontWeight: typography.sectionHeader.fontWeight,
                marginBottom: spacing.xs,
                color: colors.text.primary,
              }}
            >
              Temple Hierarchy
            </h2>
            <p
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                color: colors.text.muted,
              }}
            >
              Click on parent temples to expand and view child temples. Click "View Details" to see temple information and associated sevas.
            </p>
          </div>
          <Link
            href="/operations/temple-management/manage-hierarchy"
            style={{
              padding: `${spacing.base} ${spacing.lg}`,
              className="rounded-2xl"
              backgroundColor: colors.primary.base,
              color: '#ffffff',
              textDecoration: 'none',
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 500,
            }}
          >
            Manage Hierarchy
          </Link>
        </div>

        <div style={{ marginTop: spacing.lg }}>
          {templeHierarchy.map((temple) => renderNode(temple))}
        </div>

        {templeHierarchy.length === 0 && (
          <div
            style={{
              padding: spacing.xl,
              textAlign: 'center',
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.muted,
            }}
          >
            No temples found. Add temples to see the hierarchy view.
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}

