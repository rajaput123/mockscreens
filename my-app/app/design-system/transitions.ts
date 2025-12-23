export const transitions = {
  // Duration
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  // Timing functions
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    default: 'ease-in-out',
  },
  
  // Common transitions
  common: {
    colors: 'color 200ms ease-in-out',
    background: 'background-color 200ms ease-in-out',
    opacity: 'opacity 200ms ease-in-out',
    transform: 'transform 200ms ease-in-out',
    all: 'all 200ms ease-in-out',
  },
} as const;

