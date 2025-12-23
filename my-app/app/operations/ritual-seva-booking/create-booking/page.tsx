'use client';

import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import Tooltip from '../../../components/help/Tooltip';
import { colors, spacing, typography } from '../../../design-system';

export default function CreateBookingPage() {
  return (
    <ModuleLayout
      title="Create Booking"
      description="Create a new booking"
    >
      <div 
        className="rounded-3xl p-6"
        style={{
          backgroundColor: colors.background.base,
          border: `1px solid ${colors.border}`,
          padding: spacing.xl,
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h2
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              color: colors.text.primary,
            }}
          >
            Create Booking
          </h2>
          <Tooltip content="Create a new booking for rituals, seva, or other temple services. Ensure all required information is provided.">
            <button
              className="flex items-center justify-center w-5 h-5 rounded-full"
              style={{
                backgroundColor: colors.background.subtle,
                color: colors.primary.base,
              }}
              aria-label="Help"
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </Tooltip>
        </div>
        <p
          style={{
            fontFamily: typography.body.fontFamily,
            fontSize: typography.body.fontSize,
            color: colors.text.muted,
            marginBottom: spacing.lg,
          }}
        >
          Booking creation form will be implemented here. Use the help button for detailed instructions.
        </p>
        <div className="space-y-4">
          <div>
            <label
              className="flex items-center gap-2 mb-2"
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                color: colors.text.primary,
              }}
            >
              Booking Type
              <Tooltip content="Select the type of booking: Ritual, Seva, or other temple service">
                <button
                  className="flex items-center justify-center w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: colors.background.subtle,
                    color: colors.primary.base,
                  }}
                  aria-label="Help"
                >
                  <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </Tooltip>
            </label>
            <select
              className="w-full px-4 py-2 rounded-2xl border"
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                borderColor: colors.border,
              }}
            >
              <option>Select booking type</option>
            </select>
          </div>
          <div>
            <label
              className="flex items-center gap-2 mb-2"
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                color: colors.text.primary,
              }}
            >
              Date & Time
              <Tooltip content="Select the date and time for the booking. Check calendar availability first.">
                <button
                  className="flex items-center justify-center w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: colors.background.subtle,
                    color: colors.primary.base,
                  }}
                  aria-label="Help"
                >
                  <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </Tooltip>
            </label>
            <input
              type="datetime-local"
              className="w-full px-4 py-2 rounded-2xl border"
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                borderColor: colors.border,
              }}
            />
          </div>
        </div>
      </div>
      <HelpButton module="ritual-seva-booking" feature="create-booking" />
    </ModuleLayout>
  );
}
