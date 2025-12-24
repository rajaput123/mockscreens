'use client';

import { Project } from './types';

interface ReportsTabProps {
  projects: Project[];
}

export default function ReportsTab({ projects }: ReportsTabProps) {
  const totalTarget = projects.reduce((sum, p) => sum + p.targetAmount, 0);
  const totalCurrent = projects.reduce((sum, p) => sum + p.currentAmount, 0);
  const completedProjects = projects.filter(p => p.status === 'completed');
  const inProgressProjects = projects.filter(p => p.status === 'in-progress');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Target</span>
              <span className="font-semibold text-gray-900">₹{totalTarget.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Collected</span>
              <span className="font-semibold text-gray-900">₹{totalCurrent.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining</span>
              <span className="font-semibold text-gray-900">₹{(totalTarget - totalCurrent).toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Collection Rate</span>
                <span className="font-semibold text-gray-900">
                  {totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Projects</span>
              <span className="font-semibold text-gray-900">{projects.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold text-amber-600">{completedProjects.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Progress</span>
              <span className="font-semibold text-amber-600">{inProgressProjects.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Planning</span>
              <span className="font-semibold text-yellow-600">
                {projects.filter(p => p.status === 'planning').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Progress</span>
              <span className="font-semibold text-gray-900">
                {projects.length > 0
                  ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold text-gray-900">
                {projects.length > 0
                  ? Math.round((completedProjects.length / projects.length) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

