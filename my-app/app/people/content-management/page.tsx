'use client';

import { useEffect, useState } from 'react';
import { navigationMenus } from '../../components/navigation/navigationData';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import HelpButton from '../../components/help/HelpButton';
import { ModernCard, ElevatedCard } from '../components';
import { mockContents } from './mockData';
import { Content } from './types';
import { loadContent } from '../utils/dataStorage';

export default function ContentManagementPage() {
  const module = navigationMenus.people.find(m => m.id === 'content-management');
  const [contents, setContents] = useState<Content[]>([]);
  
  if (!module) {
    return <div>Module not found</div>;
  }

  useEffect(() => {
    const staticContents = mockContents;
    const loadedContents = loadContent(staticContents);
    setContents(loadedContents);
  }, []);

  const published = contents.filter(c => c.status === 'published');
  const underReview = contents.filter(c => c.status === 'under-review');
  const drafts = contents.filter(c => c.status === 'draft');
  const recentContents = contents
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <ModuleLayout
      title="Content Management"
      description="Manage temple content, events, notices, and information"
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
              <p className="text-sm text-gray-600 mb-1">Total Content</p>
              <p className="text-3xl font-bold text-gray-900">{contents.length}</p>
              <p className="text-xs text-gray-500 mt-2">{contents.length} items</p>
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
              <p className="text-sm text-gray-600 mb-1">Published</p>
              <p className="text-3xl font-bold text-green-600">{published.length}</p>
              <p className="text-xs text-gray-500 mt-2">Live content</p>
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
              <p className="text-sm text-gray-600 mb-1">Under Review</p>
              <p className="text-3xl font-bold text-amber-600">{underReview.length}</p>
              <p className="text-xs text-gray-500 mt-2">Pending approval</p>
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

      {/* Recent Content */}
      <ElevatedCard elevation="lg" className="mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Content</h2>
            <a href="/people/content-management/content-library" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentContents.length > 0 ? (
              recentContents.map((content) => (
                <div
                  key={content.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer bg-white"
                  onClick={() => window.location.href = `/people/content-management/content-library`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{content.title}</h3>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      content.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : content.status === 'under-review'
                        ? 'bg-amber-100 text-amber-700'
                        : content.status === 'draft'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {content.status === 'under-review' ? 'Review' : content.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1 capitalize">{content.type.replace('-', ' ')}</p>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: content.content }} />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>By {content.authorName}</span>
                    <span>v{content.version}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No content available. Create your first content item.
              </div>
            )}
          </div>
        </div>
      </ElevatedCard>

      {/* Quick Actions */}
      <ElevatedCard elevation="lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <a
              href="/people/content-management/content-editor"
              className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create Content</h3>
                  <p className="text-xs text-gray-600">Add new content</p>
                </div>
              </div>
            </a>
            <a
              href="/people/content-management/content-library"
              className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Content Library</h3>
                  <p className="text-xs text-gray-600">View all content</p>
                </div>
              </div>
            </a>
            <a
              href="/people/content-management/content-approval"
              className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Approvals</h3>
                  <p className="text-xs text-gray-600">{underReview.length} pending</p>
                </div>
              </div>
            </a>
            <a
              href="/people/content-management/edit-temple-content"
              className="p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Edit Temple Content</h3>
                  <p className="text-xs text-gray-600">Manage temple info</p>
                </div>
              </div>
            </a>
            <a
              href="/people/content-management/content-history"
              className="p-4 rounded-xl border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">History</h3>
                  <p className="text-xs text-gray-600">Version history</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </ElevatedCard>
      <HelpButton module="content-management" />
    </ModuleLayout>
  );
}
