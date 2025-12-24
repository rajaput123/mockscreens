'use client';

import { colors, spacing, typography, shadows, borders } from '../../design-system';

interface PrivacyNoticeProps {
  className?: string;
}

export default function PrivacyNotice({ className = '' }: PrivacyNoticeProps) {
  return (
    <div
      className={`rounded-2xl p-4 ${className}`}
      style={{
        backgroundColor: colors.info.light,
        border: `1px solid ${colors.info.base}40`,
        boxShadow: shadows.sm,
      }}
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: colors.info.base }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '0.875rem',
              color: colors.info.base,
              fontWeight: 600,
              marginBottom: spacing.xs,
            }}
          >
            Privacy Notice
          </p>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '0.75rem',
              color: colors.info.base,
              lineHeight: '1.5',
            }}
          >
            Your data is used only for temple services and will not be shared with third parties.
            We respect your privacy and maintain strict confidentiality.
          </p>
        </div>
      </div>
    </div>
  );
}

