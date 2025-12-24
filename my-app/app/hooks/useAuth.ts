'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_TOKEN_KEY = 'temple_auth_token';
const AUTH_USER_KEY = 'temple_auth_user';
const AUTH_EXPIRY_KEY = 'temple_auth_expiry';

// Mock user credentials (in production, this would be handled by backend)
const MOCK_CREDENTIALS = {
  username: 'admin',
  mobile: '9876543210',
  password: 'admin123',
};

interface User {
  username: string;
  email?: string;
  role?: string;
}

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check authentication on mount
    checkAuth();
  }, []);

  const checkAuth = () => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const userStr = localStorage.getItem(AUTH_USER_KEY);
      const expiryStr = localStorage.getItem(AUTH_EXPIRY_KEY);

      if (!token || !userStr || !expiryStr) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Check if token has expired
      const expiry = parseInt(expiryStr, 10);
      if (Date.now() > expiry) {
        // Token expired, clear auth
        logout();
        setIsLoading(false);
        return;
      }

      // Token is valid
      setIsAuthenticated(true);
      setUser(JSON.parse(userStr));
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  };

  const login = (usernameOrMobile: string, password: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        // Demo mode: Accept any 10-digit mobile number and any password
        const isMobile = /^[0-9]{10}$/.test(usernameOrMobile);
        
        // Validate mobile number format (must be 10 digits)
        if (!isMobile) {
          resolve({ success: false, error: 'Please enter a valid 10-digit mobile number' });
          return;
        }

        // Validate password is not empty
        if (!password || password.trim().length === 0) {
          resolve({ success: false, error: 'Password is required' });
          return;
        }

        // Accept any valid mobile and password for demo
        const user: User = {
          username: `user_${usernameOrMobile}`,
          email: `${usernameOrMobile}@temple.com`,
          role: 'Administrator',
        };

        // Set expiry to 24 hours from now
        const expiry = Date.now() + 24 * 60 * 60 * 1000;

        try {
          localStorage.setItem(AUTH_TOKEN_KEY, 'mock_token_' + Date.now());
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
          localStorage.setItem(AUTH_EXPIRY_KEY, expiry.toString());

          setIsAuthenticated(true);
          setUser(user);
          resolve({ success: true });
        } catch (error) {
          console.error('Error saving auth:', error);
          resolve({ success: false, error: 'Failed to save authentication' });
        }
      }, 500); // Simulate network delay
    });
  };

  const logout = () => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_EXPIRY_KEY);
    } catch (error) {
      console.error('Error clearing auth:', error);
    }

    setIsAuthenticated(false);
    setUser(null);
    router.push('/');
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    checkAuth,
  };
}

