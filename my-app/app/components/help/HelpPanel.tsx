'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { colors, spacing, typography } from '../../design-system';
import { getHelpContent, searchHelpContent, HelpContent } from './helpContent';

interface HelpPanelProps {
  onClose: () => void;
  context?: string;
  module?: string;
  feature?: string;
}

export default function HelpPanel({ onClose, context, module, feature }: HelpPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<HelpContent[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const content = getHelpContent(context, module, feature);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      const results = searchHelpContent(query);
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const displayContent = isSearching ? searchResults : (content ? [content] : []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
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
        className="bg-white rounded-3xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{
            borderColor: colors.border,
          }}
        >
          <h2
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              color: colors.primary.base,
            }}
          >
            {isSearching ? 'Search Results' : 'Help & Documentation'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-gray-100 transition-colors"
            aria-label="Close help"
            style={{
              color: colors.text.muted,
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-2xl border"
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                borderColor: colors.border,
              }}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              width="20"
              height="20"
              fill="none"
              stroke={colors.text.muted}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSearching && searchResults.length === 0 && searchQuery.trim() ? (
            <div
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                color: colors.text.muted,
                textAlign: 'center',
                padding: spacing.xl,
              }}
            >
              No results found for "{searchQuery}"
            </div>
          ) : displayContent.length === 0 ? (
            <div
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                color: colors.text.muted,
                textAlign: 'center',
                padding: spacing.xl,
              }}
            >
              No help content available
            </div>
          ) : (
            <div className="space-y-6">
              {displayContent.map((item) => (
                <div key={item.id} className="space-y-4">
                  <h3
                    style={{
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.sectionHeader.fontSize,
                      fontWeight: typography.sectionHeader.fontWeight,
                      color: colors.primary.base,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      lineHeight: typography.body.lineHeight,
                      color: colors.text.primary,
                    }}
                  >
                    {item.overview}
                  </p>

                  {item.steps && item.steps.length > 0 && (
                    <div>
                      <h4
                        className="mb-2"
                        style={{
                          fontFamily: typography.listItem.fontFamily,
                          fontSize: typography.listItem.fontSize,
                          fontWeight: typography.listItem.fontWeight,
                          color: colors.text.primary,
                        }}
                      >
                        Steps:
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        {item.steps.map((step, index) => (
                          <li
                            key={index}
                            style={{
                              fontFamily: typography.body.fontFamily,
                              fontSize: typography.body.fontSize,
                              color: colors.text.primary,
                            }}
                          >
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {item.tips && item.tips.length > 0 && (
                    <div>
                      <h4
                        className="mb-2"
                        style={{
                          fontFamily: typography.listItem.fontFamily,
                          fontSize: typography.listItem.fontSize,
                          fontWeight: typography.listItem.fontWeight,
                          color: colors.text.primary,
                        }}
                      >
                        Tips:
                      </h4>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        {item.tips.map((tip, index) => (
                          <li
                            key={index}
                            style={{
                              fontFamily: typography.body.fontFamily,
                              fontSize: typography.body.fontSize,
                              color: colors.text.primary,
                            }}
                          >
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.faq && item.faq.length > 0 && (
                    <div>
                      <h4
                        className="mb-2"
                        style={{
                          fontFamily: typography.listItem.fontFamily,
                          fontSize: typography.listItem.fontSize,
                          fontWeight: typography.listItem.fontWeight,
                          color: colors.text.primary,
                        }}
                      >
                        Frequently Asked Questions:
                      </h4>
                      <div className="space-y-3">
                        {item.faq.map((faq, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-2xl"
                            style={{
                              backgroundColor: colors.background.subtle,
                            }}
                          >
                            <p
                              className="font-semibold mb-1"
                              style={{
                                fontFamily: typography.body.fontFamily,
                                fontSize: typography.body.fontSize,
                                color: colors.primary.base,
                              }}
                            >
                              Q: {faq.question}
                            </p>
                            <p
                              style={{
                                fontFamily: typography.body.fontFamily,
                                fontSize: typography.body.fontSize,
                                color: colors.text.primary,
                              }}
                            >
                              A: {faq.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.related && item.related.length > 0 && (
                    <div>
                      <h4
                        className="mb-2"
                        style={{
                          fontFamily: typography.listItem.fontFamily,
                          fontSize: typography.listItem.fontSize,
                          fontWeight: typography.listItem.fontWeight,
                          color: colors.text.primary,
                        }}
                      >
                        Related Topics:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.related.map((relatedId, index) => (
                          <Link
                            key={index}
                            href={`/help#${relatedId}`}
                            className="px-3 py-1 rounded-2xl transition-colors"
                            style={{
                              fontFamily: typography.link.fontFamily,
                              fontSize: typography.link.fontSize,
                              color: colors.primary.base,
                              backgroundColor: colors.background.subtle,
                              textDecoration: 'none',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.primary.light;
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = colors.background.subtle;
                              e.currentTarget.style.color = colors.primary.base;
                            }}
                          >
                            {relatedId.replace(/-/g, ' ')}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t flex items-center justify-end"
          style={{
            borderColor: colors.border,
          }}
        >
          <Link
            href="/help"
            className="px-4 py-2 rounded-2xl transition-colors"
            style={{
              fontFamily: typography.link.fontFamily,
              fontSize: typography.link.fontSize,
              fontWeight: typography.link.fontWeight,
              color: colors.primary.base,
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            View Full Documentation →
          </Link>
        </div>
      </div>
    </div>
  );
}
