'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllTasks,
  getTasksByStatus,
  getTasksByPriority,
  getTasksByCategory,
  getOverdueTasks,
  getUpcomingTasks,
  Task,
} from '../taskWorkflowData';

export default function TaskReportsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reportType, setReportType] = useState<'overview' | 'status' | 'priority' | 'category' | 'performance'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allTasks = getAllTasks();
    setTasks(allTasks);
  };

  const pendingTasks = getTasksByStatus('pending');
  const inProgressTasks = getTasksByStatus('in-progress');
  const completedTasks = getTasksByStatus('completed');
  const blockedTasks = getTasksByStatus('blocked');
  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks(7);

  const criticalTasks = getTasksByPriority('critical');
  const highTasks = getTasksByPriority('high');
  const mediumTasks = getTasksByPriority('medium');
  const lowTasks = getTasksByPriority('low');

  const categories = Array.from(new Set(tasks.map(t => t.category)));
  const tasksByCategory = categories.map(cat => ({
    category: cat,
    tasks: getTasksByCategory(cat),
  }));

  const completionRate = tasks.length > 0 
    ? (completedTasks.length / tasks.length) * 100 
    : 0;

  const averageProgress = tasks.length > 0
    ? tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length
    : 0;

  const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const totalActualHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

  return (
    <ModuleLayout
      title="Task Reports"
      description="Analytics and insights for task management"
    >
      {/* Report Type Selector */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setReportType('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              reportType === 'overview'
                ? 'bg-amber-100 text-amber-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setReportType('status')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              reportType === 'status'
                ? 'bg-amber-100 text-amber-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            By Status
          </button>
          <button
            onClick={() => setReportType('priority')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              reportType === 'priority'
                ? 'bg-amber-100 text-amber-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            By Priority
          </button>
          <button
            onClick={() => setReportType('category')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              reportType === 'category'
                ? 'bg-amber-100 text-amber-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => setReportType('performance')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              reportType === 'performance'
                ? 'bg-amber-100 text-amber-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Performance
          </button>
        </div>
      </div>

      {/* Overview Report */}
      {reportType === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-sm font-medium text-gray-600 mb-1">Total Tasks</div>
              <div className="text-2xl font-bold text-amber-600">{tasks.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-sm font-medium text-gray-600 mb-1">Completion Rate</div>
              <div className="text-2xl font-bold text-amber-600">{completionRate.toFixed(1)}%</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-sm font-medium text-gray-600 mb-1">Average Progress</div>
              <div className="text-2xl font-bold text-amber-600">{averageProgress.toFixed(1)}%</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-sm font-medium text-gray-600 mb-1">Overdue</div>
              <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
            <div className="space-y-3">
              {[
                { label: 'Pending', count: pendingTasks.length, color: 'bg-gray-500' },
                { label: 'In Progress', count: inProgressTasks.length, color: 'bg-amber-500' },
                { label: 'Blocked', count: blockedTasks.length, color: 'bg-red-500' },
                { label: 'Review', count: getTasksByStatus('review').length, color: 'bg-amber-500' },
                { label: 'Completed', count: completedTasks.length, color: 'bg-amber-500' },
              ].map((item) => {
                const percentage = tasks.length > 0 ? (item.count / tasks.length) * 100 : 0;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{item.label}</span>
                      <span className="font-semibold text-gray-900">{item.count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${item.color} h-3 rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Status Report */}
      {reportType === 'status' && (
        <div className="space-y-6">
          {[
            { status: 'pending', label: 'Pending Tasks', tasks: pendingTasks },
            { status: 'in-progress', label: 'In Progress Tasks', tasks: inProgressTasks },
            { status: 'blocked', label: 'Blocked Tasks', tasks: blockedTasks },
            { status: 'review', label: 'Review Tasks', tasks: getTasksByStatus('review') },
            { status: 'completed', label: 'Completed Tasks', tasks: completedTasks },
          ].map(({ status, label, tasks: statusTasks }) => (
            <div key={status} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {label} ({statusTasks.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statusTasks.map((task) => (
                  <div key={task.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="font-semibold text-gray-900 mb-1">{task.title}</div>
                    <div className="text-sm text-gray-600 mb-2">{task.description}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize text-gray-500">{task.priority}</span>
                      {task.assigneeName && (
                        <span className="text-gray-600">{task.assigneeName}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Priority Report */}
      {reportType === 'priority' && (
        <div className="space-y-6">
          {[
            { priority: 'critical', label: 'Critical Priority', tasks: criticalTasks, color: 'text-red-600' },
            { priority: 'high', label: 'High Priority', tasks: highTasks, color: 'text-orange-600' },
            { priority: 'medium', label: 'Medium Priority', tasks: mediumTasks, color: 'text-yellow-600' },
            { priority: 'low', label: 'Low Priority', tasks: lowTasks, color: 'text-amber-600' },
          ].map(({ priority, label, tasks: priorityTasks, color }) => (
            <div key={priority} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className={`text-lg font-semibold ${color} mb-4`}>
                {label} ({priorityTasks.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {priorityTasks.map((task) => (
                  <div key={task.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="font-semibold text-gray-900 mb-1">{task.title}</div>
                    <div className="text-sm text-gray-600 mb-2">{task.description}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize text-gray-500">{task.status}</span>
                      {task.dueDate && (
                        <span className="text-gray-600">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Report */}
      {reportType === 'category' && (
        <div className="space-y-6">
          {tasksByCategory.map(({ category, tasks: categoryTasks }) => (
            <div key={category} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryTasks.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTasks.map((task) => (
                  <div key={task.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="font-semibold text-gray-900 mb-1">{task.title}</div>
                    <div className="text-sm text-gray-600 mb-2">{task.description}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize text-gray-500">{task.status}</span>
                      <span className="capitalize text-gray-500">{task.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Performance Report */}
      {reportType === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Estimated Hours:</span>
                  <span className="font-semibold text-gray-900">{totalEstimatedHours.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Actual Hours:</span>
                  <span className="font-semibold text-gray-900">{totalActualHours.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efficiency:</span>
                  <span className={`font-semibold ${
                    totalEstimatedHours > 0 && totalActualHours / totalEstimatedHours <= 1
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`}>
                    {totalEstimatedHours > 0
                      ? ((totalEstimatedHours / totalActualHours) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Health</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Overdue Tasks:</span>
                  <span className="font-semibold text-red-600">{overdueTasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Blocked Tasks:</span>
                  <span className="font-semibold text-red-600">{blockedTasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upcoming Tasks:</span>
                  <span className="font-semibold text-amber-600">{upcomingTasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion Rate:</span>
                  <span className="font-semibold text-amber-600">{completionRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <HelpButton module="task-workflow" />
    </ModuleLayout>
  );
}
