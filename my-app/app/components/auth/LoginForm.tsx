'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { animations } from '../../design-system';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate mobile number (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNumber.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit mobile number.');
      setIsLoading(false);
      return;
    }

    try {
      // Use mobile number as username for login
      const cleanMobile = mobileNumber.replace(/\D/g, '');
      const result = await login(cleanMobile, password);
      if (result.success) {
        // Get intended destination from query params or default to dashboard
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/dashboard';
        router.push(redirect);
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setMobileNumber(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className={`${animations.fadeIn} bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl`}>
          {error}
        </div>
      )}

      <div>
        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Mobile Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500 text-lg">+91</span>
          </div>
          <input
            id="mobileNumber"
            type="tel"
            value={mobileNumber}
            onChange={handleMobileChange}
            required
            maxLength={10}
            className="w-full pl-14 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            placeholder="Enter your 10-digit mobile number"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
          placeholder="Enter your password"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full ${animations.buttonHover} ${animations.buttonActive} px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Logging in...
          </span>
        ) : (
          'Login'
        )}
      </button>

      <div className="text-center text-sm text-gray-600">
        <p className="mb-2">Demo Mode:</p>
        <p className="font-mono text-xs bg-gray-100 px-3 py-2 rounded-lg inline-block">
          Enter any 10-digit mobile number and password
        </p>
      </div>
    </form>
  );
}

