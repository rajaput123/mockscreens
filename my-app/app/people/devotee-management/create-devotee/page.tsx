'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { ModernCard, ElevatedCard } from '../../components';
import CreateDevoteeModal from '../components/CreateDevoteeModal';
import { getAllDevotees, Devotee } from '../../peopleData';
import { loadDevotees, saveDevotees } from '../../utils/dataStorage';

export default function CreateDevoteePage() {
  const [devotees, setDevotees] = useState<Devotee[]>([]);

  // Load devotees from localStorage on mount
  useEffect(() => {
    const staticDevotees = getAllDevotees();
    const loadedDevotees = loadDevotees(staticDevotees);
    setDevotees(loadedDevotees);
  }, []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDevotee, setSelectedDevotee] = useState<Devotee | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const filteredDevotees = devotees.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.devoteeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = (data: any) => {
    const newDevotee: Devotee = {
      id: crypto.randomUUID(),
      devoteeId: data.devoteeId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      status: data.status,
      registrationDate: data.registrationDate,
      visitCount: 0,
      isVIP: false,
    };
    const updatedDevotees = [...devotees, newDevotee];
    setDevotees(updatedDevotees);
    saveDevotees(updatedDevotees); // Save to localStorage
    setIsAddModalOpen(false);
    alert('Devotee created successfully!');
  };

  const handleUpdate = (data: any) => {
    if (!selectedDevotee) return;
    const updatedDevotees = devotees.map(d => 
      d.id === selectedDevotee.id 
        ? { ...d, ...data }
        : d
    );
    setDevotees(updatedDevotees);
    saveDevotees(updatedDevotees); // Save to localStorage
    setIsEditModalOpen(false);
    setSelectedDevotee(null);
    alert('Devotee updated successfully!');
  };

  const handleEdit = (devotee: Devotee) => {
    setSelectedDevotee(devotee);
    setIsEditModalOpen(true);
  };

  const handleView = (devotee: Devotee) => {
    setSelectedDevotee(devotee);
    setIsDetailModalOpen(true);
  };

  return (
    <ModuleLayout
      title="Create / Update Devotee"
      description="Create or update devotee information"
    >
      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-amber-600 text-white font-semibold transition-all hover:bg-amber-700 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          + Add New Devotee
        </button>
      </div>

      {/* Search and Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search devotees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-2xl border transition-all font-medium ${
                viewMode === 'table'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-2xl border transition-all font-medium ${
                viewMode === 'cards'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </ModernCard>

      {/* Table View */}
      {viewMode === 'table' && (
        <ElevatedCard elevation="lg" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevotees.length > 0 ? (
                  filteredDevotees.map((devotee) => (
                    <tr
                      key={devotee.id}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{devotee.devoteeId}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{devotee.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{devotee.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{devotee.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-xl text-xs font-medium ${
                          devotee.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {devotee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(devotee)}
                            className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(devotee)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No devotees found. Create your first devotee using the button above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ElevatedCard>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <>
          {filteredDevotees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDevotees.map((devotee) => (
                <ElevatedCard
                  key={devotee.id}
                  onClick={() => handleView(devotee)}
                  elevation="lg"
                  className="cursor-pointer hover:scale-105 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{devotee.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">ID: {devotee.devoteeId}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        devotee.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {devotee.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">{devotee.email}</p>
                      <p className="text-xs text-gray-600">{devotee.phone}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      {devotee.visitCount !== undefined && (
                        <span className="text-sm text-gray-600">{devotee.visitCount} visits</span>
                      )}
                      {devotee.isVIP && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                          VIP
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(devotee);
                        }}
                        className="flex-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(devotee);
                        }}
                        className="flex-1 px-3 py-1 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-sm font-medium transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </ElevatedCard>
              ))}
            </div>
          ) : (
            <ModernCard elevation="md" className="text-center p-12">
              <svg
                className="mx-auto mb-4 w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-600">
                No devotees found. Create your first devotee using the button above.
              </p>
            </ModernCard>
          )}
        </>
      )}

      {/* Create Modal */}
      <CreateDevoteeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
      />

      {/* Edit Modal */}
      {selectedDevotee && (
        <CreateDevoteeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDevotee(null);
          }}
          onSubmit={handleUpdate}
          initialData={{
            devoteeId: selectedDevotee.devoteeId,
            name: selectedDevotee.name,
            email: selectedDevotee.email,
            phone: selectedDevotee.phone,
            address: selectedDevotee.address,
            status: selectedDevotee.status,
            registrationDate: selectedDevotee.registrationDate,
          }}
        />
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDevotee(null);
        }}
        title={selectedDevotee?.name}
        size="md"
      >
        {selectedDevotee && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Devotee ID</p>
                <p className="text-sm font-semibold text-gray-900">{selectedDevotee.devoteeId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium ${
                  selectedDevotee.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedDevotee.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-semibold text-gray-900">{selectedDevotee.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="text-sm font-semibold text-gray-900">{selectedDevotee.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Registration Date</p>
                <p className="text-sm font-semibold text-gray-900">{selectedDevotee.registrationDate}</p>
              </div>
              {selectedDevotee.visitCount !== undefined && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Visit Count</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedDevotee.visitCount}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-sm font-semibold text-gray-900">{selectedDevotee.address}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}
