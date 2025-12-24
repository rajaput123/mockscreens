'use client';

import { useState } from 'react';
import { Modal } from '../../../components';
import { ImagePicker } from '../../../components';
import { colors, spacing, typography, shadows } from '../../../design-system';

interface VolunteerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  skills: string[];
  interests: string[];
  availability: string;
  imageUrl: string;
}

interface OnboardVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VolunteerFormData) => void;
}

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir'
];

const AVAILABLE_SKILLS = [
  'Event Planning', 'Cooking', 'Cleaning', 'Teaching', 'Administration',
  'IT Support', 'Maintenance', 'Photography', 'Music', 'Decoration', 'Other'
];

const AVAILABLE_INTERESTS = [
  'Temple Activities', 'Community Service', 'Education', 'Cultural Events',
  'Youth Programs', 'Elderly Care', 'Festival Management', 'Other'
];

export default function OnboardVolunteerModal({ isOpen, onClose, onSubmit }: OnboardVolunteerModalProps) {
  const [formData, setFormData] = useState<VolunteerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    skills: [],
    interests: [],
    availability: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof VolunteerFormData, string>>>({});
  const [activeTab, setActiveTab] = useState<'personal' | 'address' | 'skills'>('personal');

  const handleChange = (field: keyof VolunteerFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleArrayItem = (field: 'skills' | 'interests', value: string) => {
    setFormData((prev) => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof VolunteerFormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      skills: [],
      interests: [],
      availability: '',
      imageUrl: '',
    });
    setErrors({});
    setActiveTab('personal');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Onboard New Volunteer" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="border-b border-gray-200 pb-4">
          <ImagePicker
            value={formData.imageUrl}
            onChange={(url) => handleChange('imageUrl', url)}
            label="Volunteer Photo"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'personal'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Personal Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('address')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'address'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Address
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'skills'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Skills & Interests
          </button>
        </div>

        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
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
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Availability
              </label>
              <textarea
                value={formData.availability}
                onChange={(e) => handleChange('availability', e.target.value)}
                placeholder="Describe availability (e.g., Weekends, Evenings, etc.)"
                rows={3}
                className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Address Tab */}
        {activeTab === 'address' && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter street address"
                className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Enter city"
                  className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm bg-white"
                >
                  <option value="">Select State</option>
                  {STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  placeholder="Enter zip code"
                  className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Skills & Interests Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div>
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                Skills
              </label>
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_SKILLS.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => toggleArrayItem('skills', skill)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                Interests
              </label>
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_INTERESTS.map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => toggleArrayItem('interests', interest)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

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
            Onboard Volunteer
          </button>
        </div>
      </form>
    </Modal>
  );
}

