'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { colors, spacing, typography, shadows, borders } from '../../../design-system';
import { ModernCard } from '../../components';
import { ContentVersion } from '../types';

export default function ContentHistoryPage() {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [selectedContentId, setSelectedContentId] = useState<string>('');

  const filteredVersions = selectedContentId
    ? versions.filter(v => v.contentId === selectedContentId)
    : versions;

  return (
    <ModuleLayout
      title="Content History"
      description="View version history and changes for all content"
    >
      {/* Filter */}
      <ModernCard elevation="md" className="mb-6">
        <div>
          <label
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: colors.text.primary,
              marginBottom: spacing.xs,
              display: 'block',
            }}
          >
            Filter by Content
          </label>
          <input
            type="text"
            value={selectedContentId}
            onChange={(e) => setSelectedContentId(e.target.value)}
            placeholder="Enter content ID..."
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
        </div>
      </ModernCard>

      {/* Version History */}
      {filteredVersions.length > 0 ? (
        <div className="space-y-4">
          {filteredVersions.map((version) => (
            <ModernCard key={version.id} elevation="md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    style={{
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.sectionHeader.fontSize,
                      fontWeight: typography.sectionHeader.fontWeight,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    {version.title} (v{version.version})
                  </h3>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '0.875rem',
                      color: colors.text.muted,
                    }}
                  >
                    {version.authorName} • {new Date(version.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-xl text-xs"
                  style={{
                    backgroundColor: colors.background.subtle,
                    color: colors.text.muted,
                    fontFamily: typography.body.fontFamily,
                    fontWeight: 600,
                    boxShadow: shadows.sm,
                  }}
                >
                  v{version.version}
                </span>
              </div>
              {version.changes && (
                <div
                  className="p-4 rounded-2xl mb-4"
                  style={{
                    backgroundColor: colors.info.light,
                    border: `1px solid ${colors.info.base}40`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '0.875rem',
                      color: colors.info.base,
                    }}
                  >
                    <strong>Changes:</strong> {version.changes}
                  </p>
                </div>
              )}
              <div
                className="p-4 rounded-2xl"
                style={{
                  backgroundColor: colors.background.subtle,
                  border: borders.styles.divider,
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: version.content }}
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                  }}
                />
              </div>
            </ModernCard>
          ))}
        </div>
      ) : (
        <ModernCard elevation="sm" className="text-center p-12">
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.muted,
            }}
          >
            No version history found.
          </p>
        </ModernCard>
      )}
    </ModuleLayout>
  );
}

