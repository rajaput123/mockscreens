import { colors, spacing, typography } from '../../design-system';

interface PageHeaderProps {
  dateString: string;
}

export default function PageHeader({ dateString }: PageHeaderProps) {
  return (
    <div 
      className="mb-12 flex items-start justify-between animate-[fade-in_0.4s_ease-out]"
      style={{ marginBottom: spacing.sectionGapLarge }}
    >
      <div>
        <h1 
          style={{
            fontFamily: typography.pageTitle.fontFamily,
            fontSize: typography.pageTitle.fontSize,
            fontWeight: typography.pageTitle.fontWeight,
            lineHeight: typography.pageTitle.lineHeight,
            marginBottom: spacing.sm,
          }}
        >
          Temple Operations Dashboard
        </h1>
        <p 
          style={{
            fontFamily: typography.subtext.fontFamily,
            fontSize: typography.subtext.fontSize,
            fontWeight: typography.subtext.fontWeight,
            lineHeight: typography.subtext.lineHeight,
            color: typography.subtext.color,
          }}
        >
          {dateString}
        </p>
      </div>
    </div>
  );
}
