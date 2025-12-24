'use client';

import { ReactNode } from 'react';
import { colors, spacing, shadows, borders } from '../../design-system';

interface ElevatedCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  elevation?: 'sm' | 'md' | 'lg';
}

export default function ElevatedCard({
  children,
  onClick,
  className = '',
  title,
  subtitle,
  badge,
  elevation = 'lg',
}: ElevatedCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-3xl p-6
        transition-all duration-200 ease-out
        hover:-translate-y-2 hover:shadow-2xl
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        backgroundColor: colors.background.base,
        border: borders.styles.card,
        boxShadow: elevation === 'sm' ? shadows.sm : elevation === 'md' ? shadows.md : shadows.lg,
      }}
    >
      {(title || subtitle || badge) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                  marginBottom: subtitle ? spacing.xs : 0,
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem',
                  color: colors.text.muted,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {badge && <div>{badge}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

