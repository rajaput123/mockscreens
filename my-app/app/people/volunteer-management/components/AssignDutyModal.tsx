'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../../../components';
import { colors, spacing, typography, shadows } from '../../../design-system';

interface AssignDutyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: { volunteerId: string; eventId: string; what: string; where: string; when: string }) => void;
}

export default function AssignDutyModal({ isOpen, onClose, onAssign }: AssignDutyModalProps) {
  const [volunteerId, setVolunteerId] = useState('');
  const [eventId, setEventId] = useState('');
  const [what, setWhat] = useState('');
  const [where, setWhere] = useState('');
  const [when, setWhen] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setVolunteerId('');
      setEventId('');
      setWhat('');
      setWhere('');
      setWhen('');
    }
  }, [isOpen]);

  const handleAssign = () => {
    if (volunteerId && eventId && what && where && when) {
      onAssign({ volunteerId, eventId, what, where, when });
      alert('Duty assigned successfully!');
      onClose();
    } else {
      alert('Please fill all required fields');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Duty" size="md">
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
            Volunteer
          </label>
          <select
            value={volunteerId}
            onChange={(e) => setVolunteerId(e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          >
            <option value="">Select Volunteer</option>
            <option value="vol-1">Krishna Das</option>
            <option value="vol-2">Radha Devi</option>
            <option value="vol-3">Gopal Sharma</option>
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
            Event / Festival
          </label>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          >
            <option value="">Select Event</option>
            <option value="event-1">Diwali Festival 2024</option>
            <option value="event-2">Navratri Celebration</option>
            <option value="event-3">Maha Shivaratri</option>
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
            What (Duty Description)
          </label>
          <input
            type="text"
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            placeholder="e.g., Manage prasad distribution"
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
            Where (Location)
          </label>
          <input
            type="text"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder="e.g., Main Hall"
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
            When (Date & Time)
          </label>
          <input
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
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
            onClick={handleAssign}
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
            Assign Duty
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

