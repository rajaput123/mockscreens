import { colors, spacing, typography, getSeverityColor, getSeverityBg } from '../../design-system';

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  actionLabel?: string;
}

interface AlertsNotificationsProps {
  alerts: Alert[];
}


export default function AlertsNotifications({ alerts }: AlertsNotificationsProps) {
  return (
    <section>
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <h2 
          className="mb-6"
        style={{
          fontFamily: typography.sectionHeader.fontFamily,
          fontSize: typography.sectionHeader.fontSize,
          fontWeight: typography.sectionHeader.fontWeight,
          lineHeight: typography.sectionHeader.lineHeight,
          marginBottom: spacing.lg,
        }}
      >
        Alerts & Notifications
      </h2>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 rounded-3xl border-l-4 transition-all duration-200 hover:shadow-md"
            style={{
              borderLeftColor: getSeverityColor(alert.severity),
              backgroundColor: getSeverityBg(alert.severity),
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div 
                className="font-semibold capitalize"
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 600,
                  color: getSeverityColor(alert.severity),
                }}
              >
                {alert.severity}
              </div>
              {alert.actionLabel && (
                <button 
                  className="text-xs font-medium hover:underline"
                  style={{
                    color: getSeverityColor(alert.severity),
                  }}
                >
                  {alert.actionLabel}
                </button>
              )}
            </div>
            <div 
              className="mb-1"
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                fontWeight: 600,
              }}
            >
              {alert.title}
            </div>
            <div 
              style={{
                fontFamily: typography.bodySmall.fontFamily,
                fontSize: typography.bodySmall.fontSize,
                color: colors.text.muted,
              }}
            >
              {alert.description}
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}

