'use client';

import { navigationMenus } from '../../components/navigation/navigationData';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import { ModernCard, ElevatedCard } from '../components';
import { getAllVIPDevotees, getAllDevotees } from '../peopleData';

export default function VIPDevoteePage() {
  const module = navigationMenus.people.find(m => m.id === 'vip-devotee');
  
  if (!module) {
    return <div>Module not found</div>;
  }

  const vipDevotees = getAllVIPDevotees();
  const allDevotees = getAllDevotees();
  const goldVIP = vipDevotees.filter(v => v.vipLevel === 'gold').length;
  const silverVIP = vipDevotees.filter(v => v.vipLevel === 'silver').length;
  const platinumVIP = vipDevotees.filter(v => v.vipLevel === 'platinum').length;

  return (
    <ModuleLayout
      title="VIP Devotee Management"
      description="Manage VIP devotees and their services"
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
              <p className="text-sm text-gray-600 mb-1">Total VIP Devotees</p>
              <p className="text-3xl font-bold text-gray-900">{vipDevotees.length}</p>
              <p className="text-xs text-gray-500 mt-2">Special status</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </ModernCard>

        <ModernCard elevation="lg" className="p-6 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Platinum VIP</p>
              <p className="text-3xl font-bold text-gray-900">{platinumVIP}</p>
              <p className="text-xs text-gray-500 mt-2">Highest tier</p>
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
              <p className="text-sm text-gray-600 mb-1">Gold VIP</p>
              <p className="text-3xl font-bold text-gray-900">{goldVIP}</p>
              <p className="text-xs text-gray-500 mt-2">Premium tier</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </ModernCard>

        <ModernCard elevation="lg" className="p-6 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Silver VIP</p>
              <p className="text-3xl font-bold text-gray-900">{silverVIP}</p>
              <p className="text-xs text-gray-500 mt-2">Standard tier</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Recent VIP Devotees */}
      <ElevatedCard elevation="lg" className="mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">VIP Devotees</h2>
            <a href="/people/vip-devotee/vip-directory" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vipDevotees.slice(0, 6).map((vip) => (
              <div
                key={vip.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{vip.name}</h3>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    vip.vipLevel === 'platinum'
                      ? 'bg-purple-100 text-purple-700'
                      : vip.vipLevel === 'gold'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {vip.vipLevel}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">ID: {vip.devoteeId}</p>
                <p className="text-xs text-gray-600 mb-2">{vip.email}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {vip.vipServices.slice(0, 2).map((service, idx) => (
                    <span key={idx} className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs">
                      {service}
                    </span>
                  ))}
                  {vip.vipServices.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{vip.vipServices.length - 2}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">VIP since: {vip.vipSince}</p>
              </div>
            ))}
          </div>
        </div>
      </ElevatedCard>

      {/* Quick Actions */}
      <ElevatedCard elevation="lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/people/vip-devotee/mark-vip"
              className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mark / Manage VIP</h3>
                  <p className="text-xs text-gray-600">Assign VIP status to devotees</p>
                </div>
              </div>
            </a>
            <a
              href="/people/vip-devotee/vip-directory"
              className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">VIP Directory</h3>
                  <p className="text-xs text-gray-600">View all VIP devotees</p>
                </div>
              </div>
            </a>
            <a
              href="/people/vip-devotee/vip-services"
              className="p-4 rounded-xl border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">VIP Services</h3>
                  <p className="text-xs text-gray-600">Manage VIP services</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </ElevatedCard>
    </ModuleLayout>
  );
}
