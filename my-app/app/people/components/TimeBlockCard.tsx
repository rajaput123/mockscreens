'use client';

import { ReactNode } from 'react';
import { colors, spacing, shadows, borders, typography } from '../../design-system';

interface TimeBlockCardProps {
  title: string;
  timeRange: string;
  children: ReactNode;
  onClick?: () => void;
  taskCount?: number;
  className?: string;
}

export default function TimeBlockCard({
  title,
  timeRange,
  children,
  onClick,
  taskCount,
  className = '',
}: TimeBlockCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-3xl p-6
        transition-all duration-200 ease-out
        hover:-translate-y-1 hover:shadow-xl
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        backgroundColor: colors.background.base,
        border: `2px solid ${colors.border}`,
        boxShadow: shadows.md,
      }}
    >
      <div className="flex items-center justify-between mb-4">
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
            {title}
          </h3>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '0.875rem',
              color: colors.text.muted,
            }}
          >
            {timeRange}
          </p>
        </div>
        {taskCount !== undefined && (
          <div
            className="px-3 py-1 rounded-xl"
            style={{
              backgroundColor: colors.primary.base + '15',
              color: colors.primary.base,
              fontFamily: typography.body.fontFamily,
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </div>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

