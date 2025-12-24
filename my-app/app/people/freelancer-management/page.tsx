'use client';

import { useEffect, useState } from 'react';
import { navigationMenus } from '../../components/navigation/navigationData';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import HelpButton from '../../components/help/HelpButton';
import { ModernCard, ElevatedCard } from '../components';
import { getAllFreelancers, getAllContracts } from '../peopleData';
import { loadContracts, loadFreelancers } from '../utils/dataStorage';

export default function FreelancerManagementPage() {
  const module = navigationMenus.people.find(m => m.id === 'freelancer-management');
  const [contracts, setContracts] = useState<any[]>([]);
  
  if (!module) {
    return <div>Module not found</div>;
  }

  useEffect(() => {
    const staticContracts = getAllContracts();
    const loadedContracts = loadContracts(staticContracts);
    setContracts(loadedContracts);
  }, []);

  const [freelancers, setFreelancers] = useState<any[]>([]);

  useEffect(() => {
    const staticFreelancers = getAllFreelancers();
    const loadedFreelancers = loadFreelancers(staticFreelancers);
    setFreelancers(loadedFreelancers);
  }, []);

  const activeFreelancers = freelancers.filter(f => f.status === 'active' || f.status === 'on-contract');
  const activeContracts = contracts.filter(c => c.status === 'active');
  const completedContracts = contracts.filter(c => c.status === 'completed');
  const uniqueSpecializations = new Set(freelancers.map(f => f.specialization)).size;

  return (
    <ModuleLayout
      title="Freelancer Management"
      description="Manage freelancers, contracts, and work logs"
    >
      <ModuleNavigation
        subServices={module.subServices}
        functions={module.functions}
        moduleId={module.id}
        category="people"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ModernCard elevation="lg" className="p-6 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Freelancers</p>
              <p className="text-3xl font-bold text-gray-900">{freelancers.length}</p>
              <p className="text-xs text-gray-500 mt-2">{activeFreelancers.length} active</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </ModernCard>

        <ModernCard elevation="lg" className="p-6 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Contracts</p>
              <p className="text-3xl font-bold text-gray-900">{activeContracts.length}</p>
              <p className="text-xs text-gray-500 mt-2">{contracts.length} total contracts</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </ModernCard>

        <ModernCard elevation="lg" className="p-6 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed Contracts</p>
              <p className="text-3xl font-bold text-gray-900">{completedContracts.length}</p>
              <p className="text-xs text-gray-500 mt-2">Successfully completed</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </ModernCard>

        <ModernCard elevation="lg" className="p-6 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Specializations</p>
              <p className="text-3xl font-bold text-gray-900">{uniqueSpecializations}</p>
              <p className="text-xs text-gray-500 mt-2">Unique specializations</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Recent Freelancers */}
      <ElevatedCard elevation="lg" className="mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Freelancers</h2>
            <a href="/people/freelancer-management/freelancer-directory" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freelancers.slice(0, 6).map((freelancer) => (
              <div
                key={freelancer.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{freelancer.name}</h3>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    freelancer.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : freelancer.status === 'on-contract'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {freelancer.status === 'on-contract' ? 'On Contract' : freelancer.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">ID: {freelancer.freelancerId}</p>
                <p className="text-xs text-gray-600 mb-2">{freelancer.specialization}</p>
                <div className="flex items-center justify-between">
                  {freelancer.hourlyRate && (
                    <span className="text-xs text-gray-600">₹{freelancer.hourlyRate}/hr</span>
                  )}
                  {freelancer.totalProjects !== undefined && (
                    <span className="text-xs text-amber-600">{freelancer.totalProjects} projects</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ElevatedCard>

      {/* Quick Actions */}
      <ElevatedCard elevation="lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/people/freelancer-management/add-freelancer"
              className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add Freelancer</h3>
                  <p className="text-xs text-gray-600">Add new freelancer</p>
                </div>
              </div>
            </a>
            <a
              href="/people/freelancer-management/create-contract"
              className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create Contract</h3>
                  <p className="text-xs text-gray-600">Create a new contract</p>
                </div>
              </div>
            </a>
            <a
              href="/people/freelancer-management/freelancer-directory"
              className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Freelancer Directory</h3>
                  <p className="text-xs text-gray-600">View all freelancers</p>
                </div>
              </div>
            </a>
            <a
              href="/people/freelancer-management/contract-management"
              className="p-4 rounded-xl border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Contract Management</h3>
                  <p className="text-xs text-gray-600">Manage all contracts</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </ElevatedCard>
      <HelpButton module="freelancer-management" />
    </ModuleLayout>
  );
}
