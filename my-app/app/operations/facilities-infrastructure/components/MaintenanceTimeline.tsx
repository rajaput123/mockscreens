'use client';

import { MaintenanceTask, getAllMaintenanceTasks } from '../facilitiesData';

interface MaintenanceTimelineProps {
  tasks: MaintenanceTask[];
  daysRange?: number;
  onTaskClick?: (task: MaintenanceTask) => void;
}

export default function MaintenanceTimeline({ 
  tasks, 
  daysRange = 30,
  onTaskClick 
}: MaintenanceTimelineProps) {
  const getPriorityColor = (priority: MaintenanceTask['priority']) => {
    switch (priority) {
      case 'critical':
        return '#dc2626'; // Red
      case 'high':
        return '#f59e0b'; // Amber
      case 'medium':
        return '#eab308'; // Yellow
      case 'low':
        return '#a87738'; // Green
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: MaintenanceTask['status']) => {
    switch (status) {
      case 'completed':
        return '#a87738';
      case 'in-progress':
        return '#3b82f6';
      case 'scheduled':
        return '#f59e0b';
      case 'cancelled':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getTaskPosition = (scheduledDate: string) => {
    const today = new Date();
    const scheduled = new Date(scheduledDate);
    const diffTime = scheduled.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Position as percentage (0 = today, 100 = daysRange days away)
    const position = Math.max(0, Math.min(100, ((diffDays + daysRange / 2) / daysRange) * 100));
    return { position, daysUntil: diffDays };
  };

  const sortedTasks = [...tasks]
    .filter(t => t.status === 'scheduled' || t.status === 'in-progress')
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Maintenance Timeline</h3>
        <p className="text-sm text-gray-600">Scheduled maintenance tasks for the next {daysRange} days</p>
      </div>

      {/* Timeline Track */}
      <div className="relative h-40 bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
        {/* Time markers */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 border-r-2 border-gray-300 relative">
            <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <span className="text-xs text-white font-medium">Today</span>
            </div>
          </div>
          <div className="flex-1 border-r-2 border-gray-300"></div>
          <div className="flex-1 border-r-2 border-gray-300"></div>
          <div className="flex-1">
            <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <span className="text-xs text-white font-medium">{daysRange} days</span>
            </div>
          </div>
        </div>

        {/* Task Nodes */}
        {sortedTasks.map((task) => {
          const { position, daysUntil } = getTaskPosition(task.scheduledDate);
          const priorityColor = getPriorityColor(task.priority);
          const statusColor = getStatusColor(task.status);
          const isOverdue = daysUntil < 0;

          if (Math.abs(daysUntil) > daysRange / 2) return null;

          return (
            <div
              key={task.id}
              onClick={() => onTaskClick?.(task)}
              className="absolute cursor-pointer transition-all duration-200 hover:scale-125 z-10 group"
              style={{
                left: `${position}%`,
                top: '50%',
                transform: `translate(-50%, -50%)`,
              }}
            >
              {/* Task Node */}
              <div
                className="rounded-full border-2 border-white shadow-lg relative"
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: isOverdue ? '#dc2626' : priorityColor,
                  boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
                }}
              >
                {/* Status ring */}
                {task.status === 'in-progress' && (
                  <div
                    className="absolute inset-0 rounded-full border-2 animate-ping"
                    style={{ borderColor: statusColor }}
                  />
                )}
              </div>

              {/* Task Label */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-gray-300">
                    {isOverdue ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days left`}
                  </div>
                  <div className="text-gray-300 capitalize">{task.priority} priority</div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>

              {/* Connection line to timeline */}
              <div
                className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-400"
                style={{ height: '20px' }}
              />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <span className="text-gray-600">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span className="text-gray-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <span className="text-gray-600">Low</span>
        </div>
      </div>
    </div>
  );
}

