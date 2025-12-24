'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../../../components';
import { getAllFreelancers } from '../../peopleData';
import { loadFreelancers } from '../../utils/dataStorage';

interface ContractFormData {
  freelancerId: string;
  contractType: 'hourly' | 'project' | 'retainer';
  startDate: string;
  endDate: string;
  rate: number;
  description: string;
}

interface CreateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContractFormData) => void;
}

export default function CreateContractModal({ isOpen, onClose, onSubmit }: CreateContractModalProps) {
  const [formData, setFormData] = useState<ContractFormData>({
    freelancerId: '',
    contractType: 'hourly',
    startDate: '',
    endDate: '',
    rate: 0,
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContractFormData, string>>>({});
  const [freelancers, setFreelancers] = useState<any[]>([]);

  // Load freelancers from localStorage on mount
  useEffect(() => {
    const staticFreelancers = getAllFreelancers();
    const loadedFreelancers = loadFreelancers(staticFreelancers);
    setFreelancers(loadedFreelancers);
  }, []);

  const handleChange = (field: keyof ContractFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContractFormData, string>> = {};

    if (!formData.freelancerId) {
      newErrors.freelancerId = 'Freelancer is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (formData.rate <= 0) {
      newErrors.rate = 'Rate must be greater than 0';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      freelancerId: '',
      contractType: 'hourly',
      startDate: '',
      endDate: '',
      rate: 0,
      description: '',
    });
    setErrors({});
  };

  const selectedFreelancer = freelancers.find(f => f.id === formData.freelancerId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Contract" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Freelancer Selection */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Freelancer *
          </label>
          <select
            value={formData.freelancerId}
            onChange={(e) => handleChange('freelancerId', e.target.value)}
            className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm bg-white ${
              errors.freelancerId ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
            }`}
          >
            <option value="">Select Freelancer</option>
            {freelancers.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.freelancerId}) - {f.specialization}
              </option>
            ))}
          </select>
          {errors.freelancerId && (
            <p className="mt-1 text-sm text-red-600">{errors.freelancerId}</p>
          )}
          {/* Selected Freelancer Info */}
          {selectedFreelancer && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{selectedFreelancer.name}</p>
                  <p className="text-xs text-gray-600">{selectedFreelancer.specialization}</p>
                </div>
                <div className="text-right">
                  {selectedFreelancer.hourlyRate && (
                    <p className="text-sm font-medium text-amber-700">₹{selectedFreelancer.hourlyRate}/hr</p>
                  )}
                  <p className="text-xs text-gray-500">ID: {selectedFreelancer.freelancerId}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contract Type */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Contract Type *
          </label>
          <select
            value={formData.contractType}
            onChange={(e) => handleChange('contractType', e.target.value as 'hourly' | 'project' | 'retainer')}
            className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm bg-white"
          >
            <option value="hourly">Hourly</option>
            <option value="project">Project</option>
            <option value="retainer">Retainer</option>
          </select>
        </div>

        {/* Rate */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            {formData.contractType === 'hourly' ? 'Hourly Rate' : 'Amount'} (₹) *
          </label>
          <input
            type="number"
            value={formData.rate || ''}
            onChange={(e) => handleChange('rate', parseFloat(e.target.value) || 0)}
            placeholder={`Enter ${formData.contractType === 'hourly' ? 'hourly rate' : 'amount'}`}
            className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
              errors.rate ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
            }`}
            min="0"
            step="0.01"
          />
          {errors.rate && (
            <p className="mt-1 text-sm text-red-600">{errors.rate}</p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Start Date *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.startDate ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter contract description..."
            rows={4}
            className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
              errors.description ? 'border-red-500' : 'border-gray-300 focus:ring-amber-500'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
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
            Create Contract
          </button>
        </div>
      </form>
    </Modal>
  );
}

