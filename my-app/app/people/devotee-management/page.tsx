'use client';

'use client';

import { useEffect, useState } from 'react';
import { navigationMenus } from '../../components/navigation/navigationData';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import { ModernCard, ElevatedCard } from '../components';
import { getAllDevotees } from '../peopleData';
import { loadDevotees } from '../utils/dataStorage';

export default function DevoteeManagementPage() {
  const module = navigationMenus.people.find(m => m.id === 'devotee-management');
  const [devotees, setDevotees] = useState<any[]>([]);
  
  if (!module) {
    return <div>Module not found</div>;
  }

  useEffect(() => {
    const staticDevotees = getAllDevotees();
    const loadedDevotees = loadDevotees(staticDevotees);
    setDevotees(loadedDevotees);
  }, []);

  const activeDevotees = devotees.filter(d => d.status === 'active');
  const vipDevotees = devotees.filter(d => d.isVIP);
  const newThisMonth = devotees.filter(d => {
    const regDate = new Date(d.registrationDate);
    const now = new Date();
    return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <ModuleLayout
      title="Devotee Management"
      description="Manage devotees and their history"
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
              <p className="text-sm text-gray-600 mb-1">Total Devotees</p>
              <p className="text-3xl font-bold text-gray-900">{devotees.length}</p>
              <p className="text-xs text-gray-500 mt-2">{activeDevotees.length} active</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </ModernCard>

        <ModernCard elevation="lg" className="p-6 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Devotees</p>
              <p className="text-3xl font-bold text-gray-900">{activeDevotees.length}</p>
              <p className="text-xs text-gray-500 mt-2">Currently active</p>
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
              <p className="text-sm text-gray-600 mb-1">VIP Devotees</p>
              <p className="text-3xl font-bold text-gray-900">{vipDevotees.length}</p>
              <p className="text-xs text-gray-500 mt-2">Special status</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </ModernCard>

        <ModernCard elevation="lg" className="p-6 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">New This Month</p>
              <p className="text-3xl font-bold text-gray-900">{newThisMonth}</p>
              <p className="text-xs text-gray-500 mt-2">Recent registrations</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Recent Devotees */}
      <ElevatedCard elevation="lg" className="mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Devotees</h2>
            <a href="/people/devotee-management/devotee-directory" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devotees.slice(0, 6).map((devotee) => (
              <div
                key={devotee.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{devotee.name}</h3>
                  <div className="flex gap-1">
                    {devotee.isVIP && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                        VIP
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      devotee.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {devotee.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-1">ID: {devotee.devoteeId}</p>
                <p className="text-xs text-gray-600 mb-2">{devotee.email}</p>
                <div className="flex items-center justify-between">
                  {devotee.visitCount !== undefined && (
                    <span className="text-xs text-gray-600">{devotee.visitCount} visits</span>
                  )}
                  <span className="text-xs text-gray-500">{devotee.registrationDate}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/people/devotee-management/create-devotee"
              className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create / Update Devotee</h3>
                  <p className="text-xs text-gray-600">Add or edit devotee information</p>
                </div>
              </div>
            </a>
            <a
              href="/people/devotee-management/devotee-directory"
              className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Devotee Directory</h3>
                  <p className="text-xs text-gray-600">View all devotees</p>
                </div>
              </div>
            </a>
            <a
              href="/people/devotee-management/devotee-history"
              className="p-4 rounded-xl border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Devotee History</h3>
                  <p className="text-xs text-gray-600">View visit history</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </ElevatedCard>
    </ModuleLayout>
  );
}
