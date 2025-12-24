export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Hover shadows - elevated on interaction
  'hover-lg': '0 12px 20px -4px rgba(0, 0, 0, 0.12), 0 6px 8px -3px rgba(0, 0, 0, 0.08)',
  'hover-xl': '0 24px 30px -6px rgba(0, 0, 0, 0.15), 0 12px 12px -6px rgba(0, 0, 0, 0.06)',
  
  // Floating shadows - for modals and dropdowns
  floating: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
  'floating-lg': '0 30px 40px -8px rgba(0, 0, 0, 0.2), 0 15px 15px -8px rgba(0, 0, 0, 0.1)',
  
  // Inner shadows - for inputs and focused states
  'inner-sm': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'inner-md': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
  
  // Colored shadows - brand-colored shadows for accents
  'amber-sm': '0 2px 4px 0 rgba(167, 119, 56, 0.15)',
  'amber-md': '0 4px 8px 0 rgba(167, 119, 56, 0.2), 0 2px 4px 0 rgba(167, 119, 56, 0.15)',
  'amber-lg': '0 8px 16px 0 rgba(167, 119, 56, 0.25), 0 4px 8px 0 rgba(167, 119, 56, 0.2)',
} as const;

