import { colors, spacing, typography } from '../../design-system';

interface AnnouncementItem {
  text: string;
}

interface AnnouncementsProps {
  announcements: AnnouncementItem[];
}

export default function Announcements({ announcements }: AnnouncementsProps) {
  return (
    <div className="space-y-4">
      {announcements.map((announcement, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-4 rounded-3xl"
          style={{
            backgroundColor: colors.background.subtle,
            padding: spacing.base,
            marginBottom: index < announcements.length - 1 ? spacing.base : 0,
          }}
        >
          <div
            className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
            style={{
              backgroundColor: colors.primary.base,
              width: '8px',
              height: '8px',
              marginTop: '8px',
            }}
          />
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              lineHeight: typography.body.lineHeight,
              color: colors.text.primary,
            }}
          >
            {announcement.text}
          </p>
        </div>
      ))}
    </div>
  );
}
