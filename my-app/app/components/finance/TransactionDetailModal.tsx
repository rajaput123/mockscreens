'use client';

import Modal from '../ui/Modal';
import { Transaction } from './types';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
}

export default function TransactionDetailModal({ transaction, onClose, onEdit, onDelete }: TransactionDetailModalProps) {
  if (!transaction) return null;

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-amber-100 text-amber-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Modal isOpen={!!transaction} onClose={onClose} title="Transaction Details" size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Type</label>
            <p className="mt-1">
              <span className={`text-sm font-medium capitalize ${
                transaction.type === 'income' ? 'text-amber-600' : 'text-red-600'
              }`}>
                {transaction.type}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <p className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                {transaction.status}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Category</label>
            <p className="mt-1 text-gray-900">{transaction.category}</p>
          </div>
          {transaction.subCategory && (
            <div>
              <label className="text-sm font-medium text-gray-600">Sub Category</label>
              <p className="mt-1 text-gray-900">{transaction.subCategory}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-600">Amount</label>
            <p className={`mt-1 text-lg font-semibold ${
              transaction.type === 'income' ? 'text-amber-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Date</label>
            <p className="mt-1 text-gray-900">
              {new Date(transaction.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Payment Method</label>
            <p className="mt-1 text-gray-900 capitalize">{transaction.paymentMethod?.replace('_', ' ') || 'N/A'}</p>
          </div>
          {transaction.referenceNumber && (
            <div>
              <label className="text-sm font-medium text-gray-600">Reference Number</label>
              <p className="mt-1 text-gray-900">{transaction.referenceNumber}</p>
            </div>
          )}
          {transaction.vendorName && (
            <div>
              <label className="text-sm font-medium text-gray-600">Vendor</label>
              <p className="mt-1 text-gray-900">{transaction.vendorName}</p>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Description</label>
          <p className="mt-1 text-gray-900">{transaction.description}</p>
        </div>
        <div className="flex gap-3 pt-4 border-t">
          {onEdit && (
            <button
              onClick={() => {
                onEdit(transaction);
                onClose();
              }}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this transaction?')) {
                  onDelete(transaction.id);
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

