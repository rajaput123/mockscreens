'use client';

import { ReactNode } from 'react';
import { colors, spacing, shadows, borders } from '../../design-system';

interface ModernCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  hover?: boolean;
  elevation?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function ModernCard({
  children,
  onClick,
  className = '',
  hover = true,
  elevation = 'md',
}: ModernCardProps) {
  const shadowMap = {
    sm: shadows.sm,
    md: shadows.md,
    lg: shadows.lg,
    xl: shadows.xl,
  };

  const hoverShadowMap = {
    sm: shadows.lg,
    md: shadows.xl,
    lg: shadows['hover-xl'],
    xl: shadows['2xl'],
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-3xl p-6
        transition-all duration-200 ease-out
        ${hover ? 'hover:-translate-y-1 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        backgroundColor: colors.background.base,
        border: borders.styles.card,
        boxShadow: shadowMap[elevation],
        ...(hover && {
          '--hover-shadow': hoverShadowMap[elevation],
        } as React.CSSProperties),
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = hoverShadowMap[elevation];
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = shadowMap[elevation];
        }
      }}
    >
      {children}
    </div>
  );
}

