'use client';

import { useState } from 'react';
import { navigationMenus } from '../../components/navigation/navigationData';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import { colors, spacing, typography, shadows } from '../../design-system';
import { ModernCard, ElevatedCard } from '../components';
import AssignTaskModal from './components/AssignTaskModal';

// Mock employees
const mockEmployees = [
  { id: '1', name: 'Arjun Rao' },
  { id: '2', name: 'Meera Iyer' },
  { id: '3', name: 'Karthik Sharma' },
  { id: '4', name: 'Rajesh Kumar' },
  { id: '5', name: 'Priya Sharma' },
];

export default function TaskAssignmentPage() {
  const module = navigationMenus.people.find(m => m.id === 'task-assignment');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  if (!module) {
    return <div>Module not found</div>;
  }

  // Mock data - in real app, this would come from API
  const stats = {
    totalTasks: 24,
    pendingTasks: 8,
    inProgressTasks: 6,
    completedTasks: 10,
    overdueTasks: 2,
    employeesWithTasks: 12,
  };

  const recentTasks = [
    { title: 'Prepare Morning Prasad', employee: 'Rajesh Kumar', status: 'in-progress', dueDate: '2024-01-25' },
    { title: 'Clean Main Hall', employee: 'Priya Sharma', status: 'pending', dueDate: '2024-01-25' },
    { title: 'Setup Sound System', employee: 'Amit Patel', status: 'pending', dueDate: '2024-01-25' },
  ];

  const handleAssign = (data: any) => {
    console.log('Task assigned:', data);
    alert('Task assigned successfully!');
  };

  return (
    <ModuleLayout
      title="Task Assignment"
      description="Assign and manage tasks for employees"
    >
      <ModuleNavigation
        subServices={module.subServices}
        functions={module.functions}
        moduleId={module.id}
        category="people"
      />

      {/* Quick Action Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsAssignModalOpen(true)}
          className="px-6 py-3 rounded-2xl transition-all hover:scale-105"
          style={{
            backgroundColor: colors.primary.base,
            color: '#ffffff',
            fontFamily: typography.body.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: 600,
            boxShadow: shadows.md,
          }}
        >
          + Assign New Task
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <ModernCard elevation="md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100">
                <svg width="20" height="20" fill="none" stroke={colors.primary.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
            <p className="text-xs text-gray-500 mt-1">Active assignments</p>
          </div>
        </ModernCard>

        <ModernCard elevation="md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Pending Tasks</h3>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-100">
                <svg width="20" height="20" fill="none" stroke={colors.warning.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingTasks}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting start</p>
          </div>
        </ModernCard>

        <ModernCard elevation="md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100">
                <svg width="20" height="20" fill="none" stroke={colors.info.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.inProgressTasks}</p>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </div>
        </ModernCard>

        <ModernCard elevation="md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Completed</h3>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100">
                <svg width="20" height="20" fill="none" stroke={colors.success.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.completedTasks}</p>
            <p className="text-xs text-gray-500 mt-1">Finished today</p>
          </div>
        </ModernCard>

        <ModernCard elevation="md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100">
                <svg width="20" height="20" fill="none" stroke={colors.error.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.overdueTasks}</p>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </div>
        </ModernCard>

        <ModernCard elevation="md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Employees with Tasks</h3>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100">
                <svg width="20" height="20" fill="none" stroke={colors.primary.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.employeesWithTasks}</p>
            <p className="text-xs text-gray-500 mt-1">Active employees</p>
          </div>
        </ModernCard>
      </div>

      {/* Recent Tasks & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Tasks */}
        <ElevatedCard elevation="lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
              <a
                href="/people/task-assignment/task-assignment-view"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View All →
              </a>
            </div>
            <div className="space-y-4">
              {recentTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl transition-all hover:scale-[1.02] bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{task.title}</p>
                    <p className="text-xs text-gray-500">Assigned to: {task.employee}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-xl text-xs font-medium mb-1 ${
                        task.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-700'
                          : task.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {task.status}
                    </span>
                    <p className="text-xs text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ElevatedCard>

        {/* Quick Actions */}
        <ElevatedCard elevation="lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              <a
                href="/people/task-assignment/task-assignment-view"
                className="p-4 rounded-2xl transition-all hover:scale-105 text-center bg-gray-50 hover:bg-gray-100"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-amber-100">
                  <svg width="24" height="24" fill="none" stroke={colors.primary.base} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">View All Tasks</p>
              </a>

              <a
                href="/people/task-assignment/employee-tasks"
                className="p-4 rounded-2xl transition-all hover:scale-105 text-center bg-gray-50 hover:bg-gray-100"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-blue-100">
                  <svg width="24" height="24" fill="none" stroke={colors.info.base} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">My Tasks</p>
              </a>
            </div>
          </div>
        </ElevatedCard>
      </div>

      {/* Assign Task Modal */}
      <AssignTaskModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssign}
        employees={mockEmployees}
      />
    </ModuleLayout>
  );
}
