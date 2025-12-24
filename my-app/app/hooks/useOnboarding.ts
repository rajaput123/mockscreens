'use client';

import { useState, useEffect } from 'react';

const ONBOARDING_STORAGE_KEY = 'namaha_onboarding_completed';
const ONBOARDING_DONT_SHOW_KEY = 'namaha_onboarding_dont_show';

export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
    
    // Check localStorage on mount (only on client)
    if (typeof window !== 'undefined') {
      try {
        const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
        const dontShow = localStorage.getItem(ONBOARDING_DONT_SHOW_KEY) === 'true';
        setHasSeenOnboarding(completed);
        setDontShowAgain(dontShow);
      } catch (error) {
        // If localStorage is not available, default to showing onboarding
        console.error('Error accessing localStorage:', error);
        setHasSeenOnboarding(false);
        setDontShowAgain(false);
      }
    }
  }, []);

  const markOnboardingComplete = (skipFuture: boolean = false) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
        if (skipFuture) {
          localStorage.setItem(ONBOARDING_DONT_SHOW_KEY, 'true');
          setDontShowAgain(true);
        }
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    setHasSeenOnboarding(true);
  };

  const resetOnboarding = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(ONBOARDING_STORAGE_KEY);
        localStorage.removeItem(ONBOARDING_DONT_SHOW_KEY);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
    setHasSeenOnboarding(false);
    setDontShowAgain(false);
  };

  const shouldShowOnboarding = () => {
    // Don't show until client-side hydration is complete
    if (!isClient) return false;
    // Still loading
    if (hasSeenOnboarding === null) return false;
    // User chose not to show again
    if (dontShowAgain) return false;
    // Show if user hasn't seen it
    return !hasSeenOnboarding;
  };

  return {
    hasSeenOnboarding: hasSeenOnboarding ?? false,
    dontShowAgain,
    shouldShowOnboarding: shouldShowOnboarding(),
    markOnboardingComplete,
    resetOnboarding,
  };
}
