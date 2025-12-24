'use client';

import { TempleTask, TaskStatus, getTaskTypeLabel, getTaskTypeColor, getStatusLabel, getStatusColor } from '../templeTaskData';
import { colors } from '../../../design-system';

interface TempleTaskCardProps {
  task: TempleTask;
  onClick?: (task: TempleTask) => void;
  onStatusChange?: (newStatus: TaskStatus) => void;
  currentUserRole?: string;
  compact?: boolean;
}

export default function TempleTaskCard({
  task,
  onClick,
  onStatusChange,
  currentUserRole = 'operations-manager',
  compact = false,
}: TempleTaskCardProps) {
  const isOverdue = task.dueDate && task.dueTime && 
    new Date(`${task.dueDate}T${task.dueTime}`) < new Date() && 
    task.status !== 'completed';

  const isDelayed = isOverdue && task.status !== 'completed' && task.status !== 'escalated';
  const isEscalated = task.status === 'escalated';
  const hasBlockers = task.blockedBy.length > 0;

  const statusColor = getStatusColor(task.status);
  const typeColor = getTaskTypeColor(task.type);

  const canChangeStatus = currentUserRole === 'operations-manager' || 
    currentUserRole === 'temple-administrator' ||
    (task.assigneeId && ['ops-staff', 'priest-gurugal', 'kitchen-staff', 'kitchen-manager'].includes(currentUserRole));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return colors.error.base;
      case 'high': return colors.warning.base;
      case 'medium': return colors.info.base;
      case 'low': return colors.success.base;
      default: return colors.gray[400];
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'critical': return colors.error.light;
      case 'high': return colors.warning.light;
      case 'medium': return colors.info.light;
      case 'low': return colors.success.light;
      default: return colors.gray[100];
    }
  };

  if (compact) {
    return (
      <div
        onClick={() => onClick?.(task)}
        className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-all"
        style={{
          borderLeftWidth: '4px',
          borderLeftColor: typeColor,
        }}
      >
        <div className="flex items-start justify-between mb-1">
          <h4 className="font-semibold text-sm text-gray-900 line-clamp-1 flex-1">
            {task.title}
          </h4>
          {isEscalated && (
            <span className="ml-2 text-xs font-bold text-red-600">⚠️</span>
          )}
          {hasBlockers && (
            <span className="ml-2 text-xs font-bold text-orange-600">🔒</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span
            className="px-2 py-0.5 rounded text-white font-medium"
            style={{ backgroundColor: statusColor }}
          >
            {getStatusLabel(task.status)}
          </span>
          {task.assigneeName && (
            <span className="text-gray-500">• {task.assigneeName.split(' ')[0]}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick?.(task)}
      className="bg-white rounded-xl border-2 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-lg relative group"
      style={{
        borderColor: isEscalated ? colors.error.base : 
                    hasBlockers ? colors.warning.base :
                    isDelayed ? colors.warning.base : colors.border,
        borderLeftWidth: '4px',
        borderLeftColor: typeColor,
      }}
    >
      {/* Type indicator bar */}
      <div 
        className="h-1 rounded-t-xl"
        style={{ backgroundColor: typeColor }}
      />

      {/* Task content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                {task.title}
              </h3>
              {isEscalated && (
                <span className="text-red-600 text-xs font-bold animate-pulse">⚠️ ESCALATED</span>
              )}
              {hasBlockers && (
                <span className="text-orange-600 text-xs font-bold">🔒 BLOCKED</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-2 py-0.5 rounded text-xs font-medium text-white"
                style={{ backgroundColor: typeColor }}
              >
                {getTaskTypeLabel(task.type)}
              </span>
              <span
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: getPriorityBg(task.priority),
                  color: getPriorityColor(task.priority),
                }}
              >
                {task.priority.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>

        {/* Timing */}
        <div className="mb-3 space-y-1">
          {task.scheduledTime && (
            <div className="text-xs text-gray-600">
              <span className="font-medium">Scheduled:</span> {task.scheduledTime}
            </div>
          )}
          {task.dueTime && (
            <div className={`text-xs ${isDelayed ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
              <span className="font-medium">Due:</span> {task.dueTime}
              {isDelayed && ' ⚠️ DELAYED'}
            </div>
          )}
        </div>

        {/* Status and Actions */}
        <div className="flex items-center justify-between mb-2">
          {/* Status badge */}
          <span
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: statusColor }}
          >
            {getStatusLabel(task.status)}
          </span>

          {/* Quick status change (if allowed) */}
          {canChangeStatus && onStatusChange && task.status !== 'completed' && (
            <select
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                onStatusChange(e.target.value as TaskStatus);
              }}
              value={task.status}
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="planned">Planned</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              {task.status !== 'escalated' && (
                <option value="escalated">Escalate</option>
              )}
            </select>
          )}
        </div>

        {/* Assignee */}
        <div className="flex items-center justify-between">
          {task.assigneeName ? (
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: typeColor }}
              >
                {task.assigneeAvatar || task.assigneeName.charAt(0)}
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {task.assigneeName}
              </span>
            </div>
          ) : (
            <div className="text-xs text-gray-400 italic">Unassigned</div>
          )}

          {/* Duration */}
          {task.estimatedDuration && (
            <div className="text-xs text-gray-500">
              {task.actualDuration ? (
                <span>{task.actualDuration}m / {task.estimatedDuration}m</span>
              ) : (
                <span>{task.estimatedDuration}m est.</span>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Escalation info */}
        {isEscalated && task.escalationReason && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            <strong>Escalation:</strong> {task.escalationReason}
          </div>
        )}
      </div>
    </div>
  );
}

