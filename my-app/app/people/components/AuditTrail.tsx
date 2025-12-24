'use client';

import { colors, spacing, typography, shadows, borders } from '../../design-system';
import { AuditLog } from '../utils/audit';

interface AuditTrailProps {
  logs: AuditLog[];
  entityId?: string;
  entityType?: string;
  maxItems?: number;
}

export default function AuditTrail({
  logs,
  entityId,
  entityType,
  maxItems = 10,
}: AuditTrailProps) {
  const filteredLogs = entityId && entityType
    ? logs.filter((log) => log.entityId === entityId && log.entityType === entityType)
    : logs;

  const displayLogs = filteredLogs.slice(-maxItems).reverse();

  if (displayLogs.length === 0) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          backgroundColor: colors.background.subtle,
          border: borders.styles.divider,
        }}
      >
        <p
          style={{
            fontFamily: typography.body.fontFamily,
            fontSize: typography.body.fontSize,
            color: colors.text.muted,
          }}
        >
          No audit trail entries
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl"
      style={{
        backgroundColor: colors.background.base,
        border: borders.styles.card,
        boxShadow: shadows.sm,
      }}
    >
      <div className="p-4 border-b" style={{ borderColor: borders.color.divider }}>
        <h3
          style={{
            fontFamily: typography.sectionHeader.fontFamily,
            fontSize: typography.sectionHeader.fontSize,
            fontWeight: typography.sectionHeader.fontWeight,
            color: colors.text.primary,
          }}
        >
          Audit Trail
        </h3>
      </div>
      <div className="divide-y" style={{ borderColor: borders.color.divider }}>
        {displayLogs.map((log) => (
          <div key={log.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 600,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  {log.action}
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '0.75rem',
                    color: colors.text.muted,
                  }}
                >
                  {log.userName} • {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
              <span
                className="px-2 py-1 rounded-lg text-xs"
                style={{
                  backgroundColor: colors.background.subtle,
                  color: colors.text.muted,
                  fontFamily: typography.body.fontFamily,
                  fontWeight: 500,
                }}
              >
                {log.module}
              </span>
            </div>
            {log.changes && Object.keys(log.changes).length > 0 && (
              <div className="mt-2 pt-2" style={{ borderTop: borders.styles.divider }}>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '0.75rem',
                    color: colors.text.muted,
                    marginBottom: spacing.xs,
                  }}
                >
                  Changes:
                </p>
                <div className="space-y-1">
                  {Object.entries(log.changes).map(([field, change]) => (
                    <div key={field} className="text-xs">
                      <span style={{ color: colors.text.secondary }}>{field}:</span>{' '}
                      <span style={{ color: colors.error.base }}>
                        {String(change.old)}
                      </span>{' '}
                      →{' '}
                      <span style={{ color: colors.success.base }}>
                        {String(change.new)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

