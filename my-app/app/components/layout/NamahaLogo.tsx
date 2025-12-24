export default function NamahaLogo({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <svg
      className={`${className} hover:scale-110 transition-transform duration-300`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(231, 220, 185, 0.3))',
        animation: 'logoJump 2s ease-in-out infinite',
      }}
    >
      {/* Temple Base/Platform */}
      <rect x="15" y="75" width="70" height="15" fill="#67461b" rx="2" />
      
      {/* Temple Pillars */}
      <rect x="20" y="50" width="6" height="25" fill="#a87738" rx="1" />
      <rect x="74" y="50" width="6" height="25" fill="#a87738" rx="1" />
      
      {/* Main Temple Structure */}
      <rect x="30" y="50" width="40" height="25" fill="#a87738" rx="2" />
      
      {/* Temple Shikara (Dome) - Left */}
      <path
        d="M35 50 L30 45 L30 40 L40 40 L40 45 Z"
        fill="#e28d2f"
      />
      <path
        d="M35 50 Q32 47 30 45"
        stroke="#c2410c"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Temple Shikara (Dome) - Right */}
      <path
        d="M65 50 L70 45 L70 40 L60 40 L60 45 Z"
        fill="#e28d2f"
      />
      <path
        d="M65 50 Q68 47 70 45"
        stroke="#c2410c"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Central Shikara (Main Dome) */}
      <path
        d="M50 35 L42 42 L42 50 L58 50 L58 42 Z"
        fill="#f97316"
      />
      <path
        d="M50 35 Q46 38 42 42"
        stroke="#ea580c"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M50 35 Q54 38 58 42"
        stroke="#ea580c"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Kalash (Top Ornament) */}
      <circle cx="50" cy="32" r="3" fill="#ea580c" />
      <path
        d="M50 29 L48 32 L52 32 Z"
        fill="#c2410c"
      />
      
      {/* Decorative Elements on Pillars */}
      <circle cx="23" cy="58" r="2" fill="#f97316" />
      <circle cx="77" cy="58" r="2" fill="#f97316" />
      
      {/* Temple Door */}
      <rect x="42" y="58" width="16" height="12" fill="#433117" rx="1" />
      <path
        d="M50 58 Q50 64 50 70"
        stroke="#270100"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Om Symbol in Circle */}
      <circle cx="50" cy="20" r="8" fill="none" stroke="#67461b" strokeWidth="1.5" />
      <path
        d="M50 15 Q46 18 50 21 Q54 18 50 15 M50 21 L50 25"
        stroke="#67461b"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

