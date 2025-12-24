'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DonationFormModal from '../../components/donations/DonationFormModal';
import { Project } from '../../components/projects/types';
import { getStatusColor, getCategoryColor } from '../../components/projects/utils';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../components/navigation/navigationData';

interface Donation {
  id: string;
  projectId: string;
  donorName: string;
  amount: number;
  paymentMethod: 'cash' | 'online' | 'cheque' | 'bank_transfer';
  date: string;
  time: string;
  receiptNumber?: string;
  notes?: string;
  status: 'completed' | 'pending' | 'failed';
}

function InitiativeDonationsContent() {
  const searchParams = useSearchParams();
  const module = navigationMenus.projects.find(m => m.id === 'initiative-donations');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'donations'>('overview');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  // Handle query parameters
  useEffect(() => {
    if (searchParams?.get('action') === 'record') {
      setShowDonationModal(true);
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('action');
      window.history.replaceState({}, '', url.toString());
    }
    if (searchParams?.get('tab') === 'donations') {
      setViewMode('donations');
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('tab');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: 'd1',
      projectId: '1',
      donorName: 'Rajesh Kumar',
      amount: 50000,
      paymentMethod: 'online',
      date: '2024-03-05',
      time: '10:30 AM',
      receiptNumber: 'REC-PROJ-2024-001',
      status: 'completed',
    },
    {
      id: 'd2',
      projectId: '1',
      donorName: 'Priya Sharma',
      amount: 25000,
      paymentMethod: 'cash',
      date: '2024-03-06',
      time: '02:15 PM',
      receiptNumber: 'REC-PROJ-2024-002',
      status: 'completed',
    },
    {
      id: 'd3',
      projectId: '2',
      donorName: 'Amit Patel',
      amount: 100000,
      paymentMethod: 'bank_transfer',
      date: '2024-03-08',
      time: '09:00 AM',
      receiptNumber: 'REC-PROJ-2024-003',
      notes: 'For Community Health Center',
      status: 'completed',
    },
  ]);

  // Sample projects data
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
      media: [
        {
          id: 'p1',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=800&h=600&fit=crop',
          isPrimary: true,
        },
      ],
      milestones: [],
      createdAt: '2024-01-10',
      updatedAt: '2024-03-20',
    },
    {
      id: '2',
      title: 'Community Health Center',
      description: 'Establish a community health center to provide free medical services to the local community.',
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
      media: [
        {
          id: 'p2',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
          isPrimary: true,
        },
      ],
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
      media: [
        {
          id: 'p3',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
          isPrimary: true,
        },
      ],
      milestones: [],
      createdAt: '2023-12-01',
      updatedAt: '2024-03-15',
    },
  ]);

  const handleDonationSubmit = (donationData: {
    eventId: string;
    donorName: string;
    amount: number;
    paymentMethod: 'cash' | 'online' | 'cheque' | 'bank_transfer';
    date: string;
    time: string;
    receiptNumber?: string;
    notes?: string;
  }) => {
    const newDonation: Donation = {
      id: `d${Date.now()}`,
      projectId: donationData.eventId, // Using eventId field from modal but treating as projectId
      donorName: donationData.donorName,
      amount: donationData.amount,
      paymentMethod: donationData.paymentMethod,
      date: donationData.date,
      time: donationData.time,
      receiptNumber: donationData.receiptNumber || `REC-PROJ-2024-${String(donations.length + 1).padStart(3, '0')}`,
      notes: donationData.notes,
      status: 'completed',
    };
    setDonations([...donations, newDonation]);
  };

  const getProjectDonations = (projectId: string) => {
    return donations.filter(d => d.projectId === projectId);
  };

  const getTotalDonations = (projectId: string) => {
    return getProjectDonations(projectId).reduce((sum, d) => sum + d.amount, 0);
  };

  const getAllDonationsTotal = () => {
    return donations.reduce((sum, d) => sum + d.amount, 0);
  };

  const getPaymentMethodColor = (method: Donation['paymentMethod']) => {
    switch (method) {
      case 'online':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cash':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cheque':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'bank_transfer':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const stats = {
    totalDonations: getAllDonationsTotal(),
    totalDonors: new Set(donations.map(d => d.donorName)).size,
    totalProjects: projects.length,
    averageDonation: donations.length > 0 ? getAllDonationsTotal() / donations.length : 0,
  };

  return (
    <ModuleLayout
      title="Initiative Donations"
      description="View and manage donations for temple initiatives and projects"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Initiative Donations' },
      ]}
      action={
        <button
          onClick={() => {
            setSelectedProject(null);
            setShowDonationModal(true);
          }}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 group"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="group-hover:rotate-90 transition-transform duration-300">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Record Donation
        </button>
      }
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="initiative-donations"
        category="projects"
      />

      <div className="space-y-6">

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 bg-gray-50/50 rounded-t-2xl p-1">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-6 py-3 font-medium transition-all duration-200 rounded-xl ${
                viewMode === 'overview'
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('donations')}
              className={`px-6 py-3 font-medium transition-all duration-200 rounded-xl ${
                viewMode === 'donations'
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              All Donations
            </button>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalDonations.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Donors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDonors}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50/50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProjects}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg. Donation</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{Math.round(stats.averageDonation).toLocaleString('en-IN')}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {viewMode === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects with Donations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                  const projectDonations = getProjectDonations(project.id);
                  const totalAmount = getTotalDonations(project.id);
                  const primaryMedia = project.media?.find(m => m.isPrimary) || project.media?.[0];

                  return (
                    <div
                      key={project.id}
                      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                    >
                      {/* Project Image */}
                      {primaryMedia && (
                        <div className="relative h-48 overflow-hidden bg-gray-200">
                          <img
                            src={primaryMedia.url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute bottom-3 left-3">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm shadow-md ${getStatusColor(
                                project.status
                              )}`}
                            >
                              {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Project Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{project.description}</p>

                        {/* Donation Stats */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Total Donations</span>
                            <span className="text-lg font-bold text-amber-600">₹{totalAmount.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Donations Count</span>
                            <span className="text-sm font-semibold text-gray-900">{projectDonations.length}</span>
                          </div>
                          {project.targetAmount && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">Target Amount</span>
                              <span className="text-sm font-semibold text-gray-900">₹{(project.targetAmount / 100000).toFixed(1)}L</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="line-clamp-1">{project.location}</span>
                          </div>
                        </div>

                        {projectDonations.length > 0 ? (
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                                setViewMode('donations');
                              }}
                              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                            >
                              View All ({projectDonations.length})
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project);
                              setShowDonationModal(true);
                            }}
                            className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Record First Donation
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* All Donations Tab */}
        {viewMode === 'donations' && (
          <div className="space-y-6">
            {selectedProject && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedProject.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedProject.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedProject ? `${selectedProject.title} - Donations` : 'All Donations'}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Donor</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Receipt</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(selectedProject
                      ? getProjectDonations(selectedProject.id)
                      : donations
                    ).map((donation) => {
                      const project = projects.find(p => p.id === donation.projectId);
                      return (
                        <tr
                          key={donation.id}
                          className="hover:bg-amber-50/50 transition-colors duration-200 cursor-pointer"
                          onClick={() => setSelectedDonation(donation)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                            {project && (
                              <div className="text-xs text-gray-500 mt-1">{project.title}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-amber-600">₹{donation.amount.toLocaleString('en-IN')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentMethodColor(
                                donation.paymentMethod
                              )}`}
                            >
                              {donation.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(donation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            <div className="text-xs text-gray-500">{donation.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{donation.receiptNumber || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                donation.status === 'completed'
                                  ? 'bg-amber-100 text-amber-700'
                                  : donation.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDonation(donation);
                              }}
                              className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-1.5"
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Donation Detail Modal */}
      {selectedDonation && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fade-in_0.3s_cubic-bezier(0.4,0,0.2,1)] overflow-y-auto"
          onClick={() => setSelectedDonation(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-[scale-in_0.3s_cubic-bezier(0.4,0,0.2,1)] my-8 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-white to-gray-50/50 border-b border-gray-200 px-6 py-5 flex items-center justify-between rounded-t-3xl z-10 backdrop-blur-sm">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 font-serif">Donation Details</h2>
                <p className="text-sm text-gray-600 mt-1">Receipt #{selectedDonation.receiptNumber || 'N/A'}</p>
              </div>
              <button
                onClick={() => setSelectedDonation(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl p-2 transition-all duration-200 hover:scale-110"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200">
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-600 mb-2">₹{selectedDonation.amount.toLocaleString('en-IN')}</div>
                  <div className="text-sm text-gray-600">Donation Amount</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Information */}
                {(() => {
                  const project = projects.find(p => p.id === selectedDonation.projectId);
                  return project ? (
                    <div className="md:col-span-2 flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Project</p>
                        <p className="text-gray-900 font-semibold">{project.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{project.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                          <span>{project.location}</span>
                          {project.coordinator && (
                            <>
                              <span>•</span>
                              <span>{project.coordinator}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Donor Name</p>
                    <p className="text-gray-900 font-medium">{selectedDonation.donorName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border mt-1 ${getPaymentMethodColor(
                        selectedDonation.paymentMethod
                      )}`}
                    >
                      {selectedDonation.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date & Time</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedDonation.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-gray-600 text-sm">{selectedDonation.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Receipt Number</p>
                    <p className="text-gray-900 font-medium">{selectedDonation.receiptNumber || 'Not Generated'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                        selectedDonation.status === 'completed'
                          ? 'bg-amber-100 text-amber-700'
                          : selectedDonation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {selectedDonation.status.charAt(0).toUpperCase() + selectedDonation.status.slice(1)}
                    </span>
                  </div>
                </div>

                {selectedDonation.notes && (
                  <div className="md:col-span-2 flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10m-7 4h7M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
                      <p className="text-gray-600 bg-gray-50 rounded-xl p-4">{selectedDonation.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 hover:scale-105"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Donation Modal */}
      <DonationFormModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onSubmit={handleDonationSubmit}
        events={projects.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          date: p.startDate,
          time: '12:00 PM',
          location: p.location,
          status: p.status === 'in-progress' ? 'ongoing' : p.status === 'completed' ? 'completed' : 'upcoming',
          category: p.category,
        }))}
      />
    </ModuleLayout>
  );
}

export default function InitiativeDonationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>}>
      <InitiativeDonationsContent />
    </Suspense>
  );
}

