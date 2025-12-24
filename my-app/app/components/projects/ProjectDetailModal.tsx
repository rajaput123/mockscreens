'use client';

import Modal from '../ui/Modal';
import { Project } from './types';
import { getStatusColor, getCategoryColor } from './utils';
import { colors, spacing, typography } from '../../design-system';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export default function ProjectDetailModal({ isOpen, onClose, project }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project.title} size="lg">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-2">Description</p>
          <p className="text-gray-900">{project.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Status</p>
            <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium border ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Category</p>
            <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium border ${getCategoryColor(project.category)}`}>
              {project.category}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Start Date</p>
            <p className="text-gray-900">{new Date(project.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">End Date</p>
            <p className="text-gray-900">{new Date(project.endDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Location</p>
            <p className="text-gray-900">{project.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Coordinator</p>
            <p className="text-gray-900">{project.coordinator}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-amber-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">{project.progress}% complete</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Funding</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Target Amount</span>
              <span className="font-semibold text-gray-900">₹{project.targetAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Amount</span>
              <span className="font-semibold text-gray-900">₹{project.currentAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining</span>
              <span className="font-semibold text-gray-900">
                ₹{(project.targetAmount - project.currentAmount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {project.milestones && project.milestones.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-3">Milestones</p>
            <div className="space-y-2">
              {project.milestones.map((milestone) => (
                <div key={milestone.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{milestone.title}</p>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(milestone.status)}`}>
                      {milestone.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

