'use client';

import { useState, useRef } from 'react';
import { colors, spacing, typography, animations } from '../../design-system';
import { navigationMenus } from '../navigation/navigationData';
import MegaMenu from '../navigation/MegaMenu';

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMenuEnter = (menuKey: string) => {
    // Clear any pending leave timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setOpenMenu(menuKey);
    const categories = navigationMenus[menuKey];
    if (categories && categories.length > 0) {
      setActiveCategory(categories[0].id);
    }
  };

  const handleMenuLeave = () => {
    // Small delay to allow moving to menu
    leaveTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
      setActiveCategory(null);
      leaveTimeoutRef.current = null;
    }, 150);
  };


  return (
    <header 
      className={`sticky top-0 z-50 relative ${animations.fadeIn}`}
      style={{ 
        backgroundColor: colors.header.bg,
        height: spacing.headerHeight,
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <div 
        className="mx-auto flex h-full items-center justify-between relative"
        style={{ 
          maxWidth: spacing.containerMaxWidth,
          paddingLeft: spacing.headerPaddingX,
          paddingRight: spacing.headerPaddingX,
        }}
      >
        {/* Logo Section */}
        <div className="flex items-center" style={{ gap: spacing.base }}>
          {/* Dummy Logo */}
          <div 
            className="flex items-center justify-center rounded-2xl"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: colors.header.hover,
              opacity: 0.9,
            }}
          >
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={colors.header.text}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div 
            className="cursor-pointer transition-opacity duration-200 ease-in-out hover:opacity-80"
            style={{
              fontFamily: typography.logo.fontFamily,
              fontSize: typography.logo.fontSize,
              fontWeight: typography.logo.fontWeight,
              lineHeight: typography.logo.lineHeight,
              color: colors.header.text,
            }}
          >
            Namaha
          </div>
        </div>
        
        {/* Navigation - Centered */}
        <nav 
          className="absolute left-1/2 flex -translate-x-1/2 items-center"
          style={{ gap: spacing.navGap }}
        >
          <a 
            href="/" 
            className={`group relative flex items-center ${animations.transitionColors} ${animations.hoverLift}`}
            style={{
              fontFamily: typography.nav.fontFamily,
              fontSize: typography.nav.fontSize,
              fontWeight: typography.nav.fontWeight,
              lineHeight: typography.nav.lineHeight,
              color: colors.header.text,
              paddingTop: '8px',
              paddingBottom: '8px',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.header.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.header.text;
            }}
          >
            Dashboard
          </a>
          
          {/* Operations & Workflow Menu */}
          <div
            className="relative"
            onMouseEnter={() => handleMenuEnter('operations')}
            onMouseLeave={handleMenuLeave}
          >
            <a 
              href="#" 
              className={`group relative flex items-center gap-1 ${animations.transitionColors} ${animations.hoverLift}`}
              style={{
                fontFamily: typography.nav.fontFamily,
                fontSize: typography.nav.fontSize,
                fontWeight: typography.nav.fontWeight,
                lineHeight: typography.nav.lineHeight,
                color: openMenu === 'operations' ? colors.header.hover : colors.header.textMuted,
                paddingTop: '8px',
                paddingBottom: '8px',
              }}
            >
              Operations
              <svg 
                width="12" 
                height="12" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                className={`${animations.transitionTransform} ${openMenu === 'operations' ? 'rotate-180' : ''}`}
                style={{ marginLeft: '4px' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* People & HR Menu */}
          <div
            className="relative"
            onMouseEnter={() => handleMenuEnter('people')}
            onMouseLeave={handleMenuLeave}
          >
            <a 
              href="#" 
              className={`group relative flex items-center gap-1 ${animations.transitionColors} ${animations.hoverLift}`}
              style={{
                fontFamily: typography.nav.fontFamily,
                fontSize: typography.nav.fontSize,
                fontWeight: typography.nav.fontWeight,
                lineHeight: typography.nav.lineHeight,
                color: openMenu === 'people' ? colors.header.hover : colors.header.textMuted,
                paddingTop: '8px',
                paddingBottom: '8px',
              }}
            >
              People
              <svg 
                width="12" 
                height="12" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                className={`${animations.transitionTransform} ${openMenu === 'people' ? 'rotate-180' : ''}`}
                style={{ marginLeft: '4px' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Project Management Menu */}
          <div
            className="relative"
            onMouseEnter={() => handleMenuEnter('projects')}
            onMouseLeave={handleMenuLeave}
          >
            <a 
              href="#" 
              className={`group relative flex items-center gap-1 ${animations.transitionColors} ${animations.hoverLift}`}
              style={{
                fontFamily: typography.nav.fontFamily,
                fontSize: typography.nav.fontSize,
                fontWeight: typography.nav.fontWeight,
                lineHeight: typography.nav.lineHeight,
                color: openMenu === 'projects' ? colors.header.hover : colors.header.textMuted,
                paddingTop: '8px',
                paddingBottom: '8px',
              }}
            >
              Projects
              <svg 
                width="12" 
                height="12" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                className={`${animations.transitionTransform} ${openMenu === 'projects' ? 'rotate-180' : ''}`}
                style={{ marginLeft: '4px' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Finance Menu */}
          <div
            className="relative"
            onMouseEnter={() => handleMenuEnter('finance')}
            onMouseLeave={handleMenuLeave}
          >
            <a 
              href="#" 
              className={`group relative flex items-center gap-1 ${animations.transitionColors} ${animations.hoverLift}`}
              style={{
                fontFamily: typography.nav.fontFamily,
                fontSize: typography.nav.fontSize,
                fontWeight: typography.nav.fontWeight,
                lineHeight: typography.nav.lineHeight,
                color: openMenu === 'finance' ? colors.header.hover : colors.header.textMuted,
                paddingTop: '8px',
                paddingBottom: '8px',
              }}
            >
              Finance
              <svg 
                width="12" 
                height="12" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                className={`${animations.transitionTransform} ${openMenu === 'finance' ? 'rotate-180' : ''}`}
                style={{ marginLeft: '4px' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

        
          <a 
            href="#" 
            className={`group relative flex items-center ${animations.transitionColors} ${animations.hoverLift}`}
            style={{
              fontFamily: typography.nav.fontFamily,
              fontSize: typography.nav.fontSize,
              fontWeight: typography.nav.fontWeight,
              lineHeight: typography.nav.lineHeight,
              color: colors.header.textMuted,
              paddingTop: '8px',
              paddingBottom: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.header.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.header.textMuted;
            }}
          >
            Settings
          </a>
        </nav>
        
        {/* Mega Menu - Rendered for full width */}
        {openMenu && navigationMenus[openMenu] && (
          <MegaMenu
            categories={navigationMenus[openMenu]}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onMouseEnter={() => {
              // Clear leave timeout when mouse enters menu
              if (leaveTimeoutRef.current) {
                clearTimeout(leaveTimeoutRef.current);
                leaveTimeoutRef.current = null;
              }
            }}
            onMouseLeave={handleMenuLeave}
          />
        )}
        
        {/* Right side - Actions */}
        <div 
          className="flex items-center"
          style={{ gap: spacing.md }}
        >
          {/* Search Icon */}
          <button 
            className={`flex items-center justify-center rounded-2xl ${animations.transitionAll} ${animations.hoverScaleSubtle} hover:opacity-80`}
            style={{
              width: '36px',
              height: '36px',
              color: colors.header.text,
            }}
            aria-label="Search"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Admin Profile */}
          <button
            className={`flex items-center justify-center rounded-full ${animations.transitionAll} ${animations.hoverScale}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: colors.header.text,
            }}
            aria-label="Admin Profile"
          >
            <svg 
              width="20" 
              height="20" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
