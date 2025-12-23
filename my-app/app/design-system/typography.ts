export const typography = {
  // Page titles - Noto Serif Bold 700
  pageTitle: {
    fontFamily: 'var(--font-noto-serif), serif',
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: '1.2',
  },
  
  // Section headers - Noto Serif Medium 500
  sectionHeader: {
    fontFamily: 'var(--font-noto-serif), serif',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '1.3',
  },
  
  // Body text - Inter Regular 400
  body: {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '1.5',
  },
  
  // Body small - Inter Regular 400
  bodySmall: {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '1.5',
  },
  
  // Body extra small - Inter Regular 400
  bodyXSmall: {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '1.4',
  },
  
  // KPIs - Inter Semi-bold 500
  kpi: {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '1.5',
  },
  
  // Links - Inter Medium 500
  link: {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '1.5',
  },
  
  // Navigation - Inter Medium 500
  nav: {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    fontSize: '17px',        // 16-18px range
    fontWeight: 400,          // Regular
    lineHeight: '1.5',
  },
  
  // Logo - Noto Serif Bold 700
  logo: {
    fontFamily: 'var(--font-noto-serif), serif',
    fontSize: '20px',
    fontWeight: 700,
    lineHeight: '1.2',
  },
  
  // List items - Inter Medium 500
  listItem: {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '1.5',
  },
  
  // Subtext - Inter Regular 400
  subtext: {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '1.5',
    color: '#67461b', // Using brand muted color
  },
} as const;

