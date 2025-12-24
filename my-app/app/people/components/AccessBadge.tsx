'use client';

import { colors, typography, shadows } from '../../design-system';

interface AccessBadgeProps {
  level: 'full' | 'read-only' | 'restricted' | 'none' | 'temporary';
  expiresAt?: string;
}

export default function AccessBadge({ level, expiresAt }: AccessBadgeProps) {
  const levelConfig = {
    full: {
      label: 'Full Access',
      bg: colors.success.light,
      text: colors.success.base,
    },
    'read-only': {
      label: 'Read Only',
      bg: colors.info.light,
      text: colors.info.base,
    },
    restricted: {
      label: 'Restricted',
      bg: colors.warning.light,
      text: colors.warning.base,
    },
    none: {
      label: 'No Access',
      bg: colors.error.light,
      text: colors.error.base,
    },
    temporary: {
      label: expiresAt ? `Temporary - Expires ${new Date(expiresAt).toLocaleDateString()}` : 'Temporary',
      bg: colors.warning.light,
      text: colors.warning.base,
    },
  };

  const config = levelConfig[level];

  return (
    <span
      className="px-3 py-1 rounded-xl inline-block"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        fontFamily: typography.body.fontFamily,
        fontSize: '0.75rem',
        fontWeight: 600,
        boxShadow: shadows.sm,
      }}
    >
      {config.label}
    </span>
  );
}

