'use client';

import { useEffect, useState } from 'react';
import { navigationMenus } from '../../components/navigation/navigationData';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import HelpButton from '../../components/help/HelpButton';
import { ModernCard, ElevatedCard } from '../components';
import { mockAnnouncements } from './mockData';
import { Announcement } from './types';
import { loadAnnouncements } from '../utils/dataStorage';

export default function PRCommunicationsPage() {
  const module = navigationMenus.people.find(m => m.id === 'pr-communications');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  
  if (!module) {
    return <div>Module not found</div>;
  }

  useEffect(() => {
    const staticAnnouncements = mockAnnouncements;
    const loadedAnnouncements = loadAnnouncements(staticAnnouncements);
    setAnnouncements(loadedAnnouncements);
  }, []);

  const sent = announcements.filter(a => a.status === 'sent');
  const scheduled = announcements.filter(a => a.status === 'scheduled');
  const drafts = announcements.filter(a => a.status === 'draft');
  const recentAnnouncements = announcements
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <ModuleLayout
      title="PR & Communications"
      description="Manage announcements and communications"
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
              <p className="text-sm text-gray-600 mb-1">Total Announcements</p>
              <p className="text-3xl font-bold text-gray-900">{announcements.length}</p>
              <p className="text-xs text-gray-500 mt-2">{announcements.length} items</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3.14a7.5 7.5 0 011.582 8.239M9 17h.01" />
              </svg>
            </div>
          </div>
        </ModernCard>

        <ModernCard elevation="lg" className="p-6 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sent</p>
              <p className="text-3xl font-bold text-green-600">{sent.length}</p>
              <p className="text-xs text-gray-500 mt-2">Delivered</p>
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
              <p className="text-sm text-gray-600 mb-1">Scheduled</p>
              <p className="text-3xl font-bold text-amber-600">{scheduled.length}</p>
              <p className="text-xs text-gray-500 mt-2">Pending</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </ModernCard>

        <ModernCard elevation="lg" className="p-6 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Drafts</p>
              <p className="text-3xl font-bold text-gray-600">{drafts.length}</p>
              <p className="text-xs text-gray-500 mt-2">In progress</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Recent Announcements */}
      <ElevatedCard elevation="lg" className="mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Announcements</h2>
            <a href="/people/pr-communications/announcements" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer bg-white"
                  onClick={() => window.location.href = `/people/pr-communications/announcements`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{announcement.title}</h3>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      announcement.status === 'sent'
                        ? 'bg-green-100 text-green-700'
                        : announcement.status === 'scheduled'
                        ? 'bg-amber-100 text-amber-700'
                        : announcement.status === 'draft'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {announcement.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1 capitalize">{announcement.audience}</p>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{announcement.message}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>By {announcement.createdByName}</span>
                    <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No announcements available. Create your first announcement.
              </div>
            )}
          </div>
        </div>
      </ElevatedCard>

      {/* Quick Actions */}
      <ElevatedCard elevation="lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/people/pr-communications/publish-announcement"
              className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Publish Announcement</h3>
                  <p className="text-xs text-gray-600">Create new announcement</p>
                </div>
              </div>
            </a>
            <a
              href="/people/pr-communications/announcements"
              className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Announcements</h3>
                  <p className="text-xs text-gray-600">View all announcements</p>
                </div>
              </div>
            </a>
            <a
              href="/people/pr-communications/communications"
              className="p-4 rounded-xl border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Communications</h3>
                  <p className="text-xs text-gray-600">Delivery logs</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </ElevatedCard>
      <HelpButton module="pr-communications" />
    </ModuleLayout>
  );
}
