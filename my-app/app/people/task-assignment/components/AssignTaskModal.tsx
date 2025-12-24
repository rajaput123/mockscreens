'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../../../components';
import { colors, spacing, typography, shadows } from '../../../design-system';

interface TaskFormData {
  employeeId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  category: string;
  estimatedHours: string;
  timeBlock: 'morning' | 'afternoon' | 'evening' | 'night';
}

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: TaskFormData) => void;
  employees?: Array<{ id: string; name: string }>;
}

const CATEGORIES = [
  'Operations',
  'Maintenance',
  'Administrative',
  'Customer Service',
  'Event Management',
  'Security',
  'Prasad Management',
  'Other',
];

export default function AssignTaskModal({ isOpen, onClose, onAssign, employees = [] }: AssignTaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    employeeId: '',
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: '',
    estimatedHours: '',
    timeBlock: 'morning',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        employeeId: '',
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        category: '',
        estimatedHours: '',
        timeBlock: 'morning',
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.employeeId) newErrors.employeeId = 'Employee is required';
    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onAssign(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign New Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Selection */}
        <div>
          <label className="block mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Select Employee <span className="text-red-500">*</span>
            </span>
          </label>
          <select
            value={formData.employeeId}
            onChange={(e) => handleChange('employeeId', e.target.value)}
            className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
              errors.employeeId
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-amber-500 focus:border-transparent'
            }`}
          >
            <option value="">Select an employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
          {errors.employeeId && <p className="mt-1 text-xs text-red-500">{errors.employeeId}</p>}
          {employees.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">No employees available. Add employees first.</p>
          )}
        </div>

        {/* Task Details */}
        <div>
          <label className="block mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Task Title <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter task title..."
            className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
              errors.title
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-amber-500 focus:border-transparent'
            }`}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label className="block mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Description <span className="text-red-500">*</span>
            </span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            placeholder="Describe the task in detail..."
            className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all resize-none shadow-sm ${
              errors.description
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-amber-500 focus:border-transparent'
            }`}
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Priority <span className="text-red-500">*</span>
              </span>
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value as TaskFormData['priority'])}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Time Block <span className="text-red-500">*</span>
              </span>
            </label>
            <select
              value={formData.timeBlock}
              onChange={(e) => handleChange('timeBlock', e.target.value as TaskFormData['timeBlock'])}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
            >
              <option value="morning">Morning (6 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
              <option value="evening">Evening (6 PM - 10 PM)</option>
              <option value="night">Night (10 PM - 6 AM)</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Due Date <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.dueDate
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-amber-500 focus:border-transparent'
              }`}
            />
            {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
          </div>

          <div>
            <label className="block mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Category <span className="text-red-500">*</span>
              </span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.category
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-amber-500 focus:border-transparent'
              }`}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat.toLowerCase().replace(/\s+/g, '-')}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>

          <div>
            <label className="block mb-2">
              <span className="text-sm font-semibold text-gray-700">Estimated Hours</span>
            </label>
            <input
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => handleChange('estimatedHours', e.target.value)}
              min="0"
              step="0.5"
              placeholder="e.g., 4"
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-2xl border-2 border-gray-300 text-gray-700 font-medium transition-all hover:bg-gray-50 hover:scale-105 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 rounded-2xl bg-amber-600 text-white font-medium transition-all hover:bg-amber-700 hover:scale-105 shadow-md"
          >
            Assign Task
          </button>
        </div>
      </form>
    </Modal>
  );
}

