'use client';

import { useState, useEffect, useMemo } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { getAllSevas, type Seva } from '../sevaData';

export default function SlotManagementPage() {
  const [sevas, setSevas] = useState<Seva[]>([]);
  const [selectedSeva, setSelectedSeva] = useState<Seva | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'low' | 'full'>('all');

  useEffect(() => {
    loadSevas();
  }, []);

  const loadSevas = () => {
    setSevas(getAllSevas());
  };

  const calculateAvailableSlots = (seva: Seva) => {
    const maxSlots = (seva as any).maxSlots || 0;
    const bookingSlots = (seva as any).bookingSlots || 0;
    return maxSlots - bookingSlots;
  };

  const getSlotUtilization = (seva: Seva) => {
    const maxSlots = (seva as any).maxSlots || 0;
    if (maxSlots === 0) return 0;
    const bookingSlots = (seva as any).bookingSlots || 0;
    return Math.round((bookingSlots / maxSlots) * 100);
  };

  const getSlotStatus = (seva: Seva) => {
    const available = calculateAvailableSlots(seva);
    const utilization = getSlotUtilization(seva);
    
    if (available === 0) return 'full';
    if (utilization >= 80) return 'low';
    if (utilization >= 50) return 'medium';
    return 'available';
  };

  const filteredSevas = useMemo(() => {
    let filtered = sevas.filter(seva => {
      const matchesSearch = !searchTerm || 
        seva.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (seva.deityName || seva.templeName)?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (filterStatus === 'all') return true;
      
      const status = getSlotStatus(seva);
      if (filterStatus === 'available') return status === 'available';
      if (filterStatus === 'low') return status === 'low' || status === 'medium';
      if (filterStatus === 'full') return status === 'full';
      
      return true;
    });
    
    return filtered;
  }, [sevas, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const totalSlots = sevas.reduce((sum, s) => sum + ((s as any).maxSlots || 0), 0);
    const bookedSlots = sevas.reduce((sum, s) => sum + ((s as any).bookingSlots || 0), 0);
    const availableSlots = totalSlots - bookedSlots;
    const utilization = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;
    
    return {
      totalSlots,
      bookedSlots,
      availableSlots,
      utilization,
    };
  }, [sevas]);

  const handleSevaSelect = (seva: Seva) => {
    setSelectedSeva(seva);
  };

  return (
    <ModuleLayout
      title="Slot Management"
      description="Monitor and manage slot availability for all sevas"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Total Slots</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalSlots}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Booked</p>
          <p className="text-2xl font-bold text-amber-600">{stats.bookedSlots}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Available</p>
          <p className="text-2xl font-bold text-amber-600">{stats.availableSlots}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Utilization</p>
          <p className="text-2xl font-bold text-amber-600">{stats.utilization}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seva List */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search sevas by name or deity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {['all', 'available', 'low', 'full'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filterStatus === status
                        ? 'bg-amber-600 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status === 'available' ? 'Available' : status === 'low' ? 'Low Stock' : 'Full'}
                  </button>
                ))}
              </div>
            </div>

            {/* Seva Cards */}
            <div className="space-y-4">
              {filteredSevas.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600">No sevas found matching your criteria</p>
                </div>
              ) : (
                filteredSevas.map((seva) => {
                  const availableSlots = calculateAvailableSlots(seva);
                  const utilization = getSlotUtilization(seva);
                  const status = getSlotStatus(seva);
                  const maxSlots = (seva as any).maxSlots || 0;
                  const bookingSlots = (seva as any).bookingSlots || 0;
                  
                  const statusColors = {
                    available: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', bar: 'bg-amber-500' },
                    medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', bar: 'bg-yellow-500' },
                    low: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', bar: 'bg-orange-500' },
                    full: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', bar: 'bg-red-500' },
                  };
                  
                  const colors = statusColors[status] || statusColors.available;
                  
                  return (
                    <div
                      key={seva.id}
                      onClick={() => handleSevaSelect(seva)}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                        selectedSeva?.id === seva.id
                          ? `${colors.bg} ${colors.border} border-2 shadow-md scale-[1.02]`
                          : 'bg-white border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{seva.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{seva.deityName || seva.templeName}</p>
                          
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Max:</span>
                              <span className="text-sm font-semibold text-gray-900">{maxSlots}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Booked:</span>
                              <span className="text-sm font-semibold text-amber-600">{bookingSlots}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Available:</span>
                              <span className={`text-sm font-bold ${colors.text}`}>{availableSlots}</span>
                            </div>
                          </div>
                          
                          <div className="mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-3 rounded-full transition-all duration-500 ${colors.bar}`}
                                style={{ width: `${Math.min(utilization, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">{utilization}% utilized</span>
                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${colors.bg} ${colors.text}`}>
                              {status === 'available' ? 'Available' : status === 'medium' ? 'Medium' : status === 'low' ? 'Low Stock' : 'Full'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Slot Details Panel */}
        <div className="lg:col-span-1">
          {selectedSeva ? (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Slot Details</h2>
              
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{selectedSeva.name}</h3>
                  <p className="text-sm text-gray-600">{selectedSeva.deityName || selectedSeva.templeName}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-xs text-amber-600 mb-1">Maximum Slots</p>
                    <p className="text-2xl font-bold text-amber-900">{(selectedSeva as any).maxSlots || 0}</p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-xs text-amber-600 mb-1">Booked Slots</p>
                    <p className="text-2xl font-bold text-amber-900">{(selectedSeva as any).bookingSlots || 0}</p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-xs text-amber-600 mb-1">Available Slots</p>
                    <p className="text-2xl font-bold text-amber-900">
                      {calculateAvailableSlots(selectedSeva)}
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-xs text-amber-600 mb-1">Utilization</p>
                    <p className="text-2xl font-bold text-purple-900">{getSlotUtilization(selectedSeva)}%</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Slot Duration</span>
                    <span className="font-semibold text-gray-900">{selectedSeva.slotDuration} min</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Max Devotees/Slot</span>
                    <span className="font-semibold text-gray-900">{selectedSeva.maxDevoteesPerSlot}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="font-semibold text-gray-900">{selectedSeva.physicalLocation}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Timing Blocks</h4>
                  <div className="space-y-2">
                    {selectedSeva.timingBlocks.map((block) => (
                      <div key={block.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm font-medium text-amber-900 mb-1">
                          {block.applicableDays.join(', ')}
                        </p>
                        <p className="text-xs text-amber-700">
                          {block.startTime} - {block.endTime}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center shadow-sm">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 font-medium">Select a seva to view slot details</p>
            </div>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
}
