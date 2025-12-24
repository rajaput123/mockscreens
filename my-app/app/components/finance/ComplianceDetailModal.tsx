'use client';

import Modal from '../ui/Modal';
import { ComplianceRecord } from './types';

interface ComplianceDetailModalProps {
  record: ComplianceRecord | null;
  onClose: () => void;
  onDelete?: (recordId: string) => void;
}

export default function ComplianceDetailModal({ record, onClose, onDelete }: ComplianceDetailModalProps) {
  if (!record) return null;

  return (
    <Modal isOpen={!!record} onClose={onClose} title={record.title} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Type</label>
            <p className="mt-1 text-gray-900 capitalize">{record.type.replace('_', ' ')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <p className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                record.status === 'completed' ? 'bg-amber-100 text-amber-700' :
                record.status === 'overdue' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {record.status}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Due Date</label>
            <p className="mt-1 text-gray-900">
              {new Date(record.dueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        {record.description && (
          <div>
            <label className="text-sm font-medium text-gray-600">Description</label>
            <p className="mt-1 text-gray-900">{record.description}</p>
          </div>
        )}
        <div className="flex gap-3 pt-4 border-t">
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this compliance record?')) {
                  onDelete(record.id);
                  onClose();
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
