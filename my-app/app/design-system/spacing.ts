export const spacing = {
  // Base spacing unit (4px)
  unit: 4,
  
  // Common spacing values
  xs: '4px',    // 0.25rem / 1 unit
  sm: '8px',    // 0.5rem / 2 units
  md: '12px',   // 0.75rem / 3 units
  base: '16px', // 1rem / 4 units
  lg: '24px',   // 1.5rem / 6 units
  xl: '32px',   // 2rem / 8 units
  '2xl': '48px', // 3rem / 12 units
  '3xl': '64px', // 4rem / 16 units
  
  // Component-specific spacing
  headerHeight: '80px',      // h-20 - navbar height
  pagePadding: '32px',       // px-8
  sectionGap: '48px',        // gap-12
  sectionGapLarge: '64px',   // gap-16
  itemPadding: '16px',       // py-4
  itemGap: '12px',           // gap-3
  navGap: '32px',            // gap-8 - nav spacing (28-36px range)
  
  // Layout spacing
  containerMaxWidth: '1280px', // max-w-7xl
  contentPadding: '32px',      // px-8
  contentPaddingY: '48px',     // py-12
  
  // Header specific spacing
  headerPaddingX: '20px',      // 16-24px range - left/right padding
} as const;

