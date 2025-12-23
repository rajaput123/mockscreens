'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { colors, spacing, typography } from '../../../design-system';

interface TaskFormData {
  employeeId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  category: string;
  estimatedHours: string;
}

export default function AssignEmployeeTaskPage() {
  const [formData, setFormData] = useState<TaskFormData>({
    employeeId: '',
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: '',
    estimatedHours: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Empty state - no static data
  const employees: Array<{ id: string; name: string }> = [];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Task assigned successfully!');
      // Reset form
      setFormData({
        employeeId: '',
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        category: '',
        estimatedHours: '',
      });
    } catch (error) {
      alert('Error assigning task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModuleLayout
      title="Assign Employee Task"
      description="Assign a task to an employee"
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
          {/* Employee Selection */}
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
                Select Employee *
              </span>
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => handleChange('employeeId', e.target.value)}
              className={`w-full px-4 py-2 rounded-2xl border ${
                errors.employeeId ? 'border-red-500' : ''
              } focus:outline-none focus:ring-2`}
              style={{
                borderColor: errors.employeeId ? colors.error.base : colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              <option value="">Select an employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p className="mt-1 text-sm" style={{ color: colors.error.base }}>
                {errors.employeeId}
              </p>
            )}
            {employees.length === 0 && (
              <p className="mt-2 text-sm" style={{ color: colors.text.muted }}>
                No employees available. Add employees first.
              </p>
            )}
          </div>

          {/* Task Details */}
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
                Task Title *
              </span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-4 py-2 rounded-2xl border ${
                errors.title ? 'border-red-500' : ''
              } focus:outline-none focus:ring-2`}
              style={{
                borderColor: errors.title ? colors.error.base : colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="mt-1 text-sm" style={{ color: colors.error.base }}>
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
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-2 rounded-2xl border ${
                errors.description ? 'border-red-500' : ''
              } focus:outline-none focus:ring-2`}
              style={{
                borderColor: errors.description ? colors.error.base : colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
              placeholder="Describe the task in detail..."
            />
            {errors.description && (
              <p className="mt-1 text-sm" style={{ color: colors.error.base }}>
                {errors.description}
              </p>
            )}
          </div>

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
                  Priority *
                </span>
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value as TaskFormData['priority'])}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                style={{
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
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
                  Due Date *
                </span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className={`w-full px-4 py-2 rounded-2xl border ${
                  errors.dueDate ? 'border-red-500' : ''
                } focus:outline-none focus:ring-2`}
                style={{
                  borderColor: errors.dueDate ? colors.error.base : colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm" style={{ color: colors.error.base }}>
                  {errors.dueDate}
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
                  Category *
                </span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`w-full px-4 py-2 rounded-2xl border ${
                  errors.category ? 'border-red-500' : ''
                } focus:outline-none focus:ring-2`}
                style={{
                  borderColor: errors.category ? colors.error.base : colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              >
                <option value="">Select category</option>
                <option value="operations">Operations</option>
                <option value="maintenance">Maintenance</option>
                <option value="administrative">Administrative</option>
                <option value="customer-service">Customer Service</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm" style={{ color: colors.error.base }}>
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
                  Estimated Hours
                </span>
              </label>
              <input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => handleChange('estimatedHours', e.target.value)}
                min="0"
                step="0.5"
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                style={{
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
                placeholder="e.g., 4"
              />
            </div>
          </div>

          {/* Submit Button */}
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
              {isSubmitting ? 'Assigning...' : 'Assign Task'}
            </button>
          </div>
        </div>
      </form>
    </ModuleLayout>
  );
}
