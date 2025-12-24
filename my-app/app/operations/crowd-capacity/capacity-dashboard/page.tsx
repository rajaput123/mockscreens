'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import { getAllCapacityRules, CapacityRule, getUtilization, getCapacityStatusColor } from '../capacityData';
import { getAllTemples } from '../../temple-management/templeData';
import CapacityUtilizationChart from '../components/CapacityUtilizationChart';
import LocationComparisonChart from '../components/LocationComparisonChart';

export default function CapacityDashboardPage() {
  const [capacityRules, setCapacityRules] = useState<CapacityRule[]>([]);
  const [temples, setTemples] = useState<Array<{ id: string; name: string; deity?: string }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [lockFilter, setLockFilter] = useState<'all' | 'locked' | 'unlocked'>('all');

  useEffect(() => {
    loadData();
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

  const filteredRules = capacityRules.filter(rule => {
    const matchesSearch = rule.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTempleName(rule.templeId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rule.status === statusFilter;
    const matchesLock = lockFilter === 'all' || 
      (lockFilter === 'locked' && rule.isLocked) ||
      (lockFilter === 'unlocked' && !rule.isLocked);
    
    return matchesSearch && matchesStatus && matchesLock;
  });

  return (
    <ModuleLayout
      title="Capacity Dashboard"
      description="Comprehensive view of capacity metrics across all locations"
    >

      {/* Graph Section */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Capacity Utilization Trends</h2>
          <CapacityUtilizationChart />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Comparison</h2>
          <LocationComparisonChart />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by location or temple..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lock Status</label>
            <select
              value={lockFilter}
              onChange={(e) => setLockFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            >
              <option value="all">All</option>
              <option value="locked">Locked</option>
              <option value="unlocked">Unlocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Capacity Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Capacity Overview</h2>
          <p className="text-sm text-gray-600 mt-1">{filteredRules.length} location(s) found</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temple</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lock Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No capacity rules found
                  </td>
                </tr>
              ) : (
                filteredRules.map((rule) => {
                  const utilization = getUtilization(rule.currentOccupancy, rule.maxCapacity);
                  const statusColor = getCapacityStatusColor(utilization);
                  
                  return (
                    <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{rule.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{getTempleName(rule.templeId)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{rule.maxCapacity.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{rule.currentOccupancy.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                statusColor === 'red' ? 'bg-red-500' :
                                statusColor === 'orange' ? 'bg-orange-500' :
                                statusColor === 'yellow' ? 'bg-yellow-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(utilization, 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${
                            statusColor === 'red' ? 'text-red-600' :
                            statusColor === 'orange' ? 'text-orange-600' :
                            statusColor === 'yellow' ? 'text-yellow-600' : 'text-amber-600'
                          }`}>
                            {utilization}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          rule.status === 'active'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {rule.isLocked ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                            Locked
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                            Unlocked
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <HelpButton module="crowd-capacity" />
    </ModuleLayout>
  );
}

