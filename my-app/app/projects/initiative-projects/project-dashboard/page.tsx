'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import ModuleNavigation from '../../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../../components/navigation/navigationData';
import Link from 'next/link';
import { Project } from '../../../components/projects/types';
import { getStatusColor, getCategoryColor } from '../../../components/projects/utils';

export default function ProjectDashboardPage() {
  const module = navigationMenus.projects.find(m => m.id === 'initiative-projects');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'Temple Renovation Project',
      description: 'Complete renovation of the main temple hall including flooring, lighting, and painting.',
      category: 'Renovation',
      status: 'in-progress',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      targetAmount: 5000000,
      currentAmount: 3200000,
      progress: 64,
      location: 'Main Temple Complex',
      coordinator: 'Rajesh Kumar',
      coordinatorPhone: '+91 9876543210',
      milestones: [],
      createdAt: '2024-01-10',
      updatedAt: '2024-03-20',
    },
    {
      id: '2',
      title: 'Community Health Center',
      description: 'Establish a community health center to provide free medical services.',
      category: 'Healthcare',
      status: 'planning',
      startDate: '2024-04-01',
      endDate: '2024-12-31',
      targetAmount: 10000000,
      currentAmount: 2500000,
      progress: 25,
      location: 'Community Hall',
      coordinator: 'Priya Sharma',
      coordinatorPhone: '+91 9876543211',
      milestones: [],
      createdAt: '2024-02-15',
      updatedAt: '2024-03-18',
    },
    {
      id: '3',
      title: 'Educational Scholarship Program',
      description: 'Provide scholarships to underprivileged students for higher education.',
      category: 'Education',
      status: 'in-progress',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      targetAmount: 2000000,
      currentAmount: 1500000,
      progress: 75,
      location: 'Multiple Locations',
      coordinator: 'Amit Patel',
      coordinatorPhone: '+91 9876543212',
      milestones: [],
      createdAt: '2023-12-01',
      updatedAt: '2024-03-15',
    },
  ]);

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    planning: projects.filter(p => p.status === 'planning').length,
    totalTarget: projects.reduce((sum, p) => sum + p.targetAmount, 0),
    totalCurrent: projects.reduce((sum, p) => sum + p.currentAmount, 0),
    averageProgress: projects.length > 0 
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
      : 0,
  };

  return (
    <ModuleLayout
      title="Project Dashboard"
      description="Overview of all initiatives and projects"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Initiative & Project Management', href: '/projects/initiative-projects' },
        { label: 'Project Dashboard' },
      ]}
      action={
        <Link
          href="/projects/initiative-projects"
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          View All Projects
        </Link>
      }
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="initiative-projects"
        category="projects"
      />

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.inProgress}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50/50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Progress</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageProgress}%</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Funding Summary */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Funding Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Target</p>
              <p className="text-2xl font-bold text-gray-900">₹{(stats.totalTarget / 100000).toFixed(1)}L</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Collected</p>
              <p className="text-2xl font-bold text-green-600">₹{(stats.totalCurrent / 100000).toFixed(1)}L</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-amber-600">₹{((stats.totalTarget - stats.totalCurrent) / 100000).toFixed(1)}L</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-amber-600 to-amber-700 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(stats.totalCurrent / stats.totalTarget) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {Math.round((stats.totalCurrent / stats.totalTarget) * 100)}% of target achieved
            </p>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
              <p className="text-sm text-gray-600 mt-1">Latest initiatives and their progress</p>
            </div>
            <Link
              href="/projects/initiative-projects"
              className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href="/projects/initiative-projects"
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 font-serif flex-1">{project.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-medium border ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(project.category)}`}>
                    {project.category}
                  </span>
                  <span className="text-gray-600">
                    ₹{(project.currentAmount / 100000).toFixed(1)}L / ₹{(project.targetAmount / 100000).toFixed(1)}L
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
