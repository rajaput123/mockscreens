'use client';

import { useState, useRef } from 'react';
import { colors, spacing, typography } from '../../design-system';

interface ImagePickerProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  className?: string;
}

export default function ImagePicker({ value, onChange, label, className = '' }: ImagePickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showUnsplash, setShowUnsplash] = useState(false);
  const [unsplashSearch, setUnsplashSearch] = useState('');
  const [unsplashResults, setUnsplashResults] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        e.target.value = ''; // Reset file input
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        e.target.value = ''; // Reset file input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onChange(reader.result as string);
          // Reset file input to allow re-uploading the same file
          e.target.value = '';
        }
      };
      reader.onerror = () => {
        alert('Error reading image file. Please try again.');
        e.target.value = ''; // Reset file input
      };
      reader.readAsDataURL(file);
    }
  };

  const searchUnsplash = async (query: string) => {
    if (!query.trim()) {
      setUnsplashResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Using Unsplash Source API (no key required for basic usage)
      const response = await fetch(
        `https://source.unsplash.com/400x400/?${encodeURIComponent(query)}`
      );
      // For multiple results, we'll use a different approach
      // Using Unsplash API would require a key, so we'll use placeholder approach
      const imageUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(query)}`;
      setUnsplashResults([imageUrl]);
    } catch (error) {
      console.error('Error fetching from Unsplash:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsplashSearch = () => {
    if (unsplashSearch.trim()) {
      // Generate multiple random Unsplash URLs for the search term
      const results: string[] = [];
      for (let i = 0; i < 6; i++) {
        results.push(
          `https://source.unsplash.com/400x400/?${encodeURIComponent(unsplashSearch)}&sig=${i}`
        );
      }
      setUnsplashResults(results);
    }
  };

  const selectUnsplashImage = (url: string) => {
    onChange(url);
    setShowUnsplash(false);
    setUnsplashSearch('');
    setUnsplashResults([]);
  };

  return (
    <div className={className}>
      {label && (
        <label
          className="block mb-2"
          style={{
            fontFamily: typography.body.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: 500,
            color: colors.text.primary,
          }}
        >
          {label}
        </label>
      )}

      <div className="space-y-4">
        {/* Current Image Preview */}
        {value && (
          <div 
            className="relative w-32 h-32 rounded-2xl overflow-hidden border-2" 
            style={{ 
              borderColor: colors.border,
              backgroundColor: colors.background.subtle
            }}
          >
            <img
              src={value}
              alt="Selected"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => onChange('')}
              className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-2xl border-2 transition-all hover:scale-105"
            style={{
              borderColor: colors.primary.base,
              color: colors.primary.base,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
          >
            Upload Image
          </button>
          <button
            type="button"
            onClick={() => setShowUnsplash(!showUnsplash)}
            className="px-4 py-2 rounded-2xl border-2 transition-all hover:scale-105"
            style={{
              borderColor: colors.primary.base,
              color: colors.primary.base,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
          >
            {showUnsplash ? 'Hide' : 'Browse'} Unsplash
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Unsplash Search */}
        {showUnsplash && (
          <div className="border-2 rounded-2xl p-4" style={{ borderColor: colors.border }}>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={unsplashSearch}
                onChange={(e) => setUnsplashSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUnsplashSearch()}
                placeholder="Search Unsplash (e.g., portrait, professional, person)"
                className="flex-1 px-4 py-2 rounded-xl border"
                style={{
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              />
              <button
                type="button"
                onClick={handleUnsplashSearch}
                disabled={isLoading || !unsplashSearch.trim()}
                className="px-4 py-2 rounded-xl transition-all hover:scale-105 disabled:opacity-50"
                style={{
                  backgroundColor: colors.primary.base,
                  color: '#ffffff',
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Unsplash Results */}
            {unsplashResults.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {unsplashResults.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectUnsplashImage(url)}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 hover:border-amber-500"
                    style={{ borderColor: colors.border }}
                  >
                    <img
                      src={url}
                      alt={`Unsplash result ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {unsplashResults.length === 0 && unsplashSearch && !isLoading && (
              <p className="text-center py-4" style={{ color: colors.text.muted }}>
                No results found. Try a different search term.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

