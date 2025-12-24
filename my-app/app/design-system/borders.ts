import { colors } from './colors';

export const borders = {
  // Border widths
  width: {
    none: '0',
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },
  
  // Border radius - Modern rounded corners
  radius: {
    none: '0',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    full: '9999px',
  },
  
  // Border colors
  color: {
    default: colors.border,
    light: colors.borderLight,
    subtle: colors.dividerSubtle,
    divider: colors.divider,
  },
  
  // Common border styles
  styles: {
    divider: `1px solid ${colors.dividerSubtle}`,
    dividerBold: `1px solid ${colors.border}`,
    card: `1px solid ${colors.border}`,
  },
} as const;

