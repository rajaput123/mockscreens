'use client';

import Modal from '../ui/Modal';
import { Certificate80G } from './types';

interface Certificate80GDetailModalProps {
  certificate: Certificate80G | null;
  onClose: () => void;
  onDelete?: (certificateId: string) => void;
  onDownload?: (certificate: Certificate80G) => void;
}

export default function Certificate80GDetailModal({ certificate, onClose, onDelete, onDownload }: Certificate80GDetailModalProps) {
  if (!certificate) return null;

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
    <Modal isOpen={!!certificate} onClose={onClose} title={`80G Certificate - ${certificate.certificateNumber}`} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Certificate Number</label>
            <p className="mt-1 text-gray-900 font-semibold">{certificate.certificateNumber}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <p className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                certificate.status === 'issued' ? 'bg-amber-100 text-amber-700' :
                certificate.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {certificate.status}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Donor Name</label>
            <p className="mt-1 text-gray-900">{certificate.donorName}</p>
          </div>
          {certificate.donorPan && (
            <div>
              <label className="text-sm font-medium text-gray-600">Donor PAN</label>
              <p className="mt-1 text-gray-900">{certificate.donorPan}</p>
            </div>
          )}
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-600">Donor Address</label>
            <p className="mt-1 text-gray-900">{certificate.donorAddress}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Donation Amount</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(certificate.donationAmount)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Donation Date</label>
            <p className="mt-1 text-gray-900">
              {new Date(certificate.donationDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Donation Type</label>
            <p className="mt-1 text-gray-900 capitalize">{certificate.donationType.replace('_', ' ')}</p>
          </div>
          {certificate.transactionId && (
            <div>
              <label className="text-sm font-medium text-gray-600">Transaction ID</label>
              <p className="mt-1 text-gray-900">{certificate.transactionId}</p>
            </div>
          )}
          {certificate.issuedAt && (
            <div>
              <label className="text-sm font-medium text-gray-600">Issued At</label>
              <p className="mt-1 text-gray-900">
                {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
          {certificate.issuedBy && (
            <div>
              <label className="text-sm font-medium text-gray-600">Issued By</label>
              <p className="mt-1 text-gray-900">{certificate.issuedBy}</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 pt-4 border-t">
          {onDownload && (
            <button
              onClick={() => {
                onDownload(certificate);
              }}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Download
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this certificate?')) {
                  onDelete(certificate.id);
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
