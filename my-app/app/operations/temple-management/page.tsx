'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ModuleLayout from '../../components/layout/ModuleLayout';
import { getTempleStatistics, getAllTemples, type Temple } from './templeData';

export default function TempleManagementPage() {
  const [stats, setStats] = useState({
    totalTemples: 0,
    parentTemples: 0,
    childTemples: 0,
    totalSevas: 0,
  });
  const [mainTemple, setMainTemple] = useState<Temple | null>(null);

  useEffect(() => {
    // Load statistics on client side to ensure localStorage data is included
    const statistics = getTempleStatistics();
    setStats(statistics);

    // Load main temple
    const temples = getAllTemples();
    const parents = temples.filter(t => t.type === 'parent');
    if (parents.length > 0) {
      setMainTemple(parents[0]);
    }
  }, []);

  return (
    <ModuleLayout
      title="Temple Management"
      description="Manage temples and hierarchy"
    >
      {/* Modern Navigation Cards */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            href="/operations/temple-management/add-temple"
            className="group bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-1 no-underline"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Add Temple</h3>
            </div>
            <p className="text-sm text-gray-600">Create new main or child temple</p>
          </Link>

          <Link
            href="/operations/temple-management/manage-hierarchy"
            className="group bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 no-underline"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Manage Hierarchy</h3>
            </div>
            <p className="text-sm text-gray-600">Organize temple relationships</p>
          </Link>

          <Link
            href="/operations/temple-management/temple-directory"
            className="group bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-1 no-underline"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Temple Directory</h3>
            </div>
            <p className="text-sm text-gray-600">Search & filter all temples</p>
          </Link>

          <Link
            href="/operations/temple-management/temple-hierarchy"
            className="group bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-1 no-underline"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Hierarchy Tree</h3>
            </div>
            <p className="text-sm text-gray-600">Visual tree structure</p>
          </Link>

          <Link
            href={mainTemple ? `/operations/temple-management/temple-details?templeId=${mainTemple.id}` : '/operations/temple-management/temple-directory'}
            className="group bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all duration-300 transform hover:-translate-y-1 no-underline"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">Temple Details</h3>
            </div>
            <p className="text-sm text-gray-600">View temple information</p>
          </Link>
        </div>
      </div>

      {/* Modern Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Temples</h3>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="text-5xl font-bold text-gray-900 mb-2">{stats.totalTemples}</p>
          <p className="text-sm text-gray-600">Temples in system</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Main Temple</h3>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
          <p className="text-5xl font-bold text-gray-900 mb-2">{stats.parentTemples}</p>
          <p className="text-sm text-gray-600">Parent temples</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Child Temples</h3>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <p className="text-5xl font-bold text-gray-900 mb-2">{stats.childTemples}</p>
          <p className="text-sm text-gray-600">Subordinate temples</p>
        </div>
      </div>

      {/* Main Temple Quick View Card */}
      {mainTemple && (
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Main Temple</h3>
                  <p className="text-sm text-gray-600">{mainTemple.deity || mainTemple.name}</p>
                </div>
              </div>
              <Link
                href={`/operations/temple-management/temple-details?templeId=${mainTemple.id}`}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white text-sm font-medium transition-all duration-200"
              >
                View Details →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="text-base font-semibold text-gray-900">{mainTemple.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                  mainTemple.status === 'active'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {mainTemple.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Child Temples</p>
                <p className="text-base font-semibold text-gray-900">{stats.childTemples}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}
