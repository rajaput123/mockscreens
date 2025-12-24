'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';
import { Certificate80G } from './types';

interface Generate80GModalProps {
  onClose: () => void;
  onGenerate: (certificate: Omit<Certificate80G, 'id' | 'certificateNumber' | 'createdAt' | 'updatedAt'>) => void;
}

export default function Generate80GModal({ onClose, onGenerate }: Generate80GModalProps) {
  const [formData, setFormData] = useState({
    donorName: '',
    donorPan: '',
    donorAddress: '',
    donationAmount: '',
    donationDate: new Date().toISOString().split('T')[0],
    donationType: 'bank_transfer',
    transactionId: '',
    status: 'issued' as 'issued' | 'draft' | 'cancelled',
    issuedBy: 'Admin',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      ...formData,
      donationAmount: parseFloat(formData.donationAmount),
    });
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Generate 80G Certificate" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Donor Name</label>
            <input
              type="text"
              value={formData.donorName}
              onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Donor PAN</label>
            <input
              type="text"
              value={formData.donorPan}
              onChange={(e) => setFormData({ ...formData, donorPan: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Donor Address</label>
            <textarea
              value={formData.donorAddress}
              onChange={(e) => setFormData({ ...formData, donorAddress: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Donation Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.donationAmount}
              onChange={(e) => setFormData({ ...formData, donationAmount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Donation Date</label>
            <input
              type="date"
              value={formData.donationDate}
              onChange={(e) => setFormData({ ...formData, donationDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Donation Type</label>
            <select
              value={formData.donationType}
              onChange={(e) => setFormData({ ...formData, donationType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="cheque">Cheque</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
            <input
              type="text"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            >
              <option value="issued">Issued</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Generate Certificate
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

