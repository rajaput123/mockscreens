'use client';

import Modal from '../ui/Modal';
import { Vendor } from './types';

interface VendorDetailModalProps {
  vendor: Vendor | null;
  onClose: () => void;
  onDelete?: (vendorId: string) => void;
}

export default function VendorDetailModal({ vendor, onClose, onDelete }: VendorDetailModalProps) {
  if (!vendor) return null;

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
    <Modal isOpen={!!vendor} onClose={onClose} title={vendor.name} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Type</label>
            <p className="mt-1 text-gray-900 capitalize">{vendor.type}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <p className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                vendor.status === 'active' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {vendor.status}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Contact Person</label>
            <p className="mt-1 text-gray-900">{vendor.contactPerson}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <p className="mt-1 text-gray-900">{vendor.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="mt-1 text-gray-900">{vendor.email}</p>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-600">Address</label>
            <p className="mt-1 text-gray-900">{vendor.address}</p>
          </div>
          {vendor.gstNumber && (
            <div>
              <label className="text-sm font-medium text-gray-600">GST Number</label>
              <p className="mt-1 text-gray-900">{vendor.gstNumber}</p>
            </div>
          )}
          {vendor.panNumber && (
            <div>
              <label className="text-sm font-medium text-gray-600">PAN Number</label>
              <p className="mt-1 text-gray-900">{vendor.panNumber}</p>
            </div>
          )}
          {vendor.rating && (
            <div>
              <label className="text-sm font-medium text-gray-600">Rating</label>
              <p className="mt-1 text-gray-900">{vendor.rating}/5.0</p>
            </div>
          )}
          {vendor.totalTransactions !== undefined && (
            <div>
              <label className="text-sm font-medium text-gray-600">Total Transactions</label>
              <p className="mt-1 text-gray-900">{vendor.totalTransactions}</p>
            </div>
          )}
          {vendor.totalAmount !== undefined && (
            <div>
              <label className="text-sm font-medium text-gray-600">Total Amount</label>
              <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(vendor.totalAmount)}</p>
            </div>
          )}
        </div>
        {vendor.bankDetails && (
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Bank Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Bank Name</label>
                <p className="mt-1 text-gray-900">{vendor.bankDetails.bankName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Account Number</label>
                <p className="mt-1 text-gray-900">{vendor.bankDetails.accountNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">IFSC Code</label>
                <p className="mt-1 text-gray-900">{vendor.bankDetails.ifscCode}</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-3 pt-4 border-t">
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this vendor?')) {
                  onDelete(vendor.id);
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
