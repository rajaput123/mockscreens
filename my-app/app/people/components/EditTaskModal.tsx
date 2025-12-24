'use client';

import { useState } from 'react';
import { Modal } from '../../components';
import { colors, spacing, typography, shadows } from '../../design-system';
import { Task } from '../../task-assignment/types';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (updatedTask: Task) => void;
}

export default function EditTaskModal({ isOpen, onClose, task, onSave }: EditTaskModalProps) {
  const [formData, setFormData] = useState<Task | null>(task);

  if (!task || !formData) return null;

  const handleSave = () => {
    if (formData) {
      onSave({ ...formData, updatedAt: new Date().toISOString() });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task" size="md">
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
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all resize-none"
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
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                boxShadow: shadows.sm,
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
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
              Time Block
            </label>
            <select
              value={formData.timeBlock}
              onChange={(e) => setFormData({ ...formData, timeBlock: e.target.value as any })}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                boxShadow: shadows.sm,
              }}
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-2xl transition-all hover:scale-105"
            style={{
              backgroundColor: colors.primary.base,
              color: '#ffffff',
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 500,
              boxShadow: shadows.md,
            }}
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-2xl border-2 transition-all hover:scale-105"
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

