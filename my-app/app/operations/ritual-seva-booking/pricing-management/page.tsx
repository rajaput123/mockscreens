'use client';

import { useState, useEffect, useMemo } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { getAllSevas, saveSeva, type Seva } from '../sevaData';

export default function PricingManagementPage() {
  const [sevas, setSevas] = useState<Seva[]>([]);
  const [selectedSeva, setSelectedSeva] = useState<Seva | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPrice, setEditingPrice] = useState<{basePrice?: number; originalPrice?: number} | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSevas();
  }, []);

  const loadSevas = () => {
    setSevas(getAllSevas());
  };

  const filteredSevas = useMemo(() => {
    return sevas.filter(seva =>
      seva.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (seva.deityName || seva.templeName)?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sevas, searchTerm]);

  const handleSevaSelect = (seva: Seva) => {
    setSelectedSeva(seva);
    setEditingPrice({
      basePrice: seva.basePrice,
      originalPrice: (seva as any).originalPrice || seva.basePrice,
    });
  };

  const handlePriceUpdate = async () => {
    if (!selectedSeva || !editingPrice) return;

    setIsSaving(true);
    
    const updatedSeva: Seva = {
      ...selectedSeva,
      basePrice: editingPrice.basePrice,
      originalPrice: editingPrice.originalPrice,
    };

    saveSeva(updatedSeva);
    loadSevas();
    setSelectedSeva(updatedSeva);
    setIsSaving(false);
    
    // Show success message
    alert('Pricing updated successfully!');
  };

  const calculateDiscount = (seva: Seva) => {
    const original = (seva as any).originalPrice || seva.basePrice || 0;
    const current = seva.basePrice || 0;
    if (original === 0 || original === current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const stats = useMemo(() => {
    const totalSevas = sevas.length;
    const freeSevas = sevas.filter(s => s.isFree).length;
    const paidSevas = totalSevas - freeSevas;
    const totalRevenue = sevas
      .filter(s => !s.isFree)
      .reduce((sum, s) => sum + ((s as any).bookingSlots || 0) * (s.basePrice || 0), 0);
    
    return { totalSevas, freeSevas, paidSevas, totalRevenue };
  }, [sevas]);

  return (
    <ModuleLayout
      title="Pricing Management"
      description="Manage pricing, discounts, and donation settings for all sevas"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Total Sevas</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalSevas}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Free Sevas</p>
          <p className="text-2xl font-bold text-amber-600">{stats.freeSevas}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Paid Sevas</p>
          <p className="text-2xl font-bold text-amber-600">{stats.paidSevas}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Est. Revenue</p>
          <p className="text-2xl font-bold text-amber-600">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seva List */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
            {/* Search Bar */}
            <div className="mb-6">
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
            </div>

            {/* Seva Cards */}
            <div className="space-y-4">
              {filteredSevas.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600">No sevas found matching your search</p>
                </div>
              ) : (
                filteredSevas.map((seva) => {
                  const discount = calculateDiscount(seva);
                  
                  return (
                    <div
                      key={seva.id}
                      onClick={() => handleSevaSelect(seva)}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                        selectedSeva?.id === seva.id
                          ? 'bg-amber-50 border-amber-400 shadow-md scale-[1.02]'
                          : 'bg-white border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{seva.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{seva.deityName || seva.templeName}</p>
                          
                          <div className="flex items-center gap-4 flex-wrap">
                            {seva.isFree ? (
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg border border-amber-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-semibold">Free</span>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-gray-900">
                                    ₹{seva.basePrice?.toLocaleString() || 0}
                                  </span>
                                  {(seva as any).originalPrice && (seva as any).originalPrice !== seva.basePrice && (
                                    <>
                                      <span className="text-lg text-gray-400 line-through">
                                        ₹{(seva as any).originalPrice.toLocaleString()}
                                      </span>
                                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">
                                        {discount}% OFF
                                      </span>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <svg className={`w-6 h-6 transition-transform ${selectedSeva?.id === seva.id ? 'text-amber-600 rotate-90' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Pricing Details Panel */}
        <div className="lg:col-span-1">
          {selectedSeva ? (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing Details</h2>
              
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{selectedSeva.name}</h3>
                  <p className="text-sm text-gray-600">{selectedSeva.deityName || selectedSeva.templeName}</p>
                </div>

                {selectedSeva.isFree ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-amber-700 font-semibold">This seva is free</p>
                    </div>
                    <p className="text-sm text-amber-600">No pricing configuration needed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Original Price (₹)
                      </label>
                      <input
                        type="number"
                        value={editingPrice?.originalPrice || ''}
                        onChange={(e) => setEditingPrice({
                          ...editingPrice,
                          originalPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                        })}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                        placeholder="Enter original price"
                        min="0"
                        step="0.01"
                      />
                      <p className="text-xs text-gray-500 mt-1">Base price before any discounts</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={editingPrice?.basePrice || ''}
                        onChange={(e) => setEditingPrice({
                          ...editingPrice,
                          basePrice: e.target.value ? parseFloat(e.target.value) : undefined,
                        })}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                        placeholder="Enter current price"
                        required
                        min="0"
                        step="0.01"
                      />
                      <p className="text-xs text-gray-500 mt-1">Price shown to devotees</p>
                    </div>

                    {editingPrice?.originalPrice && editingPrice?.basePrice && 
                     editingPrice.originalPrice > editingPrice.basePrice && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-red-700">Discount Applied</span>
                          <span className="text-lg font-bold text-red-700">
                            {calculateDiscount({
                              ...selectedSeva,
                              basePrice: editingPrice.basePrice,
                              originalPrice: editingPrice.originalPrice,
                            })}% OFF
                          </span>
                        </div>
                        <p className="text-xs text-red-600 mt-1">
                          Savings: ₹{(editingPrice.originalPrice - editingPrice.basePrice).toLocaleString()}
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Donation Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <input
                            type="checkbox"
                            checked={selectedSeva.allowDonation}
                            readOnly
                            className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                          />
                          <span className="text-sm text-gray-700">Allow Donation</span>
                        </div>
                        
                        {selectedSeva.allowDonation && (
                          <div className="space-y-2 pl-7">
                            <div className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg">
                              <span className="text-xs text-gray-600">Min Donation</span>
                              <span className="text-sm font-semibold text-gray-900">₹{selectedSeva.minDonation?.toLocaleString() || 0}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg">
                              <span className="text-xs text-gray-600">Max Donation</span>
                              <span className="text-sm font-semibold text-gray-900">₹{selectedSeva.maxDonation?.toLocaleString() || 0}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handlePriceUpdate}
                      disabled={isSaving || !editingPrice?.basePrice}
                      className="w-full py-3 px-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSaving ? 'Saving...' : 'Update Pricing'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center shadow-sm">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 font-medium">Select a seva to manage pricing</p>
            </div>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
}
