'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Project } from '../../components/projects/types';
import StatsCards from '../../components/projects/StatsCards';
import DashboardTab from '../../components/projects/DashboardTab';
import TimelineTab from '../../components/projects/TimelineTab';
import ReportsTab from '../../components/projects/ReportsTab';
import ProjectDetailModal from '../../components/projects/ProjectDetailModal';
import CreateInitiativeModal from '../../components/projects/CreateInitiativeModal';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../components/navigation/navigationData';

function InitiativeProjectsContent() {
  const searchParams = useSearchParams();
  const module = navigationMenus.projects.find(m => m.id === 'initiative-projects');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  const [activeTab, setActiveTab] = useState<'dashboard' | 'timeline' | 'reports'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Handle query parameters
  useEffect(() => {
    if (searchParams?.get('action') === 'create') {
      setShowCreateModal(true);
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('action');
      window.history.replaceState({}, '', url.toString());
    }
    if (searchParams?.get('tab')) {
      const tab = searchParams.get('tab') as 'dashboard' | 'timeline' | 'reports';
      if (['dashboard', 'timeline', 'reports'].includes(tab)) {
        setActiveTab(tab);
        // Clean up URL
        const url = new URL(window.location.href);
        url.searchParams.delete('tab');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [searchParams]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Temple Renovation Project',
      description: 'Complete renovation of the main temple hall including flooring, lighting, and painting. This project aims to restore the temple to its original glory while adding modern amenities.',
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
      milestones: [
        {
          id: 'm1',
          title: 'Planning & Approval',
          description: 'Complete planning and get necessary approvals',
          dueDate: '2024-02-01',
          status: 'completed',
        },
        {
          id: 'm2',
          title: 'Material Procurement',
          description: 'Procure all required materials',
          dueDate: '2024-03-15',
          status: 'completed',
        },
        {
          id: 'm3',
          title: 'Flooring Work',
          description: 'Complete flooring installation',
          dueDate: '2024-04-30',
          status: 'in-progress',
        },
        {
          id: 'm4',
          title: 'Lighting & Electrical',
          description: 'Install new lighting and electrical systems',
          dueDate: '2024-05-15',
          status: 'pending',
        },
        {
          id: 'm5',
          title: 'Painting & Finishing',
          description: 'Complete painting and final touches',
          dueDate: '2024-06-15',
          status: 'pending',
        },
      ],
      media: [
        {
          id: 'p1',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=800&h=600&fit=crop',
          isPrimary: true,
        },
      ],
      createdAt: '2024-01-10',
      updatedAt: '2024-03-20',
    },
    {
      id: '2',
      title: 'Community Health Center',
      description: 'Establish a community health center to provide free medical services to the local community. This initiative will serve thousands of people in need.',
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
      milestones: [
        {
          id: 'm6',
          title: 'Site Selection',
          description: 'Finalize location for health center',
          dueDate: '2024-03-31',
          status: 'completed',
        },
        {
          id: 'm7',
          title: 'Fundraising Campaign',
          description: 'Raise initial funds for construction',
          dueDate: '2024-05-31',
          status: 'in-progress',
        },
        {
          id: 'm8',
          title: 'Construction Start',
          description: 'Begin construction work',
          dueDate: '2024-06-15',
          status: 'pending',
        },
      ],
      media: [
        {
          id: 'p2',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
          isPrimary: true,
        },
      ],
      createdAt: '2024-02-15',
      updatedAt: '2024-03-18',
    },
    {
      id: '3',
      title: 'Educational Scholarship Program',
      description: 'Provide scholarships to underprivileged students for higher education. Supporting 100 students annually with full tuition coverage.',
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
      milestones: [
        {
          id: 'm9',
          title: 'Student Selection',
          description: 'Select eligible students',
          dueDate: '2024-02-28',
          status: 'completed',
        },
        {
          id: 'm10',
          title: 'Fund Disbursement Q1',
          description: 'Disburse first quarter funds',
          dueDate: '2024-03-31',
          status: 'completed',
        },
        {
          id: 'm11',
          title: 'Fund Disbursement Q2',
          description: 'Disburse second quarter funds',
          dueDate: '2024-06-30',
          status: 'pending',
        },
      ],
      media: [
        {
          id: 'p3',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
          isPrimary: true,
        },
      ],
      createdAt: '2023-12-01',
      updatedAt: '2024-03-15',
    },
    {
      id: '4',
      title: 'Parking Facility Expansion',
      description: 'Expand parking facility to accommodate 500 more vehicles. This will help manage the increasing number of devotees visiting the temple.',
      category: 'Infrastructure',
      status: 'completed',
      startDate: '2023-06-01',
      endDate: '2023-12-31',
      targetAmount: 3000000,
      currentAmount: 3000000,
      progress: 100,
      location: 'Temple Premises',
      coordinator: 'Suresh Reddy',
      coordinatorPhone: '+91 9876543213',
      milestones: [
        {
          id: 'm12',
          title: 'Land Acquisition',
          description: 'Acquire additional land',
          dueDate: '2023-07-31',
          status: 'completed',
        },
        {
          id: 'm13',
          title: 'Construction',
          description: 'Complete construction work',
          dueDate: '2023-11-30',
          status: 'completed',
        },
        {
          id: 'm14',
          title: 'Inauguration',
          description: 'Official opening ceremony',
          dueDate: '2023-12-15',
          status: 'completed',
        },
      ],
      media: [
        {
          id: 'p4',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
          isPrimary: true,
        },
      ],
      createdAt: '2023-05-15',
      updatedAt: '2023-12-20',
    },
  ]);

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    planning: projects.filter(p => p.status === 'planning').length,
    totalTarget: projects.reduce((sum, p) => sum + (p.targetAmount || 0), 0),
    totalCurrent: projects.reduce((sum, p) => sum + (p.currentAmount || 0), 0),
    averageProgress: projects.length > 0 
      ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length 
      : 0,
  };

  return (
    <ModuleLayout
      title="Initiative & Project Management"
      description="Manage and organize temple initiatives and projects"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Initiative & Project Management' },
      ]}
      action={
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 group"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="group-hover:rotate-90 transition-transform duration-300">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Initiative
        </button>
      }
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="initiative-projects"
        category="projects"
      />

      <div className="space-y-6">

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 bg-gray-50/50 rounded-t-2xl p-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 font-medium transition-all duration-200 rounded-xl ${
                activeTab === 'dashboard'
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-3 font-medium transition-all duration-200 rounded-xl ${
                activeTab === 'timeline'
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-3 font-medium transition-all duration-200 rounded-xl ${
                activeTab === 'reports'
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Reports
            </button>
          </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <DashboardTab projects={projects} onProjectClick={setSelectedProject} />
        )}

        {activeTab === 'timeline' && (
          <TimelineTab projects={projects} onProjectClick={setSelectedProject} />
        )}

        {activeTab === 'reports' && (
          <ReportsTab 
            projects={projects} 
          />
        )}
      </div>

      {/* Modals */}
      {selectedProject && (
        <ProjectDetailModal isOpen={!!selectedProject} project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      {showCreateModal && (
        <CreateInitiativeModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateProject={(project) => {
            setProjects([...projects, project]);
            setShowCreateModal(false);
          }}
        />
      )}
    </ModuleLayout>
  );
}

export default function InitiativeProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>}>
      <InitiativeProjectsContent />
    </Suspense>
  );
}
