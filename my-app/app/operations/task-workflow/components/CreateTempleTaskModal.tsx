'use client';

import { useState } from 'react';
import { Modal } from '../../../components';
import {
  TempleTask,
  TaskType,
  TaskFunction,
  TimeBlock,
  TaskPriority,
  TaskStatus,
  UserRole,
  ROLE_PERMISSIONS,
  saveTask,
  addAuditLogEntry,
} from '../templeTaskData';
import { colors, spacing, typography } from '../../../design-system';

interface CreateTempleTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: TempleTask) => void;
  currentUserRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  preselectedType?: TaskType;
  preselectedDate?: string;
  preselectedSevaId?: string;
  preselectedEventId?: string;
}

export default function CreateTempleTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
  currentUserRole,
  currentUserId,
  currentUserName,
  preselectedType,
  preselectedDate,
  preselectedSevaId,
  preselectedEventId,
}: CreateTempleTaskModalProps) {
  const permissions = ROLE_PERMISSIONS[currentUserRole] || ROLE_PERMISSIONS['operations-manager'];
  
  const [formData, setFormData] = useState<Partial<TempleTask>>({
    title: '',
    description: '',
    type: preselectedType || 'exception-emergency',
    function: 'general',
    timeBlock: 'morning',
    priority: 'medium',
    scheduledDate: preselectedDate || new Date().toISOString().split('T')[0],
    scheduledTime: '09:00',
    dueTime: '10:00',
    estimatedDuration: 60,
    slaMinutes: 120,
    tags: [],
    linkedSevaId: preselectedSevaId,
    linkedEventId: preselectedEventId,
  });

  const [tagInput, setTagInput] = useState('');

  // Determine allowed task types based on role
  const allowedTaskTypes: TaskType[] = permissions.taskTypesCanCreate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newTask: TempleTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title!,
      description: formData.description!,
      type: formData.type!,
      function: formData.function!,
      timeBlock: formData.timeBlock!,
      status: 'planned',
      priority: formData.priority!,
      scheduledDate: formData.scheduledDate!,
      scheduledTime: formData.scheduledTime,
      dueTime: formData.dueTime,
      estimatedDuration: formData.estimatedDuration,
      slaMinutes: formData.slaMinutes,
      dependencies: [],
      blockedBy: [],
      tags: formData.tags || [],
      category: formData.type === 'ritual-seva' ? 'ritual' : 'operations',
      linkedSevaId: formData.linkedSevaId,
      linkedEventId: formData.linkedEventId,
      createdDate: new Date().toISOString(),
      createdBy: currentUserId,
      createdByRole: currentUserRole,
      updatedDate: new Date().toISOString(),
      updatedBy: currentUserId,
      auditLog: [
        {
          id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          action: 'created',
          userId: currentUserId,
          userName: currentUserName,
          userRole: currentUserRole,
          details: `Task created manually`,
        },
      ],
    };

    saveTask(newTask);
    onTaskCreated(newTask);
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: preselectedType || 'exception-emergency',
      function: 'general',
      timeBlock: 'morning',
      priority: 'medium',
      scheduledDate: preselectedDate || new Date().toISOString().split('T')[0],
      scheduledTime: '09:00',
      dueTime: '10:00',
      estimatedDuration: 60,
      slaMinutes: 120,
      tags: [],
      linkedSevaId: preselectedSevaId,
      linkedEventId: preselectedEventId,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || [],
    });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Task">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as TaskType })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
            disabled={!!preselectedType}
          >
            {allowedTaskTypes.map(type => (
              <option key={type} value={type}>
                {type === 'daily-routine' && 'Daily Routine'}
                {type === 'ritual-seva' && 'Ritual / Seva'}
                {type === 'event-festival' && 'Event / Festival'}
                {type === 'facility-safety' && 'Facility & Safety'}
                {type === 'exception-emergency' && 'Exception / Emergency'}
              </option>
            ))}
          </select>
          {preselectedType && (
            <p className="text-xs text-gray-500 mt-1">Type is pre-selected and cannot be changed</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
            placeholder="e.g., Prepare Morning Prasad"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            rows={3}
            required
            placeholder="Describe what needs to be done..."
          />
        </div>

        {/* Function and Time Block */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Function
            </label>
            <select
              value={formData.function}
              onChange={(e) => setFormData({ ...formData, function: e.target.value as TaskFunction })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="ritual">Ritual</option>
              <option value="kitchen">Kitchen</option>
              <option value="facility">Facility</option>
              <option value="crowd">Crowd</option>
              <option value="safety">Safety</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Block
            </label>
            <select
              value={formData.timeBlock}
              onChange={(e) => setFormData({ ...formData, timeBlock: e.target.value as TimeBlock })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="morning">Morning (5 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
              <option value="evening">Evening (5 PM - 10 PM)</option>
              <option value="night">Night (10 PM - 5 AM)</option>
            </select>
          </div>
        </div>

        {/* Priority and Scheduled Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scheduled Date
            </label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
        </div>

        {/* Timing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scheduled Time
            </label>
            <input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Time
            </label>
            <input
              type="time"
              value={formData.dueTime}
              onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Duration and SLA */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SLA (minutes)
            </label>
            <input
              type="number"
              value={formData.slaMinutes}
              onChange={(e) => setFormData({ ...formData, slaMinutes: parseInt(e.target.value) || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              min="1"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
}

