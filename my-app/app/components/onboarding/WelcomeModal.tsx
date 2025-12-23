'use client';

import { useState } from 'react';
import Link from 'next/link';
import { colors, spacing, typography, animations } from '../../design-system';

interface WelcomeModalProps {
  onClose: () => void;
  onComplete: (skipFuture: boolean) => void;
}

export default function WelcomeModal({ onClose, onComplete }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const steps = [
    'welcome',
    'navigation',
    'dashboard',
    'quickstart',
    'final',
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete(dontShowAgain);
  };

  const handleComplete = () => {
    onComplete(dontShowAgain);
  };

  const quickStartLinks = [
    {
      label: 'Add an Employee',
      href: '/people/employee-management/add-employee',
      description: 'People > Employee Management',
    },
    {
      label: 'Create a Booking',
      href: '/operations/ritual-seva-booking/create-booking',
      description: 'Operations > Ritual Seva Booking',
    },
    {
      label: 'View Financial Dashboard',
      href: '/finance/accounts-financial/financial-dashboard',
      description: 'Finance > Accounts & Financial',
    },
    {
      label: 'Create an Event',
      href: '/projects/event-management/create-event',
      description: 'Projects > Event Management',
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${animations.modalBackdrop}`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleSkip();
        }
      }}
    >
      <div
        className={`relative bg-white rounded-3xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${animations.modalEnter}`}
        style={{
          padding: spacing.xl,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className={`absolute top-4 right-4 p-2 rounded-2xl hover:bg-gray-100 ${animations.transitionAll} ${animations.hoverScaleSubtle}`}
          aria-label="Close"
          style={{
            color: colors.text.muted,
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="mt-8">
          {/* Welcome Screen */}
          {currentStep === 0 && (
            <div className="text-center">
              <div
                className="mb-6"
                style={{
                  fontFamily: typography.pageTitle.fontFamily,
                  fontSize: '32px',
                  fontWeight: typography.pageTitle.fontWeight,
                  color: colors.primary.base,
                }}
              >
                Welcome to Namaha
              </div>
              <p
                className="mb-8"
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  lineHeight: typography.body.lineHeight,
                  color: colors.text.primary,
                }}
              >
                Your comprehensive Temple Management System for operations, people, projects, and finance.
              </p>
              <p
                className="mb-8"
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  lineHeight: typography.body.lineHeight,
                  color: colors.text.muted,
                }}
              >
                Let's take a quick tour to help you get started.
              </p>
            </div>
          )}

          {/* Navigation Overview */}
          {currentStep === 1 && (
            <div>
              <h2
                className="mb-6"
                style={{
                  fontFamily: typography.sectionHeader.fontFamily,
                  fontSize: typography.sectionHeader.fontSize,
                  fontWeight: typography.sectionHeader.fontWeight,
                  color: colors.primary.base,
                }}
              >
                Navigation Overview
              </h2>
              <p
                className="mb-6"
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  lineHeight: typography.body.lineHeight,
                  color: colors.text.primary,
                }}
              >
                The application is organized into four main categories:
              </p>
              <div className="space-y-4 mb-6">
                {[
                  {
                    title: 'Operations',
                    description: 'Daily operations, tasks, rituals, bookings, and facility management',
                    icon: '⚙️',
                  },
                  {
                    title: 'People',
                    description: 'Employees, volunteers, devotees, and content management',
                    icon: '👥',
                  },
                  {
                    title: 'Projects',
                    description: 'Events, initiatives, and donation management',
                    icon: '📅',
                  },
                  {
                    title: 'Finance',
                    description: 'Accounts, donations, compliance, and financial reporting',
                    icon: '💰',
                  },
                ].map((category, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-3xl"
                    style={{
                      backgroundColor: colors.background.subtle,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div className="text-2xl">{category.icon}</div>
                    <div>
                      <h3
                        style={{
                          fontFamily: typography.listItem.fontFamily,
                          fontSize: typography.listItem.fontSize,
                          fontWeight: typography.listItem.fontWeight,
                          color: colors.text.primary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        {category.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: typography.bodySmall.fontFamily,
                          fontSize: typography.bodySmall.fontSize,
                          color: colors.text.muted,
                        }}
                      >
                        {category.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dashboard Features */}
          {currentStep === 2 && (
            <div>
              <h2
                className="mb-6"
                style={{
                  fontFamily: typography.sectionHeader.fontFamily,
                  fontSize: typography.sectionHeader.fontSize,
                  fontWeight: typography.sectionHeader.fontWeight,
                  color: colors.primary.base,
                }}
              >
                Dashboard Features
              </h2>
              <p
                className="mb-6"
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  lineHeight: typography.body.lineHeight,
                  color: colors.text.primary,
                }}
              >
                Your dashboard provides a comprehensive overview of temple operations:
              </p>
              <div className="space-y-4 mb-6">
                {[
                  {
                    title: 'Calendar Planning Zone',
                    description: 'View and manage daily schedules, rituals, and events across different calendars',
                  },
                  {
                    title: 'Events Snapshot',
                    description: 'See today\'s events and upcoming celebrations at a glance',
                  },
                  {
                    title: 'Task Management',
                    description: 'Track tasks, assignments, and workflow status',
                  },
                  {
                    title: 'Financial Summary',
                    description: 'Monitor revenue, expenses, donations, and financial trends',
                  },
                  {
                    title: 'Announcements',
                    description: 'Stay updated with important temple announcements and updates',
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-2xl"
                    style={{
                      backgroundColor: colors.background.subtle,
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: colors.primary.base,
                        color: 'white',
                        fontFamily: typography.bodySmall.fontFamily,
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: typography.listItem.fontFamily,
                          fontSize: typography.listItem.fontSize,
                          fontWeight: typography.listItem.fontWeight,
                          color: colors.text.primary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        {feature.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: typography.bodySmall.fontFamily,
                          fontSize: typography.bodySmall.fontSize,
                          color: colors.text.muted,
                        }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Start Actions */}
          {currentStep === 3 && (
            <div>
              <h2
                className="mb-6"
                style={{
                  fontFamily: typography.sectionHeader.fontFamily,
                  fontSize: typography.sectionHeader.fontSize,
                  fontWeight: typography.sectionHeader.fontWeight,
                  color: colors.primary.base,
                }}
              >
                Quick Start Actions
              </h2>
              <p
                className="mb-6"
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  lineHeight: typography.body.lineHeight,
                  color: colors.text.primary,
                }}
              >
                Here are some common tasks to get you started:
              </p>
              <div className="space-y-3 mb-6">
                {quickStartLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={handleComplete}
                    className="block p-4 rounded-2xl transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: colors.primary.base,
                      color: 'white',
                      textDecoration: 'none',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: typography.listItem.fontFamily,
                        fontSize: typography.listItem.fontSize,
                        fontWeight: typography.listItem.fontWeight,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {link.label}
                    </div>
                    <div
                      style={{
                        fontFamily: typography.bodySmall.fontFamily,
                        fontSize: typography.bodySmall.fontSize,
                        opacity: 0.9,
                      }}
                    >
                      {link.description}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Final Screen */}
          {currentStep === 4 && (
            <div className="text-center">
              <div
                className="mb-6 text-6xl"
                style={{
                  color: colors.primary.base,
                }}
              >
                ✨
              </div>
              <h2
                className="mb-4"
                style={{
                  fontFamily: typography.sectionHeader.fontFamily,
                  fontSize: typography.sectionHeader.fontSize,
                  fontWeight: typography.sectionHeader.fontWeight,
                  color: colors.primary.base,
                }}
              >
                You're All Set!
              </h2>
              <p
                className="mb-6"
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  lineHeight: typography.body.lineHeight,
                  color: colors.text.primary,
                }}
              >
                You're ready to start managing your temple operations. Explore the navigation menu to discover all available features.
              </p>
              <p
                className="mb-8"
                style={{
                  fontFamily: typography.bodySmall.fontFamily,
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.text.muted,
                }}
              >
                Need help? Look for the help icon or check the documentation for detailed guides.
              </p>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className="rounded-full transition-all"
                style={{
                  width: index === currentStep ? '24px' : '8px',
                  height: '8px',
                  backgroundColor: index === currentStep ? colors.primary.base : colors.border,
                }}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="dontShowAgain"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4"
                style={{
                  accentColor: colors.primary.base,
                }}
              />
              <label
                htmlFor="dontShowAgain"
                style={{
                  fontFamily: typography.bodySmall.fontFamily,
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.text.muted,
                  cursor: 'pointer',
                }}
              >
                Don't show again
              </label>
            </div>

            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className={`px-6 py-2 rounded-2xl ${animations.buttonHover} ${animations.buttonActive}`}
                  style={{
                    fontFamily: typography.link.fontFamily,
                    fontSize: typography.link.fontSize,
                    fontWeight: typography.link.fontWeight,
                    color: colors.text.primary,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.subtle;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Previous
                </button>
              )}
              <button
                onClick={currentStep === steps.length - 1 ? handleComplete : handleNext}
                className={`px-6 py-2 rounded-2xl text-white ${animations.buttonHover} ${animations.buttonActive}`}
                style={{
                  fontFamily: typography.link.fontFamily,
                  fontSize: typography.link.fontSize,
                  fontWeight: typography.link.fontWeight,
                  backgroundColor: colors.primary.base,
                }}
              >
                {currentStep === steps.length - 1 ? 'Start Exploring' : 'Next'}
              </button>
            </div>
          </div>

          {/* Skip Link */}
          {currentStep < steps.length - 1 && (
            <div className="text-center mt-4">
              <button
                onClick={handleSkip}
                className={`${animations.transitionColors} ${animations.hoverLift}`}
                style={{
                  fontFamily: typography.link.fontFamily,
                  fontSize: typography.link.fontSize,
                  color: colors.text.muted,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Skip Tour
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
