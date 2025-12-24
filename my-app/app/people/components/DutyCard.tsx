'use client';

import { colors, spacing, shadows, borders, typography } from '../../design-system';

interface DutyCardProps {
  what: string;
  where: string;
  when: string;
  volunteerName?: string;
  eventName?: string;
  onClick?: () => void;
  status?: 'scheduled' | 'completed' | 'cancelled';
}

export default function DutyCard({
  what,
  where,
  when,
  volunteerName,
  eventName,
  onClick,
  status = 'scheduled',
}: DutyCardProps) {
  const statusColors = {
    scheduled: { bg: colors.info.light, text: colors.info.base },
    completed: { bg: colors.success.light, text: colors.success.base },
    cancelled: { bg: colors.error.light, text: colors.error.base },
  };

  const statusColor = statusColors[status];

  return (
    <div
      onClick={onClick}
      className={`
        rounded-3xl p-6
        transition-all duration-200 ease-out
        hover:-translate-y-1 hover:shadow-xl
        ${onClick ? 'cursor-pointer' : ''}
      `}
      style={{
        backgroundColor: colors.background.base,
        border: `2px solid ${colors.border}`,
        boxShadow: shadows.md,
      }}
    >
      {eventName && (
        <div
          className="mb-3 px-2 py-1 rounded-lg inline-block"
          style={{
            backgroundColor: colors.background.subtle,
            fontFamily: typography.body.fontFamily,
            fontSize: '0.75rem',
            color: colors.text.muted,
            fontWeight: 500,
          }}
        >
          {eventName}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <div
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '0.75rem',
              color: colors.text.muted,
              marginBottom: spacing.xs,
              fontWeight: 500,
            }}
          >
            WHAT
          </div>
          <div
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: '1.125rem',
              fontWeight: 600,
              color: colors.text.primary,
            }}
          >
            {what}
          </div>
        </div>

        <div>
          <div
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '0.75rem',
              color: colors.text.muted,
              marginBottom: spacing.xs,
              fontWeight: 500,
            }}
          >
            WHERE
          </div>
          <div
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.primary,
            }}
          >
            {where}
          </div>
        </div>

        <div>
          <div
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '0.75rem',
              color: colors.text.muted,
              marginBottom: spacing.xs,
              fontWeight: 500,
            }}
          >
            WHEN
          </div>
          <div
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.primary,
            }}
          >
            {when}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: borders.styles.divider }}>
        {volunteerName && (
          <div
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '0.875rem',
              color: colors.text.secondary,
            }}
          >
            {volunteerName}
          </div>
        )}
        <div
          className="px-3 py-1 rounded-xl"
          style={{
            backgroundColor: statusColor.bg,
            color: statusColor.text,
            fontFamily: typography.body.fontFamily,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {status}
        </div>
      </div>
    </div>
  );
}

