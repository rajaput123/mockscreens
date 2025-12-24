'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../../../components';
import { colors, spacing, typography, shadows } from '../../../design-system';
import { AudienceType } from '../types';

interface PublishAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (data: { title: string; message: string; audience: AudienceType; scheduledAt?: string }) => void;
  initialData?: { title: string; message: string; audience: AudienceType; scheduledAt?: string };
}

export default function PublishAnnouncementModal({ isOpen, onClose, onPublish, initialData }: PublishAnnouncementModalProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<AudienceType>('all');
  const [scheduled, setScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setMessage(initialData.message);
      setAudience(initialData.audience);
      setScheduled(!!initialData.scheduledAt);
      setScheduledDate(initialData.scheduledAt || '');
    } else if (!isOpen) {
      setTitle('');
      setMessage('');
      setAudience('all');
      setScheduled(false);
      setScheduledDate('');
    }
  }, [isOpen, initialData]);

  const handlePublish = () => {
    if (title && message) {
      if (scheduled && scheduledDate) {
        onPublish({ title, message, audience, scheduledAt: scheduledDate });
        alert(`Announcement scheduled for ${new Date(scheduledDate).toLocaleString()}`);
      } else {
        onPublish({ title, message, audience });
        alert('Announcement sent successfully!');
      }
      onClose();
    } else {
      alert('Please fill in title and message');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Announcement" : "Publish Announcement"} size="md">
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
            placeholder="Enter announcement title..."
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
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
            Audience
          </label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as AudienceType)}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          >
            <option value="all">All</option>
            <option value="devotees">Devotees</option>
            <option value="volunteers">Volunteers</option>
            <option value="employees">Employees</option>
            <option value="custom">Custom</option>
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
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter announcement message..."
            rows={8}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all resize-none"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="schedule"
            checked={scheduled}
            onChange={(e) => setScheduled(e.target.checked)}
            className="w-4 h-4"
          />
          <label
            htmlFor="schedule"
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.primary,
            }}
          >
            Schedule for later
          </label>
        </div>

        {scheduled && (
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
              Scheduled Date & Time
            </label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                boxShadow: shadows.sm,
              }}
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={handlePublish}
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
            {scheduled ? 'Schedule Announcement' : 'Send Immediately'}
          </button>
          <button
            onClick={() => {
              alert('Announcement saved as draft!');
              onClose();
            }}
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
            Save as Draft
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

