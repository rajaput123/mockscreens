'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import { getAllCapacityRules, CapacityRule, getUtilization, getCapacityStatusColor } from '../capacityData';
import { getAllTemples } from '../../temple-management/templeData';
import UtilizationGauge from '../components/UtilizationGauge';
import CapacityUtilizationChart from '../components/CapacityUtilizationChart';

export default function CrowdMonitoringPage() {
  const [capacityRules, setCapacityRules] = useState<CapacityRule[]>([]);
  const [temples, setTemples] = useState<Array<{ id: string; name: string; deity?: string }>>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      loadData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const rules = getAllCapacityRules();
    setCapacityRules(rules);
    
    const allTemples = getAllTemples();
    setTemples(allTemples.map(t => ({ id: t.id, name: t.name, deity: t.deity })));
  };

  const getTempleName = (templeId: string) => {
    const temple = temples.find(t => t.id === templeId);
    return temple?.deity || temple?.name || templeId;
  };

  const activeRules = capacityRules.filter(r => r.status === 'active');
  const selectedRule = selectedLocation ? activeRules.find(r => r.id === selectedLocation) : null;

  return (
    <ModuleLayout
      title="Crowd Monitoring"
      description="Real-time monitoring of crowd capacity across all locations"
    >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Location List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Active Locations</h2>
              <p className="text-sm text-gray-600 mt-1">{activeRules.length} active location(s)</p>
            </div>
            <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
              {activeRules.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No active locations</p>
              ) : (
                activeRules.map((rule) => {
                  const utilization = getUtilization(rule.currentOccupancy, rule.maxCapacity);
                  const statusColor = getCapacityStatusColor(utilization);
                  const isSelected = selectedLocation === rule.id;
                  
                  return (
                    <button
                      key={rule.id}
                      onClick={() => setSelectedLocation(rule.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{rule.location}</h3>
                          <p className="text-xs text-gray-500 mt-1">{getTempleName(rule.templeId)}</p>
                        </div>
                        {rule.isLocked && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            Locked
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              statusColor === 'red' ? 'bg-red-500' :
                              statusColor === 'orange' ? 'bg-orange-500' :
                              statusColor === 'yellow' ? 'bg-yellow-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${
                          statusColor === 'red' ? 'text-red-600' :
                          statusColor === 'orange' ? 'text-orange-600' :
                          statusColor === 'yellow' ? 'text-yellow-600' : 'text-amber-600'
                        }`}>
                          {utilization}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{rule.currentOccupancy.toLocaleString()} / {rule.maxCapacity.toLocaleString()}</span>
                        <span className="text-gray-400">•</span>
                        <span>{rule.maxCapacity - rule.currentOccupancy} available</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Detailed View */}
        <div className="lg:col-span-2">
          {selectedRule ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedRule.location}</h2>
                    <p className="text-sm text-gray-600 mt-1">{getTempleName(selectedRule.templeId)}</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedRule.isLocked ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                        Locked
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                        Unlocked
                      </span>
                    )}
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedRule.status === 'active'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedRule.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Utilization Gauge */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">Current Utilization</h3>
                  <UtilizationGauge rule={selectedRule} />
                </div>

                {/* Capacity Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-amber-200">
                    <p className="text-sm text-amber-700 font-medium mb-1">Maximum Capacity</p>
                    <p className="text-2xl font-bold text-amber-900">{selectedRule.maxCapacity.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                    <p className="text-sm text-amber-700 font-medium mb-1">Current Occupancy</p>
                    <p className="text-2xl font-bold text-amber-900">{selectedRule.currentOccupancy.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-amber-200">
                    <p className="text-sm text-amber-700 font-medium mb-1">Available</p>
                    <p className="text-2xl font-bold text-amber-900">
                      {(selectedRule.maxCapacity - selectedRule.currentOccupancy).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Utilization Chart */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Utilization</h3>
                    <span className={`text-lg font-bold ${
                      getCapacityStatusColor(getUtilization(selectedRule.currentOccupancy, selectedRule.maxCapacity)) === 'red' ? 'text-red-600' :
                      getCapacityStatusColor(getUtilization(selectedRule.currentOccupancy, selectedRule.maxCapacity)) === 'orange' ? 'text-orange-600' :
                      getCapacityStatusColor(getUtilization(selectedRule.currentOccupancy, selectedRule.maxCapacity)) === 'yellow' ? 'text-yellow-600' : 'text-amber-600'
                    }`}>
                      {getUtilization(selectedRule.currentOccupancy, selectedRule.maxCapacity)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all ${
                        getCapacityStatusColor(getUtilization(selectedRule.currentOccupancy, selectedRule.maxCapacity)) === 'red' ? 'bg-red-500' :
                        getCapacityStatusColor(getUtilization(selectedRule.currentOccupancy, selectedRule.maxCapacity)) === 'orange' ? 'bg-orange-500' :
                        getCapacityStatusColor(getUtilization(selectedRule.currentOccupancy, selectedRule.maxCapacity)) === 'yellow' ? 'bg-yellow-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(getUtilization(selectedRule.currentOccupancy, selectedRule.maxCapacity), 100)}%` }}
                    />
                  </div>
                </div>

                {/* Additional Info */}
                {selectedRule.isLocked && selectedRule.lockedReason && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-red-900 mb-2">Lock Information</h4>
                    <p className="text-sm text-red-800">{selectedRule.lockedReason}</p>
                    {selectedRule.lockedAt && (
                      <p className="text-xs text-red-600 mt-2">
                        Locked on: {new Date(selectedRule.lockedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Trend Chart */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Last 24 Hours Trend</h4>
                  <div className="h-48">
                    <CapacityUtilizationChart />
                  </div>
                </div>

                {(selectedRule.effectiveFrom || selectedRule.effectiveTill) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Effective Period</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedRule.effectiveFrom && (
                        <div>
                          <span className="text-gray-600">From:</span>
                          <span className="ml-2 text-gray-900">{new Date(selectedRule.effectiveFrom).toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedRule.effectiveTill && (
                        <div>
                          <span className="text-gray-600">Till:</span>
                          <span className="ml-2 text-gray-900">{new Date(selectedRule.effectiveTill).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Location</h3>
              <p className="text-gray-600">Choose a location from the list to view detailed monitoring information</p>
            </div>
          )}
        </div>
      </div>

      <HelpButton module="crowd-capacity" />
    </ModuleLayout>
  );
}

