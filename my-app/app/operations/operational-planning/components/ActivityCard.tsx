'use client';

import { Activity } from '../operationalPlanningData';

interface ActivityCardProps {
  activity: Activity;
  onClick?: (activity: Activity) => void;
  onDragStart?: (e: React.DragEvent, activity: Activity) => void;
  isDragging?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function ActivityCard({ 
  activity, 
  onClick, 
  onDragStart,
  isDragging,
  size = 'medium' 
}: ActivityCardProps) {
  const typeColors = {
    ritual: 'bg-amber-500 border-purple-600',
    prasad: 'bg-orange-500 border-orange-600',
    maintenance: 'bg-amber-500 border-blue-600',
    cleaning: 'bg-amber-500 border-green-600',
    security: 'bg-red-500 border-red-600',
    event: 'bg-pink-500 border-pink-600',
    other: 'bg-gray-500 border-gray-600',
  };

  const statusColors = {
    scheduled: 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    completed: 'bg-amber-100 text-amber-700',
    delayed: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  const priorityColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-amber-500',
  };

  const sizeClasses = {
    small: 'w-48',
    medium: 'w-64',
    large: 'w-80',
  };

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart?.(e, activity)}
      onClick={() => onClick?.(activity)}
      className={`${sizeClasses[size]} ${typeColors[activity.type]} rounded-xl border-2 shadow-md cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl relative group ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{
        transform: 'perspective(500px) rotateX(2deg)',
        boxShadow: `0 4px 12px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(0,0,0,0.1)`,
      }}
    >
      {/* Priority indicator */}
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${priorityColors[activity.priority]}`} />

      {/* Activity content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-white text-sm flex-1 line-clamp-2">
            {activity.name}
          </h3>
        </div>

        {/* Time */}
        <div className="text-white text-xs mb-2 opacity-90">
          {activity.startTime} - {activity.endTime} ({activity.duration} min)
        </div>

        {/* Location */}
        <div className="text-white text-xs mb-2 opacity-90">
          📍 {activity.location}
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-between mt-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[activity.status]}`}>
            {activity.status.replace('-', ' ')}
          </span>
          {activity.assignedToName && (
            <span className="text-white text-xs opacity-90">
              👤 {activity.assignedToName.split(' ')[0]}
            </span>
          )}
        </div>
      </div>

      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap max-w-xs">
          <div className="font-semibold mb-1">{activity.name}</div>
          <div className="text-gray-300">{activity.description}</div>
          <div className="text-gray-300 mt-1">Type: {activity.type}</div>
          <div className="text-gray-300">Priority: {activity.priority}</div>
          {activity.resources.length > 0 && (
            <div className="text-gray-300">Resources: {activity.resources.slice(0, 3).join(', ')}</div>
          )}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
}


