'use client';

import { Project } from './types';
import { getStatusColor, getCategoryColor } from './utils';

interface DashboardTabProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function DashboardTab({ projects, onProjectClick }: DashboardTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onProjectClick(project)}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 font-serif flex-1">{project.title}</h3>
            <span
              className={`px-3 py-1 rounded-xl text-xs font-medium border ${getStatusColor(project.status)}`}
            >
              {project.status}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-gray-900">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(project.category)}`}>
              {project.category}
            </span>
            <span className="text-gray-600">
              ₹{project.currentAmount.toLocaleString('en-IN')} / ₹{project.targetAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

