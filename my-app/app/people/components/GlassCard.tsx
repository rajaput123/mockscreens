'use client';

import { ReactNode } from 'react';
import { colors, shadows, borders } from '../../design-system';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  blur = true,
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-3xl p-6
        backdrop-blur-md
        ${className}
      `}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        border: `1px solid ${colors.borderLight}`,
        boxShadow: shadows.floating,
      }}
    >
      {children}
    </div>
  );
}

