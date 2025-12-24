'use client';

import { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { getAllTemples } from '../temple-management/templeData';
import { 
  type CapacityRule, 
  saveCapacityRule, 
  generateCapacityRuleId,
  lockCapacity,
  unlockCapacity
} from './capacityData';

interface CapacitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRule?: CapacityRule | null;
}

export default function CapacitySettingsModal({ isOpen, onClose, editingRule }: CapacitySettingsModalProps) {
  const [temples, setTemples] = useState<Array<{ id: string; name: string; deity?: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLocking, setIsLocking] = useState(false);
  const [lockReason, setLockReason] = useState('');

  const [formData, setFormData] = useState({
    templeId: '',
    location: '',
    maxCapacity: '',
    currentOccupancy: '',
    isLocked: false,
    lockedReason: '',
    effectiveFrom: '',
    effectiveTill: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (isOpen) {
      const allTemples = getAllTemples();
      setTemples(allTemples.map(t => ({ id: t.id, name: t.name, deity: t.deity })));

      if (editingRule) {
        setFormData({
          templeId: editingRule.templeId,
          location: editingRule.location,
          maxCapacity: editingRule.maxCapacity.toString(),
          currentOccupancy: editingRule.currentOccupancy.toString(),
          isLocked: editingRule.isLocked,
          lockedReason: editingRule.lockedReason || '',
          effectiveFrom: editingRule.effectiveFrom || '',
          effectiveTill: editingRule.effectiveTill || '',
          status: editingRule.status,
        });
        setLockReason(editingRule.lockedReason || '');
      } else {
        setFormData({
          templeId: '',
          location: '',
          maxCapacity: '',
          currentOccupancy: '',
          isLocked: false,
          lockedReason: '',
          effectiveFrom: '',
          effectiveTill: '',
          status: 'active',
        });
        setLockReason('');
      }
      setErrors({});
    }
  }, [isOpen, editingRule]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.templeId) {
      newErrors.templeId = 'Temple is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.maxCapacity || parseInt(formData.maxCapacity) <= 0) {
      newErrors.maxCapacity = 'Maximum capacity must be greater than 0';
    }
    const currentOccupancy = parseInt(formData.currentOccupancy) || 0;
    const maxCapacity = parseInt(formData.maxCapacity) || 0;
    if (currentOccupancy > maxCapacity) {
      newErrors.currentOccupancy = 'Current occupancy cannot exceed maximum capacity';
    }
    if (formData.effectiveFrom && formData.effectiveTill) {
      if (new Date(formData.effectiveTill) < new Date(formData.effectiveFrom)) {
        newErrors.effectiveTill = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      const rule: CapacityRule = {
        id: editingRule?.id || generateCapacityRuleId(),
        templeId: formData.templeId,
        location: formData.location.trim(),
        maxCapacity: parseInt(formData.maxCapacity),
        currentOccupancy: parseInt(formData.currentOccupancy) || 0,
        isLocked: formData.isLocked,
        lockedReason: formData.isLocked ? formData.lockedReason : undefined,
        lockedBy: formData.isLocked ? 'Admin' : undefined,
        lockedAt: formData.isLocked ? (editingRule?.lockedAt || now) : undefined,
        effectiveFrom: formData.effectiveFrom || undefined,
        effectiveTill: formData.effectiveTill || undefined,
        status: formData.status,
        createdAt: editingRule?.createdAt || now,
        updatedAt: now,
      };

      saveCapacityRule(rule);
      onClose();
    } catch (error) {
      console.error('Error saving capacity rule:', error);
      alert('Failed to save capacity rule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLockUnlock = () => {
    if (!editingRule) return;

    if (editingRule.isLocked) {
      unlockCapacity(editingRule.id);
    } else {
      if (!lockReason.trim()) {
        setErrors({ lockedReason: 'Please provide a reason for locking capacity' });
        setIsLocking(true);
        return;
      }
      lockCapacity(editingRule.id, lockReason.trim(), 'Admin');
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingRule ? 'Edit Capacity Rule' : 'Add Capacity Rule'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temple Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temple <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.templeId}
            onChange={(e) => handleChange('templeId', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
              errors.templeId ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={!!editingRule}
          >
            <option value="">Select Temple</option>
            {temples.map((temple) => (
              <option key={temple.id} value={temple.id}>
                {temple.deity || temple.name}
              </option>
            ))}
          </select>
          {errors.templeId && <p className="mt-1 text-sm text-red-600">{errors.templeId}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g., Main Hall, Mandap 1, Parking Area"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>

        {/* Capacity Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Capacity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.maxCapacity}
              onChange={(e) => handleChange('maxCapacity', e.target.value)}
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                errors.maxCapacity ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.maxCapacity && <p className="mt-1 text-sm text-red-600">{errors.maxCapacity}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Occupancy
            </label>
            <input
              type="number"
              value={formData.currentOccupancy}
              onChange={(e) => handleChange('currentOccupancy', e.target.value)}
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                errors.currentOccupancy ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.currentOccupancy && <p className="mt-1 text-sm text-red-600">{errors.currentOccupancy}</p>}
          </div>
        </div>

        {/* Effective Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Effective From
            </label>
            <input
              type="date"
              value={formData.effectiveFrom}
              onChange={(e) => handleChange('effectiveFrom', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Effective Till
            </label>
            <input
              type="date"
              value={formData.effectiveTill}
              onChange={(e) => handleChange('effectiveTill', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                errors.effectiveTill ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.effectiveTill && <p className="mt-1 text-sm text-red-600">{errors.effectiveTill}</p>}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Lock/Unlock Section (only for editing) */}
        {editingRule && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Capacity Lock</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {editingRule.isLocked ? 'Capacity is currently locked' : 'Lock capacity to prevent new bookings'}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                editingRule.isLocked 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {editingRule.isLocked ? 'Locked' : 'Unlocked'}
              </span>
            </div>

            {editingRule.isLocked && editingRule.lockedReason && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Reason:</strong> {editingRule.lockedReason}
                </p>
                {editingRule.lockedAt && (
                  <p className="text-xs text-red-600 mt-1">
                    Locked on: {new Date(editingRule.lockedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {!editingRule.isLocked && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lock Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                  placeholder="Enter reason for locking capacity..."
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                    errors.lockedReason ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lockedReason && <p className="mt-1 text-sm text-red-600">{errors.lockedReason}</p>}
              </div>
            )}

            <button
              type="button"
              onClick={handleLockUnlock}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                editingRule.isLocked
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {editingRule.isLocked ? 'Unlock Capacity' : 'Lock Capacity'}
            </button>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-medium"
          >
            {isSubmitting ? 'Saving...' : editingRule ? 'Update Rule' : 'Create Rule'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

