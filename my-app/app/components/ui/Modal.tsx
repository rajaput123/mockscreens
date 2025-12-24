'use client';

import { ReactNode, useEffect } from 'react';
import { colors, spacing, typography, animations } from '../../design-system';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${animations.modalBackdrop}`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`relative bg-white rounded-3xl shadow-xl w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-hidden flex flex-col ${animations.modalEnter}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{
              borderColor: colors.border,
            }}
          >
            {title && (
              <h2
                style={{
                  fontFamily: typography.sectionHeader.fontFamily,
                  fontSize: typography.sectionHeader.fontSize,
                  fontWeight: typography.sectionHeader.fontWeight,
                  color: colors.text.primary,
                }}
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={`p-2 rounded-2xl hover:bg-gray-100 ${animations.transitionAll}`}
                aria-label="Close"
                style={{
                  color: colors.text.muted,
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto flex-1" style={{ padding: spacing.xl }}>
          {children}
        </div>
      </div>
    </div>
  );
}

