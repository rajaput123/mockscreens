'use client';

import { Activity } from '../operationalPlanningData';

interface ActivityDetailModalProps {
  activity: Activity | null;
  onClose: () => void;
}

export default function ActivityDetailModal({ activity, onClose }: ActivityDetailModalProps) {
  if (!activity) return null;

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'in-progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'delayed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Activity['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'ritual':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'prasad':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'maintenance':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cleaning':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'security':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'event':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{activity.name}</h2>
            <p className="text-sm text-gray-600">{activity.description}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-3">
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(activity.status)}`}>
              {activity.status.replace('-', ' ').toUpperCase()}
            </span>
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getPriorityColor(activity.priority)}`}>
              {activity.priority.toUpperCase()} PRIORITY
            </span>
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getTypeColor(activity.type)}`}>
              {activity.type.toUpperCase()}
            </span>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Schedule & Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Schedule & Location</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-600">Time</div>
                    <div className="text-base font-semibold text-gray-900">
                      {activity.startTime} - {activity.endTime}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Duration: {activity.duration} minutes</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="text-base font-semibold text-gray-900">{activity.location}</div>
                  </div>
                </div>
                {activity.assignedToName && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <div className="text-sm text-gray-600">Assigned To</div>
                      <div className="text-base font-semibold text-gray-900">{activity.assignedToName}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resources & Dependencies */}
            <div className="space-y-4">
              {activity.resources.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Resources Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {activity.resources.map((resource, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                      >
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {activity.dependencies.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Dependencies</h3>
                  <div className="text-sm text-gray-600">
                    This activity depends on {activity.dependencies.length} other {activity.dependencies.length === 1 ? 'activity' : 'activities'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Description */}
          {activity.description && activity.description.length > 100 && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Full Description</h3>
              <p className="text-gray-700 leading-relaxed">{activity.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

