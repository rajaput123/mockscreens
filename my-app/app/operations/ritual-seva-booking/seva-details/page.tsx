'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import Modal from '../../../components/ui/Modal';
import { getAllSevas, getSevaById, type Seva } from '../sevaData';

export default function SevaDetailsPage() {
  const searchParams = useSearchParams();
  const [sevas, setSevas] = useState<Seva[]>([]);
  const [selectedSeva, setSelectedSeva] = useState<Seva | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Ritual' | 'Offering' | 'Special'>('all');

  useEffect(() => {
    loadSevas();
  }, []);

  useEffect(() => {
    // Check if sevaId is in URL params and open modal
    const sevaId = searchParams.get('sevaId');
    if (sevaId && sevas.length > 0) {
      const seva = getSevaById(sevaId);
      if (seva) {
        setSelectedSeva(seva);
        setShowDetailsModal(true);
      }
    }
  }, [searchParams, sevas]);

  const loadSevas = () => {
    setSevas(getAllSevas());
  };

  const handleCardClick = (sevaId: string) => {
    const seva = getSevaById(sevaId);
    if (seva) {
      setSelectedSeva(seva);
      setShowDetailsModal(true);
    }
  };

  const filteredSevas = sevas.filter(seva => {
    const matchesSearch = !searchTerm ||
      seva.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (seva.deityName || seva.templeName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seva.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || seva.status === statusFilter;
    const matchesType = typeFilter === 'all' || seva.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const calculateDiscount = (seva: Seva) => {
    const original = seva.originalPrice || seva.basePrice || 0;
    const current = seva.basePrice || 0;
    if (original === 0 || original === current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const getSlotInfo = (seva: Seva) => {
    const maxSlots = seva.maxSlots || 0;
    const bookingSlots = seva.bookingSlots || 0;
    const available = maxSlots - bookingSlots;
    return { max: maxSlots, booked: bookingSlots, available };
  };

  return (
    <ModuleLayout
      title="View Sevas"
      description="Browse and view detailed information about all sevas"
    >
      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search sevas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
            >
              <option value="all">All Types</option>
              <option value="Ritual">Ritual</option>
              <option value="Offering">Offering</option>
              <option value="Special">Special</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredSevas.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{sevas.length}</span> sevas
        </p>
      </div>

      {/* Cards Grid */}
      {filteredSevas.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-200 shadow-sm">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No sevas found</h3>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Try adjusting your search or filters to find sevas
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSevas.map((seva) => {
            const slotInfo = getSlotInfo(seva);
            const discount = calculateDiscount(seva);
            const originalPrice = seva.originalPrice;
            
            return (
              <div 
                key={seva.id} 
                onClick={() => handleCardClick(seva.id)}
                className="group bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-amber-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                {/* Image Section */}
                {seva.image ? (
                  <div className="mb-5 rounded-xl overflow-hidden relative">
                    <img
                      key={`seva-img-${seva.id}-${seva.image?.substring(0, 50)}`}
                      src={seva.image}
                      alt={seva.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-seva.jpg';
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-5 rounded-xl overflow-hidden relative bg-gray-50 h-48 flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-amber-300 transition-colors">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1.5 truncate">{seva.name}</h3>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-gray-600 truncate">{seva.deityName || seva.templeName || 'Unknown Deity'}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-semibold border border-amber-200">
                      {seva.type}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-700 rounded-md text-xs font-semibold border border-gray-200">
                      {seva.category}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      seva.status === 'active' 
                        ? 'bg-amber-50 text-amber-700 border-amber-200' 
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        seva.status === 'active' ? 'bg-amber-500' : 'bg-gray-400'
                      }`}></span>
                      {seva.status === 'active' ? 'Active' : 'Draft'}
                    </span>
                  </div>

                  {seva.shortDescription && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{seva.shortDescription}</p>
                  )}

                  {/* Pricing */}
                  <div className="pt-3 border-t border-gray-100">
                    {seva.isFree ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-semibold">Free</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{seva.basePrice?.toLocaleString()}
                        </span>
                        {originalPrice && originalPrice > (seva.basePrice || 0) && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400 line-through">
                              ₹{originalPrice.toLocaleString()}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-xs font-bold">
                              {discount}% OFF
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Slot Management */}
                  {slotInfo && slotInfo.max > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Slot Availability</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-amber-600">{slotInfo.available}</span>
                          <span className="text-sm text-gray-400">/</span>
                          <span className="text-sm text-gray-600">{slotInfo.max}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">({slotInfo.booked} booked)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 shadow-sm"
                          style={{ width: `${(slotInfo.available / slotInfo.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Capacity Info */}
                  <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Max/Slot</p>
                        <p className="text-sm font-semibold text-gray-900">{seva.maxDevoteesPerSlot}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{seva.physicalLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Seva Details Modal */}
      {selectedSeva && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedSeva(null);
          }}
          title="Seva Details"
          size="lg"
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Image */}
            {selectedSeva.image && (
              <div className="rounded-xl overflow-hidden">
                <img
                  src={selectedSeva.image}
                  alt={selectedSeva.name}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Seva Name
                </label>
                <p className="text-lg font-bold text-gray-900">{selectedSeva.name}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Deity / Temple
                </label>
                <p className="text-lg text-gray-900">{selectedSeva.deityName || selectedSeva.templeName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Type
                </label>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  {selectedSeva.type}
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Category
                </label>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200">
                  {selectedSeva.category}
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Status
                </label>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                  selectedSeva.status === 'active'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    selectedSeva.status === 'active' ? 'bg-amber-500' : 'bg-gray-400'
                  }`}></span>
                  {selectedSeva.status === 'active' ? 'Active' : 'Draft'}
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Visibility
                </label>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                  selectedSeva.devoteeVisibility === 'Visible'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-200'
                }`}>
                  {selectedSeva.devoteeVisibility}
                </span>
              </div>
            </div>

            {/* Description */}
            {selectedSeva.shortDescription && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedSeva.shortDescription}</p>
              </div>
            )}

            {/* Pricing */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-6 border border-amber-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Pricing Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Is Free</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedSeva.isFree ? 'Yes' : 'No'}
                  </p>
                </div>
                {!selectedSeva.isFree && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Base Price</label>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{selectedSeva.basePrice?.toLocaleString()}
                      </p>
                    </div>
                    {selectedSeva.originalPrice && selectedSeva.originalPrice !== selectedSeva.basePrice && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Original Price</label>
                        <p className="text-sm text-gray-500 line-through">
                          ₹{selectedSeva.originalPrice.toLocaleString()}
                        </p>
                        <p className="text-sm font-semibold text-red-600 mt-1">
                          {calculateDiscount(selectedSeva)}% Discount
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Allow Donation</label>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedSeva.allowDonation ? 'Yes' : 'No'}
                      </p>
                    </div>
                    {selectedSeva.allowDonation && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Min Donation</label>
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{selectedSeva.minDonation?.toLocaleString() || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Max Donation</label>
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{selectedSeva.maxDonation?.toLocaleString() || 'N/A'}
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Timing Blocks */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Timing Blocks</h3>
              <div className="space-y-3">
                {selectedSeva.timingBlocks.map((block, index) => (
                  <div key={block.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Days</label>
                        <p className="text-sm font-semibold text-gray-900">
                          {block.applicableDays.join(', ')}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                        <p className="text-sm font-semibold text-gray-900">
                          {block.startTime} - {block.endTime}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Effective From</label>
                        <p className="text-sm text-gray-900">
                          {new Date(block.effectiveFromDate).toLocaleDateString()}
                        </p>
                      </div>
                      {block.effectiveTillDate && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Effective Till</label>
                          <p className="text-sm text-gray-900">
                            {new Date(block.effectiveTillDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slot Configuration */}
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Slot Configuration</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Slot Duration</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedSeva.slotDuration} min</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Auto Generate</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedSeva.autoGenerateSlots ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max Slots</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedSeva.maxSlots || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Booked Slots</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedSeva.bookingSlots || 0}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Available Slots</label>
                  <p className="text-sm font-semibold text-amber-600">
                    {getSlotInfo(selectedSeva).available}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Buffer Before</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedSeva.bufferTimeBeforeSlot} min</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Buffer After</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedSeva.bufferTimeAfterSlot} min</p>
                </div>
                {selectedSeva.slotsPerTiming && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Slots per Timing</label>
                    <p className="text-sm font-semibold text-gray-900">{selectedSeva.slotsPerTiming}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Capacity Rules */}
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Capacity Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max Devotees per Slot</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedSeva.maxDevoteesPerSlot}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max Bookings per Devotee/Day</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedSeva.maxBookingsPerDevoteePerDay}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max Total Bookings per Day</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedSeva.maxTotalBookingsPerDay}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Physical Location</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedSeva.physicalLocation}</p>
                </div>
              </div>
            </div>

            {/* Audit Information */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Audit Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Created By</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedSeva.createdBy}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Created On</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(selectedSeva.createdOn).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Draft Version</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedSeva.draftVersion}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </ModuleLayout>
  );
}

