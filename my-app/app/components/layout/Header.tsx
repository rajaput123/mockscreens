'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { colors, spacing, typography, animations } from '../../design-system';
import { navigationMenus } from '../navigation/navigationData';
import MegaMenu from '../navigation/MegaMenu';
import { useAuth } from '../../hooks/useAuth';
import NamahaLogo from './NamahaLogo';

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Hide header on landing and login pages
  const isLandingPage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const shouldHideHeader = isLandingPage || isLoginPage;

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

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Extract mobile number from username (format: user_9876543210)
  const getMobileNumber = () => {
    if (user?.username && user.username.startsWith('user_')) {
      return user.username.replace('user_', '');
    }
    return null;
  };

  // Check if a navigation menu is active based on pathname
  const isMenuActive = (menuKey: string) => {
    if (menuKey === 'operations') return pathname?.startsWith('/operations');
    if (menuKey === 'people') return pathname?.startsWith('/people');
    if (menuKey === 'projects') return pathname?.startsWith('/projects');
    if (menuKey === 'finance') return pathname?.startsWith('/finance');
    return false;
  };


  if (shouldHideHeader) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

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
        className="mx-auto flex h-full items-center justify-between relative max-w-7xl container-responsive"
        style={{ 
          paddingLeft: spacing.headerPaddingX,
          paddingRight: spacing.headerPaddingX,
        }}
      >
        {/* Logo Section */}
        <Link 
          href="/dashboard"
          className="flex items-center no-underline"
          style={{ gap: spacing.base }}
        >
          {/* Namaha Temple Logo */}
          <div className="flex items-center justify-center">
            <NamahaLogo className="w-11 h-11" />
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
        </Link>
        
        {/* Navigation - Centered */}
        <nav 
          className="absolute left-1/2 flex -translate-x-1/2 items-center"
          style={{ gap: spacing.navGap }}
        >
          <Link 
            href="/dashboard" 
            className={`group relative flex items-center ${animations.transitionColors} ${animations.hoverLift}`}
            style={{
              fontFamily: typography.nav.fontFamily,
              fontSize: typography.nav.fontSize,
              fontWeight: typography.nav.fontWeight,
              lineHeight: typography.nav.lineHeight,
              color: pathname === '/dashboard' ? colors.header.hover : '#ffffff',
              paddingTop: '8px',
              paddingBottom: '8px',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              if (pathname !== '/dashboard') {
                e.currentTarget.style.color = colors.header.hover;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = pathname === '/dashboard' ? colors.header.hover : '#ffffff';
            }}
          >
            Dashboard
          </Link>
          
          {/* Operations & Workflow Menu */}
          <div
            className="relative"
            onMouseEnter={() => handleMenuEnter('operations')}
            onMouseLeave={handleMenuLeave}
          >
            <a 
              href="/operations/operational-planning" 
              className={`group relative flex items-center gap-1 ${animations.transitionColors} ${animations.hoverLift}`}
              style={{
                fontFamily: typography.nav.fontFamily,
                fontSize: typography.nav.fontSize,
                fontWeight: typography.nav.fontWeight,
                lineHeight: typography.nav.lineHeight,
                color: isMenuActive('operations') ? colors.header.hover : '#ffffff',
                paddingTop: '8px',
                paddingBottom: '8px',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isMenuActive('operations')) {
                  e.currentTarget.style.color = colors.header.hover;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isMenuActive('operations') ? colors.header.hover : '#ffffff';
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
                style={{ marginLeft: '4px', color: 'inherit' }}
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
              href="/people/employee-management" 
              className={`group relative flex items-center gap-1 ${animations.transitionColors} ${animations.hoverLift}`}
              style={{
                fontFamily: typography.nav.fontFamily,
                fontSize: typography.nav.fontSize,
                fontWeight: typography.nav.fontWeight,
                lineHeight: typography.nav.lineHeight,
                color: isMenuActive('people') ? colors.header.hover : '#ffffff',
                paddingTop: '8px',
                paddingBottom: '8px',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isMenuActive('people')) {
                  e.currentTarget.style.color = colors.header.hover;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isMenuActive('people') ? colors.header.hover : '#ffffff';
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
              href="/projects/event-management/event-dashboard" 
              className={`group relative flex items-center gap-1 ${animations.transitionColors} ${animations.hoverLift}`}
              style={{
                fontFamily: typography.nav.fontFamily,
                fontSize: typography.nav.fontSize,
                fontWeight: typography.nav.fontWeight,
                lineHeight: typography.nav.lineHeight,
                color: isMenuActive('projects') ? colors.header.hover : '#ffffff',
                paddingTop: '8px',
                paddingBottom: '8px',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isMenuActive('projects')) {
                  e.currentTarget.style.color = colors.header.hover;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isMenuActive('projects') ? colors.header.hover : '#ffffff';
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
              href="/finance/accounts-financial/financial-dashboard" 
              className={`group relative flex items-center gap-1 ${animations.transitionColors} ${animations.hoverLift}`}
              style={{
                fontFamily: typography.nav.fontFamily,
                fontSize: typography.nav.fontSize,
                fontWeight: typography.nav.fontWeight,
                lineHeight: typography.nav.lineHeight,
                color: isMenuActive('finance') ? colors.header.hover : '#ffffff',
                paddingTop: '8px',
                paddingBottom: '8px',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isMenuActive('finance')) {
                  e.currentTarget.style.color = colors.header.hover;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isMenuActive('finance') ? colors.header.hover : '#ffffff';
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

          <Link 
            href="/settings"
            className={`group relative flex items-center ${animations.transitionColors} ${animations.hoverLift} no-underline`}
            style={{
              fontFamily: typography.nav.fontFamily,
              fontSize: typography.nav.fontSize,
              fontWeight: typography.nav.fontWeight,
              lineHeight: typography.nav.lineHeight,
              color: pathname === '/settings' ? colors.header.hover : '#ffffff',
              paddingTop: '8px',
              paddingBottom: '8px',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (pathname !== '/settings') {
                e.currentTarget.style.color = colors.header.hover;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = pathname === '/settings' ? colors.header.hover : '#ffffff';
            }}
          >
            Settings
          </Link>
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
          
          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
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
              aria-label="Profile"
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

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && user && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50"
                style={{
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                <div className="p-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900" style={{ fontFamily: typography.nav.fontFamily }}>
                    {user.username.replace('user_', '')}
                  </p>
                  {user.role && (
                    <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: typography.nav.fontFamily }}>
                      {user.role}
                    </p>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="space-y-3">
                    {getMobileNumber() && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: typography.nav.fontFamily }}>
                          Mobile Number
                        </p>
                        <p className="text-sm font-medium text-gray-900" style={{ fontFamily: typography.nav.fontFamily }}>
                          +91 {getMobileNumber()}
                        </p>
                      </div>
                    )}
                    {user.email && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: typography.nav.fontFamily }}>
                          Email
                        </p>
                        <p className="text-sm font-medium text-gray-900" style={{ fontFamily: typography.nav.fontFamily }}>
                          {user.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 p-2">
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                    style={{
                      fontFamily: typography.nav.fontFamily,
                      fontSize: typography.nav.fontSize,
                    }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
