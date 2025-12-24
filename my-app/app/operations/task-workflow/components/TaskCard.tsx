'use client';

import { Task } from '../taskWorkflowData';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  isDragging?: boolean;
}

export default function TaskCard({ task, onClick, onDragStart, isDragging }: TaskCardProps) {
  const priorityColors = {
    critical: 'bg-red-500 border-red-600',
    high: 'bg-orange-500 border-orange-600',
    medium: 'bg-yellow-500 border-yellow-600',
    low: 'bg-amber-500 border-green-600',
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    blocked: 'bg-red-100 text-red-700',
    review: 'bg-amber-100 text-amber-700',
    completed: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, task)}
      onClick={() => onClick?.(task)}
      className={`bg-white rounded-xl border-2 shadow-md cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl relative group ${
        isDragging ? 'opacity-50' : ''
      } ${priorityColors[task.priority]}`}
      style={{
        transform: 'perspective(500px) rotateX(2deg)',
        boxShadow: `0 4px 12px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(0,0,0,0.1)`,
      }}
    >
      {/* Priority indicator bar */}
      <div className={`h-1 ${priorityColors[task.priority]} rounded-t-xl`} />

      {/* Task content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm flex-1 line-clamp-2">
            {task.title}
          </h3>
          {isOverdue && (
            <div className="ml-2 flex-shrink-0">
              <svg className="w-4 h-4 text-red-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>

        {/* Progress bar */}
        {task.status === 'in-progress' && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span className="font-semibold">{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${priorityColors[task.priority]}`}
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Assignee */}
          {task.assigneeName ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {task.assigneeAvatar || task.assigneeName.charAt(0)}
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {task.assigneeName.split(' ')[0]}
              </span>
            </div>
          ) : (
            <div className="text-xs text-gray-400">Unassigned</div>
          )}

          {/* Status badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
            {task.status.replace('-', ' ')}
          </span>
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div className={`mt-2 text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
            {isOverdue ? '⚠️ Overdue' : `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
          </div>
        )}

        {/* Hours */}
        {(task.estimatedHours || task.actualHours) && (
          <div className="mt-1 text-xs text-gray-500">
            {task.actualHours ? (
              <span>{task.actualHours}h / {task.estimatedHours}h</span>
            ) : (
              <span>{task.estimatedHours}h est.</span>
            )}
          </div>
        )}
      </div>

      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap max-w-xs">
          <div className="font-semibold mb-1">{task.title}</div>
          <div className="text-gray-300">{task.description}</div>
          <div className="text-gray-300 mt-1">Priority: {task.priority}</div>
          <div className="text-gray-300">Category: {task.category}</div>
          {task.dependencies.length > 0 && (
            <div className="text-gray-300">Dependencies: {task.dependencies.length}</div>
          )}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
}


