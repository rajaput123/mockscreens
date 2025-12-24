'use client';

import { useState, useEffect, useMemo } from 'react';
import { colors, spacing, typography } from '../../../design-system';
import {
  TempleTask,
  TimeBlock,
  TaskFunction,
  TaskStatus,
  getAllTasks,
  getTasksByTimeBlock,
  getTasksByFunction,
  calculateReadinessMetrics,
  getTimeBlockLabel,
  getFunctionLabel,
  getTaskTypeLabel,
  getTaskTypeColor,
  getStatusLabel,
  getStatusColor,
  getTasksByDate,
} from '../templeTaskData';
import TempleTaskCard from './TempleTaskCard';

interface TempleTaskBoardProps {
  selectedDate?: string; // YYYY-MM-DD format
  onTaskClick?: (task: TempleTask) => void;
  onTaskUpdate?: (task: TempleTask) => void;
  currentUserRole?: string;
}

export default function TempleTaskBoard({
  selectedDate,
  onTaskClick,
  onTaskUpdate,
  currentUserRole = 'operations-manager',
}: TempleTaskBoardProps) {
  const [tasks, setTasks] = useState<TempleTask[]>([]);
  const [groupBy, setGroupBy] = useState<'time-block' | 'function'>('time-block');
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<TimeBlock | 'all'>('all');
  const [selectedFunction, setSelectedFunction] = useState<TaskFunction | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

  const today = selectedDate || new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadTasks();
  }, [today]);

  const loadTasks = () => {
    const allTasks = getTasksByDate(today);
    setTasks(allTasks);
  };

  const timeBlocks: TimeBlock[] = ['morning', 'afternoon', 'evening', 'night'];
  const functions: TaskFunction[] = ['ritual', 'kitchen', 'facility', 'crowd', 'safety', 'general'];

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    if (groupBy === 'time-block' && selectedTimeBlock !== 'all') {
      filtered = filtered.filter(t => t.timeBlock === selectedTimeBlock);
    }

    if (groupBy === 'function' && selectedFunction !== 'all') {
      filtered = filtered.filter(t => t.function === selectedFunction);
    }

    return filtered;
  }, [tasks, groupBy, selectedTimeBlock, selectedFunction, filterStatus]);

  // Group tasks by time block
  const tasksByTimeBlock = useMemo(() => {
    const grouped: Record<TimeBlock, TempleTask[]> = {
      morning: [],
      afternoon: [],
      evening: [],
      night: [],
    };

    filteredTasks.forEach(task => {
      grouped[task.timeBlock].push(task);
    });

    return grouped;
  }, [filteredTasks]);

  // Group tasks by function
  const tasksByFunction = useMemo(() => {
    const grouped: Record<TaskFunction, TempleTask[]> = {
      ritual: [],
      kitchen: [],
      facility: [],
      crowd: [],
      safety: [],
      general: [],
    };

    filteredTasks.forEach(task => {
      grouped[task.function].push(task);
    });

    return grouped;
  }, [filteredTasks]);

  // Calculate readiness metrics for each time block
  const readinessMetrics = useMemo(() => {
    return timeBlocks.map(block => calculateReadinessMetrics(today, block));
  }, [today, tasks]);

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask: TempleTask = {
      ...task,
      status: newStatus,
      updatedDate: new Date().toISOString(),
      updatedBy: 'current-user', // TODO: Get from auth context
      ...(newStatus === 'completed' && {
        completedDate: new Date().toISOString().split('T')[0],
        completedTime: new Date().toTimeString().slice(0, 5),
      }),
    };

    // Add audit log entry
    updatedTask.auditLog.push({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'status-changed',
      userId: 'current-user',
      userName: 'Current User',
      userRole: currentUserRole as any,
      previousValue: task.status,
      newValue: newStatus,
    });

    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    onTaskUpdate?.(updatedTask);
  };

  const getReadinessColor = (percentage: number): string => {
    if (percentage >= 90) return colors.success.base;
    if (percentage >= 70) return colors.warning.base;
    return colors.error.base;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Group by:</label>
            <select
              value={groupBy}
              onChange={(e) => {
                setGroupBy(e.target.value as 'time-block' | 'function');
                setSelectedTimeBlock('all');
                setSelectedFunction('all');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="time-block">Time Block</option>
              <option value="function">Function</option>
            </select>
          </div>

          {groupBy === 'time-block' && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Time Block:</label>
              <select
                value={selectedTimeBlock}
                onChange={(e) => setSelectedTimeBlock(e.target.value as TimeBlock | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All</option>
                {timeBlocks.map(block => (
                  <option key={block} value={block}>
                    {getTimeBlockLabel(block)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {groupBy === 'function' && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Function:</label>
              <select
                value={selectedFunction}
                onChange={(e) => setSelectedFunction(e.target.value as TaskFunction | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All</option>
                {functions.map(func => (
                  <option key={func} value={func}>
                    {getFunctionLabel(func)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All</option>
              <option value="planned">Planned</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-600">
            {filteredTasks.length} tasks
          </div>
        </div>
      </div>

      {/* Readiness Overview (Time Block View) */}
      {groupBy === 'time-block' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {readinessMetrics.map(metric => (
            <div
              key={metric.timeBlock}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  {getTimeBlockLabel(metric.timeBlock).split(' (')[0]}
                </h3>
                <div
                  className="text-2xl font-bold"
                  style={{ color: getReadinessColor(metric.readinessPercentage) }}
                >
                  {metric.readinessPercentage}%
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">{metric.totalTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-medium text-amber-600">{metric.completedTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span>In Progress:</span>
                  <span className="font-medium text-amber-600">{metric.inProgressTasks}</span>
                </div>
                {metric.delayedTasks > 0 && (
                  <div className="flex justify-between">
                    <span>Delayed:</span>
                    <span className="font-medium text-red-600">{metric.delayedTasks}</span>
                  </div>
                )}
                {metric.escalatedTasks > 0 && (
                  <div className="flex justify-between">
                    <span>Escalated:</span>
                    <span className="font-medium text-red-600">{metric.escalatedTasks}</span>
                  </div>
                )}
                {metric.criticalBlockers > 0 && (
                  <div className="flex justify-between">
                    <span>Blockers:</span>
                    <span className="font-medium text-red-600">{metric.criticalBlockers}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Board */}
      {groupBy === 'time-block' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {timeBlocks.map(block => {
            const blockTasks = tasksByTimeBlock[block];
            const metric = readinessMetrics.find(m => m.timeBlock === block);
            
            return (
              <div
                key={block}
                className="bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {getTimeBlockLabel(block).split(' (')[0]}
                    </h3>
                    {metric && (
                      <div
                        className="text-sm font-bold px-2 py-1 rounded"
                        style={{
                          color: getReadinessColor(metric.readinessPercentage),
                          backgroundColor: `${getReadinessColor(metric.readinessPercentage)}20`,
                        }}
                      >
                        {metric.readinessPercentage}%
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {blockTasks.length} tasks
                  </p>
                </div>
                <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {blockTasks.length === 0 ? (
                    <div className="text-center text-sm text-gray-400 py-8">
                      No tasks
                    </div>
                  ) : (
                    blockTasks.map(task => (
                      <TempleTaskCard
                        key={task.id}
                        task={task}
                        onClick={() => onTaskClick?.(task)}
                        onStatusChange={(newStatus) => handleTaskStatusChange(task.id, newStatus)}
                        currentUserRole={currentUserRole}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {functions.map(func => {
            const funcTasks = tasksByFunction[func];
            
            return (
              <div
                key={func}
                className="bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    {getFunctionLabel(func)}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {funcTasks.length} tasks
                  </p>
                </div>
                <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {funcTasks.length === 0 ? (
                    <div className="text-center text-sm text-gray-400 py-8">
                      No tasks
                    </div>
                  ) : (
                    funcTasks.map(task => (
                      <TempleTaskCard
                        key={task.id}
                        task={task}
                        onClick={() => onTaskClick?.(task)}
                        onStatusChange={(newStatus) => handleTaskStatusChange(task.id, newStatus)}
                        currentUserRole={currentUserRole}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

