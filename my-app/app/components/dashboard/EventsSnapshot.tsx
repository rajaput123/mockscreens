import { colors, spacing, typography, getLoadColor } from '../../design-system';

interface Event {
  date: string;
  time: string;
  name: string;
  type: string;
  load: 'High' | 'Medium' | 'Low';
}

interface EventsSnapshotProps {
  todayEvents: Event[];
  upcomingEvents: Event[];
}


export default function EventsSnapshot({ todayEvents, upcomingEvents }: EventsSnapshotProps) {
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
        Events Snapshot
      </h2>

      <div className="space-y-6">
        <div>
          <h3 
            className="mb-3"
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 600,
            }}
          >
            Today's Events
          </h3>
          <div className="space-y-3">
            {todayEvents.map((event, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-3xl transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary.base;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          fontWeight: 600,
                        }}
                      >
                        {event.time}
                      </span>
                      <span 
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          fontWeight: typography.body.fontWeight,
                        }}
                      >
                        {event.name}
                      </span>
                    </div>
                    <div 
                      className="flex items-center gap-2"
                      style={{
                        fontFamily: typography.bodySmall.fontFamily,
                        fontSize: typography.bodySmall.fontSize,
                        color: colors.text.muted,
                      }}
                    >
                      <span>{event.type}</span>
                    </div>
                  </div>
                  <span 
                    className="px-2 py-1 rounded-xl text-xs font-medium text-white"
                    style={{
                      backgroundColor: getLoadColor(event.load),
                    }}
                  >
                    {event.load}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 
            className="mb-3"
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 600,
            }}
          >
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-3xl transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary.base;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        style={{
                          fontFamily: typography.bodySmall.fontFamily,
                          fontSize: typography.bodySmall.fontSize,
                          color: colors.text.muted,
                        }}
                      >
                        {event.date}
                      </span>
                      <span 
                        style={{
                          fontFamily: typography.bodySmall.fontFamily,
                          fontSize: typography.bodySmall.fontSize,
                          color: colors.text.muted,
                        }}
                      >
                        {event.time}
                      </span>
                    </div>
                    <div 
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        fontWeight: typography.body.fontWeight,
                      }}
                    >
                      {event.name}
                    </div>
                    <div 
                      className="mt-1"
                      style={{
                        fontFamily: typography.bodySmall.fontFamily,
                        fontSize: typography.bodySmall.fontSize,
                        color: colors.text.muted,
                      }}
                    >
                      {event.type}
                    </div>
                  </div>
                  <span 
                    className="px-2 py-1 rounded-xl text-xs font-medium text-white"
                    style={{
                      backgroundColor: getLoadColor(event.load),
                    }}
                  >
                    {event.load}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

