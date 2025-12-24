'use client';

import { Project } from './types';

interface TimelineTabProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function TimelineTab({ projects, onProjectClick }: TimelineTabProps) {
  const sortedProjects = [...projects].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <div className="space-y-8">
      {sortedProjects.map((project) => (
        <div
          key={project.id}
          onClick={() => onProjectClick(project)}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-4 h-4 bg-amber-600 rounded-full border-4 border-white shadow-lg" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900 font-serif">{project.title}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">Progress: <strong>{project.progress}%</strong></span>
                <span className="text-gray-600">
                  Amount: <strong>₹{project.currentAmount.toLocaleString('en-IN')}</strong> / ₹{project.targetAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

