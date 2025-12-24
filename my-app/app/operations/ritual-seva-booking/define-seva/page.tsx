'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import SevaFormModal from './SevaFormModal';
import { 
  type Seva, 
  getAllSevas,
  deleteSeva,
  getSevaById,
  saveSeva
} from '../sevaData';

export default function DefineSevaPage() {
  const router = useRouter();
  const [sevas, setSevas] = useState<Seva[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSeva, setEditingSeva] = useState<Seva | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sevaToDelete, setSevaToDelete] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft'>('all');

  useEffect(() => {
    loadSevas();
  }, []);

  const loadSevas = () => {
    const allSevas = getAllSevas();
    setSevas(allSevas);
  };

  const handleAddSeva = () => {
    setEditingSeva(null);
    setShowModal(true);
  };

  const handleEditSeva = (sevaId: string) => {
    const seva = getSevaById(sevaId);
    if (seva) {
      setEditingSeva(seva);
      setShowModal(true);
    }
  };

  const handleDeleteClick = (sevaId: string) => {
    setSevaToDelete(sevaId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (sevaToDelete) {
      deleteSeva(sevaToDelete);
      setSevaToDelete(null);
      setShowDeleteModal(false);
      loadSevas();
    }
  };

  const handleImageUpload = (sevaId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const base64String = reader.result as string;
        console.log('Image read successfully, length:', base64String.length);
        console.log('Image starts with:', base64String.substring(0, 30));
        
        const seva = getSevaById(sevaId);
        if (seva) {
          // Save image directly to localStorage first with the correct key
          const imageKey = `seva-image-${sevaId}`;
          try {
            // Verify the base64 string is valid
            if (!base64String.startsWith('data:image/')) {
              console.error('Invalid image format:', base64String.substring(0, 50));
              alert('Invalid image format. Please try another image.');
              return;
            }
            
            localStorage.setItem(imageKey, base64String);
            console.log('Image saved to localStorage with key:', imageKey);
            
            // Verify it was saved
            const saved = localStorage.getItem(imageKey);
            if (!saved || saved.length < 100) {
              console.error('Image not saved correctly to localStorage');
              alert('Error saving image. Please try again.');
              return;
            }
            
            // Then update the seva object and save
            const updatedSeva: Seva = {
              ...seva,
              image: base64String,
            };
            saveSeva(updatedSeva);
            
            // Force reload to ensure image is displayed
            // Use a small delay to ensure localStorage is updated
            setTimeout(() => {
              const reloadedSevas = getAllSevas();
              const reloadedSeva = reloadedSevas.find(s => s.id === sevaId);
              console.log('After reload - seva image exists:', !!reloadedSeva?.image);
              console.log('After reload - image length:', reloadedSeva?.image?.length || 0);
              setSevas(reloadedSevas);
            }, 100);
          } catch (error) {
            console.error('Error saving image:', error);
            alert('Error saving image. Please try again.');
          }
        }
      }
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      alert('Error reading image file. Please try again.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingSeva(null);
  };

  const handleSuccess = () => {
    loadSevas();
    setShowModal(false);
    setEditingSeva(null);
  };

  const getSlotInfo = (seva: Seva) => {
    const maxSlots = (seva as any).maxSlots;
    const bookingSlots = (seva as any).bookingSlots || 0;
    if (maxSlots) {
      const available = parseInt(maxSlots.toString()) - parseInt(bookingSlots.toString());
      return {
        max: maxSlots,
        booked: bookingSlots,
        available: available
      };
    }
    return null;
  };

  const filteredSevas = filterStatus === 'all' 
    ? sevas 
    : sevas.filter(s => s.status === filterStatus);

  return (
    <ModuleLayout
      title="Manage Sevas"
      description="Create, edit, and manage sevas and darshan services"
      action={
        <button
          onClick={handleAddSeva}
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Seva
        </button>
      }
    >

      {/* Filter Tabs */}
      <div className="mb-6 bg-white rounded-xl border-2 border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 mr-2">Filter:</span>
          {['all', 'active', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filterStatus === status
                  ? 'bg-amber-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)} ({status === 'all' ? sevas.length : status === 'active' ? sevas.filter(s => s.status === 'active').length : sevas.filter(s => s.status === 'draft').length})
            </button>
          ))}
        </div>
      </div>

      {/* Sevas Grid */}
      {filteredSevas.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-200 shadow-sm">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="h-10 w-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {filterStatus === 'all' ? 'No sevas created yet' : `No ${filterStatus} sevas`}
          </h3>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            {filterStatus === 'all' 
              ? 'Get started by creating your first seva to manage temple services and offerings'
              : `No ${filterStatus} sevas found. Try creating a new seva or changing the filter.`}
          </p>
          {filterStatus === 'all' && (
            <button
              onClick={handleAddSeva}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Seva
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSevas.map((seva) => {
            const slotInfo = getSlotInfo(seva);
            const originalPrice = (seva as any).originalPrice;
            
            return (
              <div 
                key={seva.id} 
                onClick={() => router.push(`/operations/ritual-seva-booking/seva-details?sevaId=${seva.id}`)}
                className="group bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-amber-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                {/* Image Section */}
                {seva.image ? (
                  <div className="mb-5 rounded-xl overflow-hidden relative bg-gray-100">
                    <img
                      key={`seva-img-${seva.id}-${seva.image?.length || 0}`}
                      src={seva.image}
                      alt={seva.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 bg-white"
                      style={{ minHeight: '192px' }}
                      onError={(e) => {
                        console.error('Image load error for seva:', seva.id);
                        console.error('Image data preview:', seva.image?.substring(0, 100));
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        // Show placeholder instead
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-48 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
                              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          `;
                        }
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully for seva:', seva.id);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'block';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <label 
                        className="cursor-pointer bg-white rounded-full p-3 shadow-2xl transition-all hover:scale-110 hover:bg-amber-50 opacity-0 group-hover:opacity-100" 
                        title="Replace image"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            e.stopPropagation();
                            handleImageUpload(seva.id, e);
                          }}
                          className="hidden"
                        />
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12m0 0l4-4m-4 4l-4 4" />
                        </svg>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="mb-5 rounded-xl overflow-hidden relative bg-gray-50 h-48 flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-amber-300 transition-colors">
                    <label 
                      className="cursor-pointer bg-white rounded-full p-4 shadow-lg transition-all hover:scale-110 hover:bg-amber-50 border-2 border-gray-200 group-hover:border-amber-300" 
                      title="Upload image"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          e.stopPropagation();
                          handleImageUpload(seva.id, e);
                        }}
                        className="hidden"
                      />
                      <svg className="w-8 h-8 text-gray-400 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12m0 0l4-4m-4 4l-4 4" />
                      </svg>
                    </label>
                  </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-1.5 truncate">{seva.name}</h3>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm text-gray-600 truncate">{seva.deityName || seva.templeName || 'Unknown Deity'}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 ml-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSeva(seva.id);
                      }}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all hover:scale-110 border border-transparent hover:border-amber-200"
                      title="Edit Seva"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(seva.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110 border border-transparent hover:border-red-200"
                      title="Delete Seva"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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
                              {Math.round(((originalPrice - (seva.basePrice || 0)) / originalPrice) * 100)}% OFF
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Slot Management */}
                  {slotInfo && (
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

      {/* Add/Edit Seva Modal */}
      <SevaFormModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        editingSeva={editingSeva}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 m-4 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Delete Seva</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSevaToDelete(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this seva? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSevaToDelete(null);
                }}
                className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium shadow-md hover:shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}
