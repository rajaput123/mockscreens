/**
 * Brand Color Palette
 * 
 * Color mapping from provided palette:
 * - #a87738 -> amber[300] (medium amber)
 * - #dab76e -> amber[200] (light amber/gold)
 * - #270100 -> amber[800] (almost black brown) - primary text
 * - #e7dcb9 -> amber[50] (lightest cream/beige) - backgrounds
 * - #67461b -> amber[600] (dark brown-amber) - muted text
 * - #a68455 -> amber[400] (medium brown-amber) - light text
 * - #e4cc96 -> amber[100] (light golden beige) - borders
 * - #433117 -> amber[700] (very dark brown) - secondary text
 * - #e28d2f -> amber[500] (bright orange/amber) - primary accent
 */
const brandColors = {
  // Primary amber/orange tones
  amber: {
    50: '#e7dcb9',   // Lightest cream/beige
    100: '#e4cc96',  // Light golden beige
    200: '#dab76e',  // Light amber/gold
    300: '#a87738',  // Medium amber
    400: '#a68455',  // Medium brown-amber
    500: '#e28d2f',  // Bright orange/amber (primary accent)
    600: '#67461b',  // Dark brown-amber
    700: '#433117',  // Very dark brown
    800: '#270100',  // Almost black brown
  },
} as const;

export const colors = {
  // Primary brand colors
  primary: {
    light: brandColors.amber[200],      // dab76e - for highlights
    base: brandColors.amber[600],       // 67461b - primary (amber 600)
    medium: brandColors.amber[300],     // a87738 - medium tone
    dark: brandColors.amber[700],       // 433117 - dark tone
    darkest: brandColors.amber[800],     // 270100 - darkest
  },
  
  // Background colors
  background: {
    base: '#ffffff',
    subtle: brandColors.amber[50],      // e7dcb9 - very light cream
    light: brandColors.amber[100],      // e4cc96 - light beige
    hover: brandColors.amber[50],       // e7dcb9 - hover state
  },
  
  // Text colors
  text: {
    primary: brandColors.amber[800],    // 270100 - main text
    secondary: brandColors.amber[700],  // 433117 - secondary text
    muted: brandColors.amber[600],      // 67461b - muted text
    light: brandColors.amber[400],      // a68455 - light text
    inverse: '#ffffff',                 // white text on dark
  },
  
  // Foreground/Text (for compatibility)
  foreground: brandColors.amber[800],   // 270100
  muted: brandColors.amber[600],        // 67461b
  
  // Accent (for actions, links) - using amber 600
  accent: brandColors.amber[600],      // 67461b
  
  // Borders and dividers
  border: brandColors.amber[100],       // e4cc96 - light beige
  borderLight: brandColors.amber[50],  // e7dcb9 - very light
  divider: brandColors.amber[100],      // e4cc96
  dividerSubtle: brandColors.amber[50], // e7dcb9
  
  // Interactive states
  hover: brandColors.amber[50],        // e7dcb9
  active: brandColors.amber[200],      // dab76e
  
  // Semantic colors (complementary to brand)
  success: {
    base: '#16a34a',
    light: '#dcfce7',  // Light green background
    dark: '#15803d',   // Darker green for borders/text
  },
  warning: {
    base: '#f59e0b',
    light: '#fef3c7',  // Light amber background
    dark: '#d97706',   // Darker amber for borders/text
  },
  error: {
    base: '#dc2626',
    light: '#fee2e2',  // Light red background
    dark: '#b91c1c',   // Darker red for borders/text
  },
  info: {
    base: '#2563eb',
    light: '#dbeafe',  // Light blue background
    dark: '#1e40af',   // Darker blue for borders/text
  },
  
  // Header color
  header: {
    bg: brandColors.amber[800],     // #270100 - Dark amber header background
    text: '#ffffff',    // White text on header (high contrast)
    textMuted: '#e4cc96', // Light beige text on header (amber[100] for better contrast)
    hover: '#fbbf24',   // Bright amber for hover (better contrast on dark background)
  },
  
  // Calendar type colors
  calendar: {
    temple: {
      bg: brandColors.amber[100],   // Light amber background
      text: brandColors.amber[800], // Dark amber text (better contrast)
    },
    gurugal: {
      bg: brandColors.amber[50],   // Lightest amber background
      text: brandColors.amber[800], // Dark amber text (better contrast)
    },
    executive: {
      bg: brandColors.amber[200],   // Light amber/gold background
      text: brandColors.amber[800], // Dark amber text (better contrast)
    },
  },
  
  // Gray scale (warm grays that complement amber tones)
  gray: {
    50: '#faf9f7',
    100: '#f5f3f0',
    200: '#eae8e3',
    300: '#d4d1ca',
    400: '#a8a39a',
    500: '#7d776c',
    600: brandColors.amber[600],       // 67461b
    700: brandColors.amber[700],       // 433117
    800: brandColors.amber[800],       // 270100
    900: '#1a150f',
  },
  
  // Brand color palette (direct access)
  brand: brandColors.amber,
} as const;

/**
 * Get color for alert/task severity
 */
export function getSeverityColor(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical':
      return colors.error.base;
    case 'warning':
      return colors.warning.base;
    case 'info':
      return colors.info.base;
    default:
      return colors.gray[400];
  }
}

/**
 * Get background color for alert/task severity
 */
export function getSeverityBg(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical':
      return colors.error.light;
    case 'warning':
      return colors.warning.light;
    case 'info':
      return colors.info.light;
    default:
      return colors.gray[100];
  }
}

/**
 * Get color for event load levels
 */
export function getLoadColor(load: 'High' | 'Medium' | 'Low'): string {
  switch (load) {
    case 'High':
      return colors.error.base;
    case 'Medium':
      return colors.warning.base;
    case 'Low':
      return colors.success.base;
    default:
      return colors.gray[400];
  }
}

/**
 * Get color for task status
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return colors.success.base;
    case 'in-progress':
      return colors.info.base;
    case 'pending':
      return colors.warning.base;
    case 'overdue':
      return colors.error.base;
    default:
      return colors.gray[400];
  }
}

/**
 * Get color for task priority
 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return colors.error.base;
    case 'medium':
      return colors.warning.base;
    case 'low':
      return colors.success.base;
    default:
      return colors.gray[400];
  }
}
