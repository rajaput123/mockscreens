'use client';

import { useState } from 'react';
import { Modal } from '../../../components';

interface DevoteeFormData {
  devoteeId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  registrationDate: string;
}

interface CreateDevoteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DevoteeFormData) => void;
  initialData?: DevoteeFormData | null;
}

export default function CreateDevoteeModal({ isOpen, onClose, onSubmit, initialData }: CreateDevoteeModalProps) {
  const [formData, setFormData] = useState<DevoteeFormData>(
    initialData || {
      devoteeId: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
      registrationDate: '',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof DevoteeFormData, string>>>({});

  const handleChange = (field: keyof DevoteeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DevoteeFormData, string>> = {};

    if (!formData.devoteeId.trim()) {
      newErrors.devoteeId = 'Devotee ID is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.registrationDate.trim()) {
      newErrors.registrationDate = 'Registration date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    if (!initialData) {
      // Reset form only if creating new
      setFormData({
        devoteeId: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
        registrationDate: '',
      });
    }
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Update Devotee' : 'Create Devotee'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Devotee ID *
            </label>
            <input
              type="text"
              value={formData.devoteeId}
              onChange={(e) => handleChange('devoteeId', e.target.value)}
              placeholder="Enter devotee ID"
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.devoteeId ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
              }`}
            />
            {errors.devoteeId && (
              <p className="mt-1 text-sm text-red-600">{errors.devoteeId}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter full name"
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.name ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter phone number"
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.phone ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as 'active' | 'inactive')}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Registration Date *
            </label>
            <input
              type="date"
              value={formData.registrationDate}
              onChange={(e) => handleChange('registrationDate', e.target.value)}
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.registrationDate ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
              }`}
            />
            {errors.registrationDate && (
              <p className="mt-1 text-sm text-red-600">{errors.registrationDate}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter full address"
              rows={3}
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.address ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>
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
            className="px-6 py-2 rounded-2xl bg-amber-600 text-white font-medium transition-all hover:bg-amber-700 hover:scale-105 shadow-md"
          >
            {initialData ? 'Update Devotee' : 'Create Devotee'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

