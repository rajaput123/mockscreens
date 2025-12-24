'use client';

import { Task, getAllTasks } from '../taskWorkflowData';

interface TaskTimelineProps {
  tasks: Task[];
  daysRange?: number;
  onTaskClick?: (task: Task) => void;
}

export default function TaskTimeline({ 
  tasks, 
  daysRange = 14,
  onTaskClick 
}: TaskTimelineProps) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#eab308';
      case 'low':
        return '#a87738';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return '#a87738';
      case 'in-progress':
        return '#3b82f6';
      case 'blocked':
        return '#dc2626';
      case 'review':
        return '#8b5cf6';
      case 'pending':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getTaskPosition = (task: Task) => {
    if (!task.dueDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Position as percentage (0 = today, 100 = daysRange days away)
    const position = Math.max(0, Math.min(100, ((diffDays + daysRange / 2) / daysRange) * 100));
    
    return { position, daysUntil: diffDays, isOverdue: diffDays < 0 };
  };

  const sortedTasks = [...tasks]
    .filter(t => t.dueDate && t.status !== 'cancelled')
    .sort((a, b) => {
      const aPos = getTaskPosition(a);
      const bPos = getTaskPosition(b);
      if (!aPos || !bPos) return 0;
      return aPos.daysUntil - bPos.daysUntil;
    });

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - Math.floor(daysRange / 2));
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + Math.ceil(daysRange / 2));

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Task Timeline</h3>
        <p className="text-sm text-gray-600">Task due dates for the next {daysRange} days</p>
      </div>

      {/* Timeline Track */}
      <div className="relative h-48 bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
        {/* Time markers */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: daysRange + 1 }).map((_, index) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + index);
            const isToday = date.toDateString() === today.toDateString();
            const position = (index / daysRange) * 100;

            return (
              <div
                key={index}
                className="relative border-r-2 border-gray-300"
                style={{ flex: 1 }}
              >
                {isToday && (
                  <div className="absolute top-0 left-0 right-0 h-8 bg-amber-600 bg-opacity-80 flex items-center justify-center">
                    <span className="text-xs text-white font-medium">Today</span>
                  </div>
                )}
                {index % 2 === 0 && !isToday && (
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-500">
                      {date.getDate()}/{date.getMonth() + 1}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Task Bars */}
        {sortedTasks.map((task) => {
          const position = getTaskPosition(task);
          if (!position || Math.abs(position.daysUntil) > daysRange / 2) return null;

          const priorityColor = getPriorityColor(task.priority);
          const statusColor = getStatusColor(task.status);
          const isOverdue = position.isOverdue;
          const barWidth = task.estimatedHours ? Math.max(20, task.estimatedHours * 10) : 40;
          const barHeight = task.priority === 'critical' ? 24 : task.priority === 'high' ? 20 : 16;

          return (
            <div
              key={task.id}
              onClick={() => onTaskClick?.(task)}
              className="absolute cursor-pointer transition-all duration-200 hover:scale-110 z-10 group"
              style={{
                left: `${position.position}%`,
                top: `${50 + (task.priority === 'critical' ? -20 : task.priority === 'high' ? 0 : 20)}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Task Bar */}
              <div
                className="rounded-lg border-2 border-white shadow-lg relative"
                style={{
                  width: `${barWidth}px`,
                  height: `${barHeight}px`,
                  backgroundColor: isOverdue ? '#dc2626' : priorityColor,
                  boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
                }}
              >
                {/* Progress indicator */}
                {task.status === 'in-progress' && (
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      backgroundColor: statusColor,
                      width: `${task.progress}%`,
                    }}
                  />
                )}

                {/* Status indicator */}
                {task.status === 'blocked' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Task Label */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-gray-300">
                    {isOverdue ? `${Math.abs(position.daysUntil)} days overdue` : `${position.daysUntil} days left`}
                  </div>
                  <div className="text-gray-300 capitalize">{task.priority} priority</div>
                  <div className="text-gray-300 capitalize">{task.status}</div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>

              {/* Connection line to timeline */}
              <div
                className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-400"
                style={{ height: '15px' }}
              />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-gray-600">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500"></div>
          <span className="text-gray-600">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500"></div>
          <span className="text-gray-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500"></div>
          <span className="text-gray-600">Low</span>
        </div>
      </div>
    </div>
  );
}


