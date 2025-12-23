'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { ImagePicker } from '../../../components';
import { colors, spacing, typography } from '../../../design-system';

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

export default function OnboardVolunteerPage() {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSkills = ['Event Planning', 'Cooking', 'Cleaning', 'Teaching', 'Administration', 'IT Support', 'Maintenance', 'Other'];
  const availableInterests = ['Temple Activities', 'Community Service', 'Education', 'Cultural Events', 'Youth Programs', 'Elderly Care', 'Other'];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Volunteer onboarded successfully!');
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
    } catch (error) {
      alert('Error onboarding volunteer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModuleLayout
      title="Onboard Volunteer"
      description="Register a new volunteer"
    >
      <form onSubmit={handleSubmit}>
        <div
          className="rounded-3xl p-6 space-y-6"
          style={{
            backgroundColor: colors.background.base,
            border: `1px solid ${colors.border}`,
            padding: spacing.xl,
          }}
        >
          {/* Image Upload */}
          <div className="border-b pb-6" style={{ borderColor: colors.border }}>
            <ImagePicker
              value={formData.imageUrl}
              onChange={(url) => handleChange('imageUrl', url)}
              label="Volunteer Photo"
            />
          </div>

          {/* Personal Information */}
          <div>
            <h3
              style={{
                fontFamily: typography.sectionHeader.fontFamily,
                fontSize: typography.sectionHeader.fontSize,
                fontWeight: typography.sectionHeader.fontWeight,
                marginBottom: spacing.lg,
                color: colors.text.primary,
              }}
            >
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">
                  <span
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    First Name *
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`w-full px-4 py-2 rounded-2xl border ${
                    errors.firstName ? 'border-red-500' : ''
                  } focus:outline-none focus:ring-2`}
                  style={{
                    borderColor: errors.firstName ? colors.error.base : colors.border,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                  }}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm" style={{ color: colors.error.base }}>
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-2">
                  <span
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    Last Name *
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`w-full px-4 py-2 rounded-2xl border ${
                    errors.lastName ? 'border-red-500' : ''
                  } focus:outline-none focus:ring-2`}
                  style={{
                    borderColor: errors.lastName ? colors.error.base : colors.border,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                  }}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm" style={{ color: colors.error.base }}>
                    {errors.lastName}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-2">
                  <span
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    Email *
                  </span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-4 py-2 rounded-2xl border ${
                    errors.email ? 'border-red-500' : ''
                  } focus:outline-none focus:ring-2`}
                  style={{
                    borderColor: errors.email ? colors.error.base : colors.border,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                  }}
                />
                {errors.email && (
                  <p className="mt-1 text-sm" style={{ color: colors.error.base }}>
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-2">
                  <span
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    Phone *
                  </span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`w-full px-4 py-2 rounded-2xl border ${
                    errors.phone ? 'border-red-500' : ''
                  } focus:outline-none focus:ring-2`}
                  style={{
                    borderColor: errors.phone ? colors.error.base : colors.border,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                  }}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm" style={{ color: colors.error.base }}>
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="border-t pt-6" style={{ borderColor: colors.border }}>
            <h3
              style={{
                fontFamily: typography.sectionHeader.fontFamily,
                fontSize: typography.sectionHeader.fontSize,
                fontWeight: typography.sectionHeader.fontWeight,
                marginBottom: spacing.lg,
                color: colors.text.primary,
              }}
            >
              Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.border,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                  }}
                  placeholder="Street Address"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.border,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                  }}
                  placeholder="City"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.border,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                  }}
                  placeholder="State"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.border,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                  }}
                  placeholder="Zip Code"
                />
              </div>
            </div>
          </div>

          {/* Skills and Interests */}
          <div className="border-t pt-6" style={{ borderColor: colors.border }}>
            <h3
              style={{
                fontFamily: typography.sectionHeader.fontFamily,
                fontSize: typography.sectionHeader.fontSize,
                fontWeight: typography.sectionHeader.fontWeight,
                marginBottom: spacing.lg,
                color: colors.text.primary,
              }}
            >
              Skills & Interests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-3">
                  <span
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    Skills
                  </span>
                </label>
                <div className="space-y-2">
                  {availableSkills.map((skill) => (
                    <label
                      key={skill}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={() => toggleArrayItem('skills', skill)}
                        className="w-4 h-4"
                        style={{ accentColor: colors.primary.base }}
                      />
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {skill}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-3">
                  <span
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    Interests
                  </span>
                </label>
                <div className="space-y-2">
                  {availableInterests.map((interest) => (
                    <label
                      key={interest}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => toggleArrayItem('interests', interest)}
                        className="w-4 h-4"
                        style={{ accentColor: colors.primary.base }}
                      />
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {interest}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="border-t pt-6" style={{ borderColor: colors.border }}>
            <label className="block mb-2">
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.primary,
                  fontWeight: 500,
                }}
              >
                Availability
              </span>
            </label>
            <textarea
              value={formData.availability}
              onChange={(e) => handleChange('availability', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
              placeholder="Describe your availability (e.g., Weekends, Evenings, etc.)"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-6 border-t" style={{ borderColor: colors.border }}>
            <button
              type="button"
              className="px-6 py-2 rounded-2xl border-2 transition-all hover:scale-105"
              style={{
                borderColor: colors.border,
                color: colors.text.primary,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-2xl transition-all hover:scale-105 disabled:opacity-50"
              style={{
                backgroundColor: colors.primary.base,
                color: '#ffffff',
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                fontWeight: 500,
              }}
            >
              {isSubmitting ? 'Onboarding...' : 'Onboard Volunteer'}
            </button>
          </div>
        </div>
      </form>
    </ModuleLayout>
  );
}

