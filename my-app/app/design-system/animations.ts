export const animations = {
  // Fade animations
  fadeIn: 'animate-[fade-in_0.3s_cubic-bezier(0.4,0,0.2,1)]',
  fadeOut: 'animate-[fade-out_0.2s_cubic-bezier(0.4,0,0.2,1)]',
  
  // Slide animations
  slideUp: 'animate-[slide-up_0.4s_cubic-bezier(0.4,0,0.2,1)]',
  slideDown: 'animate-[slide-down_0.4s_cubic-bezier(0.4,0,0.2,1)]',
  slideLeft: 'animate-[slide-left_0.4s_cubic-bezier(0.4,0,0.2,1)]',
  slideRight: 'animate-[slide-right_0.4s_cubic-bezier(0.4,0,0.2,1)]',
  
  // Fade + Slide combinations
  fadeInUp: 'animate-[fade-in-up_0.4s_cubic-bezier(0.4,0,0.2,1)]',
  fadeInDown: 'animate-[fade-in-down_0.4s_cubic-bezier(0.4,0,0.2,1)]',
  fadeInLeft: 'animate-[fade-in-left_0.4s_cubic-bezier(0.4,0,0.2,1)]',
  fadeInRight: 'animate-[fade-in-right_0.4s_cubic-bezier(0.4,0,0.2,1)]',
  
  // Scale animations
  scaleIn: 'animate-[scale-in_0.3s_cubic-bezier(0.4,0,0.2,1)]',
  scaleOut: 'animate-[scale-out_0.2s_cubic-bezier(0.4,0,0.2,1)]',
  scaleBounce: 'animate-[scale-bounce_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]',
  bounceIn: 'animate-[bounce-in_0.6s_cubic-bezier(0.68,-0.55,0.265,1.55)]',
  
  // Pulse animations
  pulse: 'animate-pulse',
  pulseSlow: 'animate-[pulse-slow_2s_cubic-bezier(0.4,0,0.6,1)_infinite]',
  
  // Loading animations
  shimmer: 'animate-[shimmer_2s_linear_infinite]',
  rotate: 'animate-[rotate_1s_linear_infinite]',
  
  // Built-in Tailwind animations
  spin: 'animate-spin',
  ping: 'animate-ping',
  bounce: 'animate-bounce',
  
  // Transition utilities
  transitionAll: 'transition-all duration-200 ease-in-out',
  transitionFast: 'transition-all duration-150 ease-out',
  transitionBase: 'transition-all duration-200 ease-in-out',
  transitionSlow: 'transition-all duration-300 ease-in-out',
  transitionSlower: 'transition-all duration-500 ease-in-out',
  transitionColors: 'transition-colors duration-200 ease-in-out',
  transitionOpacity: 'transition-opacity duration-200 ease-in-out',
  transitionTransform: 'transition-transform duration-200 ease-in-out',
  transitionShadow: 'transition-shadow duration-200 ease-in-out',
  
  // Hover animations
  hoverScale: 'hover:scale-105 transition-transform duration-200 ease-out',
  hoverScaleSubtle: 'hover:scale-[1.02] transition-transform duration-200 ease-out',
  hoverLift: 'hover:-translate-y-1 transition-transform duration-200 ease-out',
  hoverLiftMore: 'hover:-translate-y-2 transition-transform duration-200 ease-out',
  hoverGlow: 'hover:shadow-lg transition-shadow duration-200 ease-out',
  hoverBrighten: 'hover:brightness-110 transition-all duration-200 ease-out',
  
  // Active/Press animations
  activeScale: 'active:scale-95 transition-transform duration-150 ease-out',
  activePress: 'active:scale-[0.98] transition-transform duration-100 ease-out',
  
  // Focus animations
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200',
  focusScale: 'focus:scale-105 transition-transform duration-200 ease-out',
  
  // Entrance animations for cards
  cardEnter: 'animate-[fade-in-up_0.4s_cubic-bezier(0.4,0,0.2,1)]',
  cardHover: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ease-out',
  
  // Modal animations
  modalBackdrop: 'animate-[fade-in_0.2s_cubic-bezier(0.4,0,0.2,1)]',
  modalEnter: 'animate-[scale-bounce_0.4s_cubic-bezier(0.68,-0.55,0.265,1.55)]',
  modalExit: 'animate-[scale-out_0.2s_cubic-bezier(0.4,0,0.2,1)]',
  
  // Button animations
  buttonHover: 'hover:scale-105 hover:shadow-md transition-all duration-200 ease-out',
  buttonActive: 'active:scale-95 transition-transform duration-150 ease-out',
  buttonLoading: 'animate-pulse',
  
  // List animations
  listItemEnter: 'animate-[fade-in-up_0.4s_cubic-bezier(0.4,0,0.2,1)]',
  
  // Stagger animations (for lists)
  stagger: (index: number, delay: number = 0.05) => ({
    animationDelay: `${index * delay}s`,
  }),
  
  // Helper function for stagger animation class
  staggerClass: (index: number, delay: number = 0.05) => 
    `animate-[fade-in-up_0.4s_cubic-bezier(0.4,0,0.2,1)]`,
  
  // Animation presets
  presets: {
    pageEnter: 'animate-[fade-in-up_0.4s_cubic-bezier(0.4,0,0.2,1)]',
    cardEnter: 'animate-[fade-in-up_0.4s_cubic-bezier(0.4,0,0.2,1)]',
    modalEnter: 'animate-[scale-bounce_0.4s_cubic-bezier(0.68,-0.55,0.265,1.55)]',
    buttonHover: 'hover:scale-105 hover:shadow-md transition-all duration-200 ease-out',
    buttonActive: 'active:scale-95 transition-transform duration-150 ease-out',
    smoothTransition: 'transition-all duration-200 ease-in-out',
  },
} as const;

