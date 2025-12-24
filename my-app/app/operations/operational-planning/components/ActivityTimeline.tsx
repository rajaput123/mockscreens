'use client';

import { Activity } from '../operationalPlanningData';

interface ActivityTimelineProps {
  activities: Activity[];
  onActivityClick?: (activity: Activity) => void;
}

export default function ActivityTimeline({ activities, onActivityClick }: ActivityTimelineProps) {
  const getTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'ritual':
        return '#8b5cf6';
      case 'prasad':
        return '#f97316';
      case 'maintenance':
        return '#3b82f6';
      case 'cleaning':
        return '#a87738';
      case 'security':
        return '#ef4444';
      case 'event':
        return '#ec4899';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return '#a87738';
      case 'in-progress':
        return '#3b82f6';
      case 'delayed':
        return '#ef4444';
      case 'scheduled':
        return '#6b7280';
      default:
        return '#9ca3af';
    }
  };

  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes; // Convert to minutes from midnight
  };

  const sortedActivities = [...activities].sort((a, b) => {
    return parseTime(a.startTime) - parseTime(b.startTime);
  });

  const minTime = sortedActivities.length > 0
    ? parseTime(sortedActivities[0].startTime)
    : 0;
  const maxTime = sortedActivities.length > 0
    ? Math.max(...sortedActivities.map(a => parseTime(a.endTime)))
    : 1440; // 24 hours in minutes

  const getPosition = (timeStr: string) => {
    const minutes = parseTime(timeStr);
    return ((minutes - minTime) / (maxTime - minTime)) * 100;
  };

  const getWidth = (startTime: string, endTime: string) => {
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    return ((end - start) / (maxTime - minTime)) * 100;
  };

  return (
    <div className="w-full bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Activity Timeline</h3>
        <p className="text-sm text-gray-600">Visual timeline of all scheduled activities</p>
      </div>

      {/* Timeline Track */}
      <div className="relative h-64 bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
        {/* Time markers */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: 24 }).map((_, hour) => {
            const position = (hour / 24) * 100;
            return (
              <div
                key={hour}
                className="absolute border-l-2 border-gray-300"
                style={{ left: `${position}%` }}
              >
                {hour % 4 === 0 && (
                  <div className="absolute top-0 left-0 bg-gray-900 bg-opacity-50 px-2 py-1 text-xs text-white">
                    {String(hour).padStart(2, '0')}:00
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Activity bars */}
        {sortedActivities.map((activity) => {
          const typeColor = getTypeColor(activity.type);
          const statusColor = getStatusColor(activity.status);
          const left = getPosition(activity.startTime);
          const width = getWidth(activity.startTime, activity.endTime);

          return (
            <div
              key={activity.id}
              onClick={() => onActivityClick?.(activity)}
              className="absolute cursor-pointer transition-all duration-200 hover:scale-105 z-10 group"
              style={{
                left: `${left}%`,
                top: '20%',
                width: `${width}%`,
                height: '60%',
              }}
            >
              {/* Activity bar */}
              <div
                className="rounded-lg border-2 border-white shadow-lg relative h-full"
                style={{
                  backgroundColor: activity.status === 'completed' ? statusColor : typeColor,
                  opacity: activity.status === 'completed' ? 0.7 : 1,
                }}
              >
                {/* Activity label */}
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <div className="text-white text-xs font-semibold text-center truncate w-full">
                    {activity.name}
                  </div>
                </div>

                {/* Time label */}
                <div className="absolute -bottom-5 left-0 text-xs text-gray-700 whitespace-nowrap">
                  {activity.startTime}
                </div>

                {/* Status indicator */}
                {activity.status === 'in-progress' && (
                  <div className="absolute top-1 right-1">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  </div>
                )}
              </div>

              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 pointer-events-none">
                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap">
                  <div className="font-semibold mb-1">{activity.name}</div>
                  <div className="text-gray-300">{activity.description}</div>
                  <div className="text-gray-300 mt-1">
                    {activity.startTime} - {activity.endTime}
                  </div>
                  <div className="text-gray-300">Location: {activity.location}</div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500"></div>
          <span className="text-gray-600">Ritual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500"></div>
          <span className="text-gray-600">Prasad</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500"></div>
          <span className="text-gray-600">Maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500"></div>
          <span className="text-gray-600">Cleaning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-gray-600">Security</span>
        </div>
      </div>
    </div>
  );
}


