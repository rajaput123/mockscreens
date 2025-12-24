'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../../../components';
import { colors, spacing, typography, shadows } from '../../../design-system';
import { ContentType } from '../types';

interface ContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; content: string; type: ContentType; language: string }) => void;
  initialData?: { title: string; content: string; type: ContentType; language: string };
}

export default function ContentEditorModal({ isOpen, onClose, onSave, initialData }: ContentEditorModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<ContentType>('information');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setType(initialData.type);
      setLanguage(initialData.language);
    } else {
      setTitle('');
      setContent('');
      setType('information');
      setLanguage('en');
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (title && content) {
      onSave({ title, content, type, language });
      onClose();
    } else {
      alert('Please fill in title and content');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Content Editor" size="lg">
      <div className="space-y-4">
        <div>
          <label
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: colors.text.primary,
              marginBottom: spacing.xs,
              display: 'block',
            }}
          >
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter content title..."
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
                marginBottom: spacing.xs,
                display: 'block',
              }}
            >
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ContentType)}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                boxShadow: shadows.sm,
              }}
            >
              <option value="event">Event</option>
              <option value="notice">Notice</option>
              <option value="information">Information</option>
              <option value="ritual-guide">Ritual Guide</option>
              <option value="temple-information">Temple Information</option>
            </select>
          </div>

          <div>
            <label
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
                marginBottom: spacing.xs,
                display: 'block',
              }}
            >
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                boxShadow: shadows.sm,
              }}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
        </div>

        <div>
          <label
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: colors.text.primary,
              marginBottom: spacing.xs,
              display: 'block',
            }}
          >
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter content..."
            rows={10}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all resize-none"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-2xl transition-all hover:scale-105"
            style={{
              backgroundColor: colors.primary.base,
              color: '#ffffff',
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 500,
              boxShadow: shadows.md,
            }}
          >
            Save as Draft
          </button>
          <button
            onClick={() => {
              if (title && content) {
                alert('Content submitted for review successfully!');
                onSave({ title, content, type, language });
                onClose();
              } else {
                alert('Please fill in title and content');
              }
            }}
            className="px-6 py-2 rounded-2xl border-2 transition-all hover:scale-105"
            style={{
              borderColor: colors.primary.base,
              color: colors.primary.base,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 500,
              boxShadow: shadows.sm,
            }}
          >
            Submit for Review
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-2xl border-2 transition-all hover:scale-105"
            style={{
              borderColor: colors.border,
              color: colors.text.primary,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 500,
              boxShadow: shadows.sm,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

