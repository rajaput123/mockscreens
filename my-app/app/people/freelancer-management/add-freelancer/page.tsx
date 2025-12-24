'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { ModernCard, ElevatedCard } from '../../components';
import AddFreelancerModal from '../components/AddFreelancerModal';
import { getAllFreelancers, Freelancer } from '../../peopleData';
import { loadFreelancers, saveFreelancers } from '../../utils/dataStorage';

export default function AddFreelancerPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  // Load freelancers from localStorage on mount
  useEffect(() => {
    const staticFreelancers = getAllFreelancers();
    const loadedFreelancers = loadFreelancers(staticFreelancers);
    setFreelancers(loadedFreelancers);
  }, []);

  const filteredFreelancers = freelancers.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.freelancerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = (data: any) => {
    const newFreelancer: Freelancer = {
      id: crypto.randomUUID(),
      freelancerId: data.freelancerId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      specialization: data.specialization,
      status: data.status,
      joinDate: data.joinDate,
      address: data.address || undefined,
      hourlyRate: data.hourlyRate > 0 ? data.hourlyRate : undefined,
      totalProjects: 0,
    };
    const updatedFreelancers = [...freelancers, newFreelancer];
    setFreelancers(updatedFreelancers);
    saveFreelancers(updatedFreelancers); // Save to localStorage
    setIsAddModalOpen(false);
    alert('Freelancer added successfully!');
  };

  const handleUpdate = (data: any) => {
    if (!selectedFreelancer) return;
    const updatedFreelancers = freelancers.map(f => 
      f.id === selectedFreelancer.id 
        ? { ...f, ...data, hourlyRate: data.hourlyRate > 0 ? data.hourlyRate : undefined }
        : f
    );
    setFreelancers(updatedFreelancers);
    saveFreelancers(updatedFreelancers); // Save to localStorage
    setIsEditModalOpen(false);
    setSelectedFreelancer(null);
    alert('Freelancer updated successfully!');
  };

  const handleEdit = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
    setIsEditModalOpen(true);
  };

  const handleView = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
    setIsDetailModalOpen(true);
  };

  return (
    <ModuleLayout
      title="Add / Manage Freelancer"
      description="Add new freelancers or update existing ones"
    >
      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-amber-600 text-white font-semibold transition-all hover:bg-amber-700 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          + Add New Freelancer
        </button>
      </div>

      {/* Search and Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search freelancers..."
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
              <option value="on-contract">On Contract</option>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Specialization</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFreelancers.length > 0 ? (
                  filteredFreelancers.map((freelancer) => (
                    <tr
                      key={freelancer.id}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{freelancer.freelancerId}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{freelancer.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{freelancer.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{freelancer.specialization}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-xl text-xs font-medium ${
                          freelancer.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : freelancer.status === 'on-contract'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {freelancer.status === 'on-contract' ? 'On Contract' : freelancer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(freelancer)}
                            className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(freelancer)}
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
                      No freelancers found. Add your first freelancer using the button above.
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
          {filteredFreelancers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFreelancers.map((freelancer) => (
                <ElevatedCard
                  key={freelancer.id}
                  onClick={() => handleView(freelancer)}
                  elevation="lg"
                  className="cursor-pointer hover:scale-105 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{freelancer.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">ID: {freelancer.freelancerId}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        freelancer.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : freelancer.status === 'on-contract'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {freelancer.status === 'on-contract' ? 'On Contract' : freelancer.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">{freelancer.email}</p>
                      <p className="text-sm font-medium text-gray-900">{freelancer.specialization}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      {freelancer.hourlyRate && (
                        <span className="text-sm text-gray-600">₹{freelancer.hourlyRate}/hr</span>
                      )}
                      {freelancer.totalProjects !== undefined && (
                        <span className="text-sm text-amber-600">{freelancer.totalProjects} projects</span>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(freelancer);
                        }}
                        className="flex-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(freelancer);
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600">
                No freelancers found. Add your first freelancer using the button above.
              </p>
            </ModernCard>
          )}
        </>
      )}

      {/* Add Modal */}
      <AddFreelancerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
      />

      {/* Edit Modal */}
      {selectedFreelancer && (
        <AddFreelancerModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedFreelancer(null);
          }}
          onSubmit={handleUpdate}
          initialData={{
            freelancerId: selectedFreelancer.freelancerId,
            name: selectedFreelancer.name,
            email: selectedFreelancer.email,
            phone: selectedFreelancer.phone,
            specialization: selectedFreelancer.specialization,
            status: selectedFreelancer.status,
            joinDate: selectedFreelancer.joinDate,
            address: selectedFreelancer.address || '',
            hourlyRate: selectedFreelancer.hourlyRate || 0,
          }}
        />
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedFreelancer(null);
        }}
        title={selectedFreelancer?.name}
        size="md"
      >
        {selectedFreelancer && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Freelancer ID</p>
                <p className="text-sm font-semibold text-gray-900">{selectedFreelancer.freelancerId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium ${
                  selectedFreelancer.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : selectedFreelancer.status === 'on-contract'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedFreelancer.status === 'on-contract' ? 'On Contract' : selectedFreelancer.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-semibold text-gray-900">{selectedFreelancer.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="text-sm font-semibold text-gray-900">{selectedFreelancer.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Specialization</p>
                <p className="text-sm font-semibold text-gray-900">{selectedFreelancer.specialization}</p>
              </div>
              {selectedFreelancer.hourlyRate && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Hourly Rate</p>
                  <p className="text-sm font-semibold text-gray-900">₹{selectedFreelancer.hourlyRate}/hr</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">Join Date</p>
                <p className="text-sm font-semibold text-gray-900">{selectedFreelancer.joinDate}</p>
              </div>
              {selectedFreelancer.totalProjects !== undefined && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Projects</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedFreelancer.totalProjects}</p>
                </div>
              )}
              {selectedFreelancer.address && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedFreelancer.address}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}

