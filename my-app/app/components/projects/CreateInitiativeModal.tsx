'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';
import { Project } from './types';
import { colors, spacing, typography } from '../../design-system';

interface CreateInitiativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
}

export default function CreateInitiativeModal({
  isOpen,
  onClose,
  onCreateProject,
}: CreateInitiativeModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'planning' as 'planning' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled',
    startDate: '',
    endDate: '',
    targetAmount: '',
    currentAmount: '0',
    location: '',
    coordinator: '',
    coordinatorPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Valid target amount is required';
    }
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.coordinator.trim()) newErrors.coordinator = 'Coordinator is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      progress: 0,
      location: formData.location,
      coordinator: formData.coordinator,
      coordinatorPhone: formData.coordinatorPhone,
      milestones: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onCreateProject(newProject);
    setFormData({
      title: '',
      description: '',
      category: '',
      status: 'planning',
      startDate: '',
      endDate: '',
      targetAmount: '',
      currentAmount: '0',
      location: '',
      coordinator: '',
      coordinatorPhone: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Initiative" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
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
              Title *
            </span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
            style={{
              borderColor: errors.title ? colors.error.base : colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
            placeholder="Enter project title"
          />
          {errors.title && (
            <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
              {errors.title}
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
              Description *
            </span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
            style={{
              borderColor: errors.description ? colors.error.base : colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
            rows={4}
            placeholder="Enter project description"
          />
          {errors.description && (
            <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
              {errors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                Category *
              </span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                if (errors.category) setErrors({ ...errors, category: '' });
              }}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: errors.category ? colors.error.base : colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              <option value="">Select category</option>
              <option value="Renovation">Renovation</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Community">Community</option>
              <option value="Cultural">Cultural</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
                {errors.category}
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
                Status *
              </span>
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'planning' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled',
                })
              }
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                Start Date *
              </span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => {
                setFormData({ ...formData, startDate: e.target.value });
                if (errors.startDate) setErrors({ ...errors, startDate: '' });
              }}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: errors.startDate ? colors.error.base : colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            />
            {errors.startDate && (
              <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
                {errors.startDate}
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
                End Date *
              </span>
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => {
                setFormData({ ...formData, endDate: e.target.value });
                if (errors.endDate) setErrors({ ...errors, endDate: '' });
              }}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: errors.endDate ? colors.error.base : colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            />
            {errors.endDate && (
              <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
                {errors.endDate}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                Target Amount (₹) *
              </span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) => {
                setFormData({ ...formData, targetAmount: e.target.value });
                if (errors.targetAmount) setErrors({ ...errors, targetAmount: '' });
              }}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: errors.targetAmount ? colors.error.base : colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
              placeholder="0.00"
            />
            {errors.targetAmount && (
              <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
                {errors.targetAmount}
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
                Current Amount (₹)
              </span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
              placeholder="0.00"
            />
          </div>
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
              Location *
            </span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => {
              setFormData({ ...formData, location: e.target.value });
              if (errors.location) setErrors({ ...errors, location: '' });
            }}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
            style={{
              borderColor: errors.location ? colors.error.base : colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
            placeholder="Enter location"
          />
          {errors.location && (
            <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
              {errors.location}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                Coordinator *
              </span>
            </label>
            <input
              type="text"
              value={formData.coordinator}
              onChange={(e) => {
                setFormData({ ...formData, coordinator: e.target.value });
                if (errors.coordinator) setErrors({ ...errors, coordinator: '' });
              }}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: errors.coordinator ? colors.error.base : colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
              placeholder="Enter coordinator name"
            />
            {errors.coordinator && (
              <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
                {errors.coordinator}
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
                Coordinator Phone
              </span>
            </label>
            <input
              type="tel"
              value={formData.coordinatorPhone}
              onChange={(e) => setFormData({ ...formData, coordinatorPhone: e.target.value })}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
              placeholder="+91 1234567890"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-2xl border transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.primary,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-2xl text-white transition-all"
            style={{
              backgroundColor: colors.primary.base,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
          >
            Create Initiative
          </button>
        </div>
      </form>
    </Modal>
  );
}

