'use client';

import { useState, useEffect } from 'react';
import { navigationMenus } from '../../components/navigation/navigationData';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import HelpButton from '../../components/help/HelpButton';
import { getAllCapacityRules, CapacityRule, getUtilization, unlockCapacity } from './capacityData';
import CapacitySettingsModal from './CapacitySettingsModal';
import LocationComparisonChart from './components/LocationComparisonChart';
import CapacityDistributionChart from './components/CapacityDistributionChart';
import Link from 'next/link';

export default function CrowdCapacityPage() {
  const module = navigationMenus.operations.find(m => m.id === 'crowd-capacity');
  const [capacityRules, setCapacityRules] = useState<CapacityRule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CapacityRule | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const [stats, setStats] = useState({
    totalLocations: 0,
    activeLocations: 0,
    lockedLocations: 0,
    totalCapacity: 0,
    currentOccupancy: 0,
    averageUtilization: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  // Auto-rotate cards
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % 6);
    }, 3000); // Change card every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate charts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChartIndex((prev) => (prev + 1) % 2);
    }, 4000); // Change chart every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const rules = getAllCapacityRules();
    setCapacityRules(rules);
    
    const activeRules = rules.filter(r => r.status === 'active');
    const lockedRules = rules.filter(r => r.isLocked);
    const totalCapacity = rules.reduce((sum, r) => sum + r.maxCapacity, 0);
    const currentOccupancy = rules.reduce((sum, r) => sum + r.currentOccupancy, 0);
    const totalUtilization = rules.reduce((sum, r) => {
      return sum + getUtilization(r.currentOccupancy, r.maxCapacity);
    }, 0);
    const avgUtilization = rules.length > 0 ? Math.round(totalUtilization / rules.length) : 0;

    setStats({
      totalLocations: rules.length,
      activeLocations: activeRules.length,
      lockedLocations: lockedRules.length,
      totalCapacity,
      currentOccupancy,
      averageUtilization: avgUtilization,
    });
  };

  const handleOpenModal = (rule?: CapacityRule) => {
    setEditingRule(rule || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
    loadData();
  };

  if (!module) {
    return <div>Module not found</div>;
  }

  return (
    <ModuleLayout
      title="Crowd & Capacity Management"
      description="Monitor and manage crowd capacity across all temple locations"
    >
      <ModuleNavigation
        subServices={module.subServices}
        functions={module.functions}
        moduleId={module.id}
        category="operations"
      />

      {/* Dashboard Overview - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left Side - Rotating Cards in Original Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 6 card positions - each position rotates through all cards */}
          {[0, 1, 2, 3, 4, 5].map((position) => {
            const cards = [
              { title: 'Total Locations', value: stats.totalLocations, desc: 'All managed locations', icon: 'blue', svg: (
                <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>
              )},
              { title: 'Active Locations', value: stats.activeLocations, desc: 'Currently active', icon: 'green', svg: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )},
              { title: 'Locked Locations', value: stats.lockedLocations, desc: 'Capacity locked', icon: 'red', svg: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              )},
              { title: 'Total Capacity', value: stats.totalCapacity.toLocaleString(), desc: 'Maximum capacity', icon: 'purple', svg: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              )},
              { title: 'Current Occupancy', value: stats.currentOccupancy.toLocaleString(), desc: 'Currently occupied', icon: 'amber', svg: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              )},
              { title: 'Avg Utilization', value: `${stats.averageUtilization}%`, desc: 'Average across locations', icon: 'indigo', svg: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              )},
            ];
            
            // Each position shows a different card, rotating through all cards
            const cardIndex = (currentCardIndex + position) % cards.length;
            const card = cards[cardIndex];
            const iconColors: Record<string, string> = {
              blue: 'text-amber-600',
              green: 'text-amber-600',
              red: 'text-red-600',
              purple: 'text-amber-600',
              amber: 'text-amber-600',
              indigo: 'text-indigo-600',
            };
            
            return (
              <div
                key={position}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                  <svg className={`w-6 h-6 ${iconColors[card.icon]} group-hover:scale-110 transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {card.svg}
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gray-900 transform group-hover:scale-110 transition-transform duration-300 inline-block">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Right Side - Chart Carousel */}
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="relative h-[500px]">
            {/* Chart Container - Slides from right */}
            <div 
              className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentChartIndex * 100}%)` }}
            >
              {/* Location Comparison Chart */}
              <div className="min-w-full p-6 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Comparison</h2>
                <div className="flex-1">
                  <LocationComparisonChart />
                </div>
              </div>

              {/* Capacity Distribution Chart */}
              <div className="min-w-full p-6 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Capacity Distribution</h2>
                <div className="flex-1">
                  <CapacityDistributionChart />
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {[0, 1].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentChartIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentChartIndex === index ? 'w-8 bg-amber-600' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md font-medium"
          >
            + Add Capacity Rule
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/operations/crowd-capacity/capacity-dashboard"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-amber-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors duration-200">Capacity Dashboard</h3>
              <p className="text-xs text-gray-600">View all capacity metrics</p>
            </div>
          </Link>

          <Link
            href="/operations/crowd-capacity/crowd-monitoring"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-amber-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors duration-200">Crowd Monitoring</h3>
              <p className="text-xs text-gray-600">Real-time crowd tracking</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Capacity Rules List */}
      {capacityRules.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Capacity Rules</h2>
            <p className="text-sm text-gray-600 mt-1">Manage capacity settings for all locations</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capacityRules.map((rule) => {
                const utilization = getUtilization(rule.currentOccupancy, rule.maxCapacity);
                const statusColor = utilization >= 90 ? 'red' : utilization >= 70 ? 'orange' : utilization >= 50 ? 'yellow' : 'green';
                
                return (
                  <div
                    key={rule.id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">{rule.location}</h3>
                        <p className="text-xs text-gray-500 mt-1">Temple ID: {rule.templeId}</p>
                      </div>
                      {rule.isLocked && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          Locked
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Capacity</span>
                        <span className="text-sm font-semibold text-gray-900">{rule.maxCapacity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Occupancy</span>
                        <span className="text-sm font-semibold text-gray-900">{rule.currentOccupancy.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Utilization</span>
                        <span className={`text-sm font-semibold text-${statusColor}-600`}>{utilization}%</span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          statusColor === 'red' ? 'bg-red-500' :
                          statusColor === 'orange' ? 'bg-orange-500' :
                          statusColor === 'yellow' ? 'bg-yellow-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(rule)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (rule.isLocked) {
                            unlockCapacity(rule.id);
                            loadData();
                          } else {
                            handleOpenModal(rule);
                          }
                        }}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          rule.isLocked
                            ? 'text-amber-700 bg-amber-100 hover:bg-green-200'
                            : 'text-red-700 bg-red-100 hover:bg-red-200'
                        }`}
                      >
                        {rule.isLocked ? 'Unlock' : 'Lock'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Capacity Rules</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first capacity rule</p>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md font-medium"
          >
            + Add Capacity Rule
          </button>
        </div>
      )}

      <CapacitySettingsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingRule={editingRule}
      />

      <HelpButton module="crowd-capacity" />
    </ModuleLayout>
  );
}

