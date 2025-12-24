'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../components/layout/ModuleLayout';
import HelpButton from '../../components/help/HelpButton';
import Link from 'next/link';
import {
  getAllTasks,
  getAllWorkflows,
  getTasksByStatus,
  getOverdueTasks,
  getUpcomingTasks,
  getBlockedTasks,
  Task,
  Workflow,
} from './taskWorkflowData';
import TaskTimeline from './components/TaskTimeline';
import TaskDependencyGraph from './components/TaskDependencyGraph';
import TaskCard from './components/TaskCard';

export default function TaskWorkflowDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewType, setViewType] = useState<'timeline' | 'dependencies'>('timeline');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allTasks = getAllTasks();
    const allWorkflows = getAllWorkflows();
    setTasks(allTasks);
    setWorkflows(allWorkflows);
  };

  const pendingTasks = getTasksByStatus('pending');
  const inProgressTasks = getTasksByStatus('in-progress');
  const completedTasks = getTasksByStatus('completed');
  const blockedTasks = getBlockedTasks();
  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks(7);

  const stats = {
    total: tasks.length,
    pending: pendingTasks.length,
    inProgress: inProgressTasks.length,
    completed: completedTasks.length,
    blocked: blockedTasks.length,
    overdue: overdueTasks.length,
    upcoming: upcomingTasks.length,
  };

  return (
    <ModuleLayout
      title="Task & Workflow Orchestration"
      description="Manage tasks, workflows, and track progress across all operations"
    >
      {/* View Buttons */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">View</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/operations/task-workflow/task-board"
            className="px-6 py-3 rounded-2xl font-sans text-base font-medium transition-all duration-200 transform hover:scale-105 no-underline border-2 border-purple-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
          >
            Task Board
          </Link>
          <Link
            href="/operations/task-workflow/workflow-view"
            className="px-6 py-3 rounded-2xl font-sans text-base font-medium transition-all duration-200 transform hover:scale-105 no-underline border-2 border-purple-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
          >
            Workflow View
          </Link>
          <Link
            href="/operations/task-workflow/task-reports"
            className="px-6 py-3 rounded-2xl font-sans text-base font-medium transition-all duration-200 transform hover:scale-105 no-underline border-2 border-purple-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
          >
            Task Reports
          </Link>
        </div>
      </div>

      {/* Manage Buttons */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Manage</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/operations/task-workflow/create-task"
            className="bg-amber-600 text-white px-6 py-3 rounded-2xl font-sans text-base font-medium hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 no-underline"
          >
            Create Task
          </Link>
          <Link
            href="/operations/task-workflow/assign-task"
            className="border-2 border-purple-600 text-amber-600 px-6 py-3 rounded-2xl font-sans text-base font-medium hover:bg-amber-50 transition-all duration-200 transform hover:scale-105 no-underline"
          >
            Assign Task
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-purple-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
          <h3 className="font-serif text-xl font-medium mb-2 text-gray-900 group-hover:text-amber-600 transition-colors duration-200">
            Total Tasks
          </h3>
          <p className="font-sans text-3xl font-semibold text-amber-600 transform group-hover:scale-110 transition-transform duration-200 inline-block">
            {stats.total}
          </p>
          <p className="text-sm text-gray-600 mt-1">{stats.inProgress} in progress</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
          <h3 className="font-serif text-xl font-medium mb-2 text-gray-900 group-hover:text-amber-600 transition-colors duration-200">
            In Progress
          </h3>
          <p className="font-sans text-3xl font-semibold text-amber-600 transform group-hover:scale-110 transition-transform duration-200 inline-block">
            {stats.inProgress}
          </p>
          <p className="text-sm text-gray-600 mt-1">{stats.pending} pending</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-green-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
          <h3 className="font-serif text-xl font-medium mb-2 text-gray-900 group-hover:text-amber-600 transition-colors duration-200">
            Completed
          </h3>
          <p className="font-sans text-3xl font-semibold text-amber-600 transform group-hover:scale-110 transition-transform duration-200 inline-block">
            {stats.completed}
          </p>
          <p className="text-sm text-gray-600 mt-1">{stats.upcoming} upcoming</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-red-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
          <h3 className="font-serif text-xl font-medium mb-2 text-gray-900 group-hover:text-red-600 transition-colors duration-200">
            Issues
          </h3>
          <p className="font-sans text-3xl font-semibold text-red-600 transform group-hover:scale-110 transition-transform duration-200 inline-block">
            {stats.blocked + stats.overdue}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {stats.blocked} blocked • {stats.overdue} overdue
          </p>
        </div>
      </div>

      {/* Alerts */}
      {overdueTasks.length > 0 && (
        <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-sm font-semibold text-red-900">Overdue Tasks</h3>
            </div>
          </div>
          <div className="space-y-2">
            {overdueTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="p-2 bg-white border border-red-200 rounded">
                <div className="font-medium text-sm text-red-900">{task.title}</div>
                <div className="text-xs text-red-700">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {blockedTasks.length > 0 && (
        <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-sm font-semibold text-amber-900">Blocked Tasks</h3>
            </div>
          </div>
          <div className="space-y-2">
            {blockedTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="p-2 bg-white border border-amber-200 rounded">
                <div className="font-medium text-sm text-amber-900">{task.title}</div>
                <div className="text-xs text-amber-700">
                  Blocked by {task.blockedBy.length} task(s)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewType('timeline')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              viewType === 'timeline'
                ? 'bg-amber-100 text-amber-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Timeline View
          </button>
          <button
            onClick={() => setViewType('dependencies')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              viewType === 'dependencies'
                ? 'bg-amber-100 text-amber-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Dependency Graph
          </button>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="mb-6">
        {viewType === 'timeline' && (
          <TaskTimeline
            tasks={tasks}
            daysRange={14}
            onTaskClick={setSelectedTask}
          />
        )}
        {viewType === 'dependencies' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Task Dependency Graph</h3>
              <p className="text-sm text-gray-600">Visualize task dependencies and relationships</p>
            </div>
            <div className="h-[600px]">
              <TaskDependencyGraph
                tasks={tasks}
                selectedTaskId={selectedTask?.id}
                onTaskClick={setSelectedTask}
              />
            </div>
          </div>
        )}
      </div>

      {/* Selected Task Details */}
      {selectedTask && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{selectedTask.title}</h3>
            <button
              onClick={() => setSelectedTask(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Task Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold capitalize ${
                      selectedTask.status === 'completed' ? 'text-amber-600' :
                      selectedTask.status === 'in-progress' ? 'text-amber-600' :
                      selectedTask.status === 'blocked' ? 'text-red-600' :
                      selectedTask.status === 'review' ? 'text-amber-600' : 'text-gray-600'
                    }`}>
                      {selectedTask.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className="font-semibold text-gray-900 capitalize">{selectedTask.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold text-gray-900 capitalize">{selectedTask.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-semibold text-gray-900">{selectedTask.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Assignment</h4>
                <div className="space-y-2 text-sm">
                  {selectedTask.assigneeName ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {selectedTask.assigneeAvatar || selectedTask.assigneeName.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-900">{selectedTask.assigneeName}</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-500">Unassigned</span>
                  )}
                  {selectedTask.dueDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(selectedTask.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {selectedTask.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Task Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.slice(0, 6).map((task) => (
          <div
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedTask?.id === task.id ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <TaskCard task={task} />
          </div>
        ))}
      </div>

      <HelpButton module="task-workflow" />
    </ModuleLayout>
  );
}
