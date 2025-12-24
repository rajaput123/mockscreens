'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { ModernCard, ElevatedCard } from '../../components';
import ContentEditorModal from '../components/ContentEditorModal';
import { getAllTemples } from '../../../operations/temple-management/templeData';

// Temple interface from temple management
type Temple = {
  id: string;
  name: string;
  location: string;
  description: string;
  type: 'parent' | 'child';
  parentTempleId?: string;
  parentTempleName?: string;
  status: 'active' | 'inactive';
  totalSevas: number;
  childTemples?: string[];
  image: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  openingTime?: string;
  closingTime?: string;
  establishedDate?: string;
  deity?: string;
  capacity?: number;
};

export default function EditTempleContentPage() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Load temples on mount
  useEffect(() => {
    const allTemples = getAllTemples();
    setTemples(allTemples);
  }, []);

  const filteredTemples = temples.filter((temple) => {
    const matchesSearch = 
      temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      temple.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (temple.description && temple.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || temple.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleEdit = (temple: Temple) => {
    setSelectedTemple(temple);
    setIsEditModalOpen(true);
  };

  const handleView = (temple: Temple) => {
    setSelectedTemple(temple);
    setIsDetailModalOpen(true);
  };

  const handleSave = (data: { title: string; content: string; type: any; language: string }) => {
    if (!selectedTemple) return;
    
    // Update temple description in localStorage
    const storedTemples = localStorage.getItem('temples');
    let updatedTemples: Temple[] = [];
    
    if (storedTemples) {
      try {
        updatedTemples = JSON.parse(storedTemples);
      } catch (e) {
        console.error('Error parsing temples:', e);
        updatedTemples = getAllTemples();
      }
    } else {
      updatedTemples = getAllTemples();
    }

    const templeIndex = updatedTemples.findIndex(t => t.id === selectedTemple.id);
    if (templeIndex !== -1) {
      updatedTemples[templeIndex] = {
        ...updatedTemples[templeIndex],
        description: data.content,
      };
    } else {
      updatedTemples.push({
        ...selectedTemple,
        description: data.content,
      });
    }

    localStorage.setItem('temples', JSON.stringify(updatedTemples));
    
    // Update local state
    setTemples(updatedTemples);
    setIsEditModalOpen(false);
    setSelectedTemple(null);
    alert('Temple content updated successfully!');
  };

  return (
    <ModuleLayout
      title="Edit Temple Content"
      description="Edit temple descriptions, history, and information"
    >
      {/* Search and Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search temples by name, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm bg-white"
          >
            <option value="all">All Temples</option>
            <option value="parent">Parent Temples</option>
            <option value="child">Child Temples</option>
          </select>
        </div>
      </ModernCard>

      {/* Temple List */}
      {filteredTemples.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemples.map((temple) => (
            <ElevatedCard
              key={temple.id}
              elevation="lg"
              className="hover:scale-105 transition-all cursor-pointer"
              onClick={() => handleView(temple)}
            >
              <div className="space-y-3">
                {temple.image && (
                  <img
                    src={temple.image}
                    alt={temple.name}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{temple.name}</h3>
                    <p className="text-xs text-gray-500">{temple.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-medium ${
                    temple.type === 'parent'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {temple.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {temple.description || 'No description available. Click to add one.'}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <span>{temple.deity || 'N/A'}</span>
                  <span className={`px-2 py-1 rounded-lg ${
                    temple.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {temple.status}
                  </span>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(temple);
                    }}
                    className="flex-1 px-3 py-1 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-sm font-medium transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(temple);
                    }}
                    className="flex-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition-colors"
                  >
                    Edit Content
                  </button>
                </div>
              </div>
            </ElevatedCard>
          ))}
        </div>
      ) : (
        <ModernCard elevation="md" className="text-center p-12">
          <p className="text-gray-600">
            No temples found. Please add temples first in Temple Management.
          </p>
        </ModernCard>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTemple(null);
        }}
        title={selectedTemple?.name}
        size="lg"
      >
        {selectedTemple && (
          <div className="space-y-6">
            {selectedTemple.image && (
              <img
                src={selectedTemple.image}
                alt={selectedTemple.name}
                className="w-full h-64 object-cover rounded-xl"
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-sm font-semibold text-gray-900">{selectedTemple.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium ${
                  selectedTemple.type === 'parent'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {selectedTemple.type}
                </span>
              </div>
              {selectedTemple.deity && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Deity</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedTemple.deity}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium ${
                  selectedTemple.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedTemple.status}
                </span>
              </div>
              {selectedTemple.openingTime && selectedTemple.closingTime && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Timings</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedTemple.openingTime} - {selectedTemple.closingTime}
                  </p>
                </div>
              )}
              {selectedTemple.establishedDate && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Established</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedTemple.establishedDate}</p>
                </div>
              )}
              {selectedTemple.contactPhone && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedTemple.contactPhone}</p>
                </div>
              )}
              {selectedTemple.contactEmail && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedTemple.contactEmail}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Description</p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-700">
                  {selectedTemple.description || 'No description available. Click "Edit Content" to add one.'}
                </p>
              </div>
            </div>
            {selectedTemple.address && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-sm font-semibold text-gray-900">{selectedTemple.address}</p>
              </div>
            )}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleEdit(selectedTemple);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-medium transition-colors"
              >
                Edit Content
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      {selectedTemple && (
        <ContentEditorModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTemple(null);
          }}
          onSave={handleSave}
          initialData={{
            title: `${selectedTemple.name} - Content`,
            content: selectedTemple.description || '',
            type: 'temple-information',
            language: 'en',
          }}
        />
      )}
    </ModuleLayout>
  );
}

