'use client';

import { useState } from 'react';
import { Modal } from '../../components';
import { colors, spacing, typography, shadows } from '../../design-system';
import { Task } from '../task-assignment/types';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (taskId: string, newStatus: Task['status']) => void;
}

export default function UpdateStatusModal({ isOpen, onClose, task, onUpdate }: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<Task['status']>(task?.status || 'pending');

  if (!task) return null;

  const handleUpdate = () => {
    onUpdate(task.id, selectedStatus);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Task Status" size="sm">
      <div className="space-y-4">
        <div>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}
          >
            Task: <strong>{task.title}</strong>
          </p>
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
            New Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as Task['status'])}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleUpdate}
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
            Update Status
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

