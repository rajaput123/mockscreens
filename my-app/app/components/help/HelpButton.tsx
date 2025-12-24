'use client';

import { useState } from 'react';
import { colors, spacing, typography } from '../../design-system';
import HelpPanel from './HelpPanel';

interface HelpButtonProps {
  context?: string;
  module?: string;
  feature?: string;
}

export default function HelpButton({ context, module, feature }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110"
        style={{
          width: '56px',
          height: '56px',
          backgroundColor: colors.primary.base,
          color: 'white',
        }}
        aria-label="Open help"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      {isOpen && (
        <HelpPanel
          onClose={() => setIsOpen(false)}
          context={context}
          module={module}
          feature={feature}
        />
      )}
    </>
  );
}
