'use client';

import { useState } from 'react';
import { Modal } from '../../../components';
import { getAllDevotees, Devotee } from '../../peopleData';

interface VIPFormData {
  devoteeId: string;
  vipLevel: 'gold' | 'silver' | 'platinum';
  vipServices: string[];
  specialNotes: string;
}

interface MarkVIPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VIPFormData) => void;
}

const AVAILABLE_VIP_SERVICES = [
  'Priority Darshan',
  'Special Seva Booking',
  'VIP Lounge Access',
  'Personalized Puja',
  'Festival Priority Access',
  'Dedicated Support',
  'Special Events Invitation',
  'Parking Privileges',
];

export default function MarkVIPModal({ isOpen, onClose, onSubmit }: MarkVIPModalProps) {
  const [formData, setFormData] = useState<VIPFormData>({
    devoteeId: '',
    vipLevel: 'gold',
    vipServices: [],
    specialNotes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof VIPFormData, string>>>({});
  const devotees = getAllDevotees().filter(d => !d.isVIP);

  const handleChange = (field: keyof VIPFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleService = (service: string) => {
    setFormData((prev) => {
      const updated = prev.vipServices.includes(service)
        ? prev.vipServices.filter(s => s !== service)
        : [...prev.vipServices, service];
      return { ...prev, vipServices: updated };
    });
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof VIPFormData, string>> = {};

    if (!formData.devoteeId) {
      newErrors.devoteeId = 'Devotee is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    // Reset form
    setFormData({
      devoteeId: '',
      vipLevel: 'gold',
      vipServices: [],
      specialNotes: '',
    });
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mark Devotee as VIP" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Devotee Selection */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Select Devotee *
          </label>
          <select
            value={formData.devoteeId}
            onChange={(e) => handleChange('devoteeId', e.target.value)}
            className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm bg-white ${
              errors.devoteeId ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
            }`}
          >
            <option value="">Select a devotee</option>
            {devotees.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.devoteeId})
              </option>
            ))}
          </select>
          {errors.devoteeId && (
            <p className="mt-1 text-sm text-red-600">{errors.devoteeId}</p>
          )}
          {devotees.length === 0 && (
            <p className="mt-1 text-sm text-gray-500">All devotees are already VIP</p>
          )}
        </div>

        {/* VIP Level */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            VIP Level *
          </label>
          <select
            value={formData.vipLevel}
            onChange={(e) => handleChange('vipLevel', e.target.value as 'gold' | 'silver' | 'platinum')}
            className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm bg-white"
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>

        {/* VIP Services */}
        <div>
          <label className="block mb-3 text-sm font-semibold text-gray-700">
            VIP Services
          </label>
          <div className="grid grid-cols-2 gap-3">
            {AVAILABLE_VIP_SERVICES.map((service) => (
              <label
                key={service}
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-all"
              >
                <input
                  type="checkbox"
                  checked={formData.vipServices.includes(service)}
                  onChange={() => toggleService(service)}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded"
                />
                <span className="text-sm text-gray-700">{service}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Special Notes */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Special Notes
          </label>
          <textarea
            value={formData.specialNotes}
            onChange={(e) => handleChange('specialNotes', e.target.value)}
            placeholder="Add any special notes about this VIP devotee..."
            rows={3}
            className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-2xl border-2 border-gray-300 text-gray-700 font-medium transition-all hover:bg-gray-50 hover:scale-105 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={devotees.length === 0}
            className="px-6 py-2 rounded-2xl bg-amber-600 text-white font-medium transition-all hover:bg-amber-700 hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark as VIP
          </button>
        </div>
      </form>
    </Modal>
  );
}

