'use client';

import Modal from '../ui/Modal';
import { Branch } from './types';

interface BranchDetailModalProps {
  branch: Branch | null;
  onClose: () => void;
  onDelete?: (branchId: string) => void;
}

export default function BranchDetailModal({ branch, onClose, onDelete }: BranchDetailModalProps) {
  if (!branch) return null;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(2)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  return (
    <Modal isOpen={!!branch} onClose={onClose} title={branch.name} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Branch Code</label>
            <p className="mt-1 text-gray-900">{branch.code}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <p className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                branch.status === 'active' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {branch.status}
              </span>
            </p>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-600">Address</label>
            <p className="mt-1 text-gray-900">
              {branch.address}, {branch.city}, {branch.state} - {branch.pincode}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <p className="mt-1 text-gray-900">{branch.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="mt-1 text-gray-900">{branch.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Manager</label>
            <p className="mt-1 text-gray-900">{branch.managerName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Manager Phone</label>
            <p className="mt-1 text-gray-900">{branch.managerPhone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Opening Date</label>
            <p className="mt-1 text-gray-900">
              {new Date(branch.openingDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Total Revenue</label>
            <p className="mt-1 text-lg font-semibold text-amber-600">{formatCurrency(branch.totalRevenue)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Total Expenses</label>
            <p className="mt-1 text-lg font-semibold text-red-600">{formatCurrency(branch.totalExpenses)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Net Profit</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatCurrency(branch.totalRevenue - branch.totalExpenses)}
            </p>
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t">
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this branch?')) {
                  onDelete(branch.id);
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
