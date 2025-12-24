'use client';

import { useState } from 'react';
import { Modal } from '../../../components';

interface FreelancerFormData {
  freelancerId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: 'active' | 'inactive' | 'on-contract';
  joinDate: string;
  address: string;
  hourlyRate: number;
}

interface AddFreelancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FreelancerFormData) => void;
  initialData?: FreelancerFormData | null;
}

const SPECIALIZATIONS = [
  'Web Development',
  'Graphic Design',
  'Content Writing',
  'Photography',
  'Video Editing',
  'Marketing',
  'IT Support',
  'Maintenance',
  'Accounting',
  'Legal Services',
  'Event Management',
  'Other'
];

export default function AddFreelancerModal({ isOpen, onClose, onSubmit, initialData }: AddFreelancerModalProps) {
  const [formData, setFormData] = useState<FreelancerFormData>(
    initialData || {
      freelancerId: '',
      name: '',
      email: '',
      phone: '',
      specialization: '',
      status: 'active',
      joinDate: '',
      address: '',
      hourlyRate: 0,
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof FreelancerFormData, string>>>({});

  const handleChange = (field: keyof FreelancerFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FreelancerFormData, string>> = {};

    if (!formData.freelancerId.trim()) {
      newErrors.freelancerId = 'Freelancer ID is required';
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
    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }
    if (!formData.joinDate.trim()) {
      newErrors.joinDate = 'Join date is required';
    }
    if (formData.hourlyRate < 0) {
      newErrors.hourlyRate = 'Hourly rate cannot be negative';
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
        freelancerId: '',
        name: '',
        email: '',
        phone: '',
        specialization: '',
        status: 'active',
        joinDate: '',
        address: '',
        hourlyRate: 0,
      });
    }
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Update Freelancer' : 'Add New Freelancer'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Freelancer ID *
            </label>
            <input
              type="text"
              value={formData.freelancerId}
              onChange={(e) => handleChange('freelancerId', e.target.value)}
              placeholder="Enter freelancer ID (e.g., FRE001)"
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.freelancerId ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
              }`}
            />
            {errors.freelancerId && (
              <p className="mt-1 text-sm text-red-600">{errors.freelancerId}</p>
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
              Specialization *
            </label>
            <select
              value={formData.specialization}
              onChange={(e) => handleChange('specialization', e.target.value)}
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm bg-white ${
                errors.specialization ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
              }`}
            >
              <option value="">Select Specialization</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            {errors.specialization && (
              <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as 'active' | 'inactive' | 'on-contract')}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-contract">On Contract</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Join Date *
            </label>
            <input
              type="date"
              value={formData.joinDate}
              onChange={(e) => handleChange('joinDate', e.target.value)}
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.joinDate ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
              }`}
            />
            {errors.joinDate && (
              <p className="mt-1 text-sm text-red-600">{errors.joinDate}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Hourly Rate (₹)
            </label>
            <input
              type="number"
              value={formData.hourlyRate || ''}
              onChange={(e) => handleChange('hourlyRate', parseFloat(e.target.value) || 0)}
              placeholder="Enter hourly rate"
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.hourlyRate ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
              }`}
              min="0"
              step="0.01"
            />
            {errors.hourlyRate && (
              <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter address (optional)"
              rows={3}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
            />
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
            {initialData ? 'Update Freelancer' : 'Add Freelancer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

