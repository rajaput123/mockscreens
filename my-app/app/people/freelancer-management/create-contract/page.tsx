'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { ModernCard, ElevatedCard } from '../../components';
import CreateContractModal from '../components/CreateContractModal';
import { getAllContracts, Contract, getAllFreelancers } from '../../peopleData';
import { loadContracts, saveContracts, loadFreelancers } from '../../utils/dataStorage';

export default function CreateContractPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);

  // Load contracts from localStorage on mount
  useEffect(() => {
    const staticContracts = getAllContracts();
    const loadedContracts = loadContracts(staticContracts);
    setContracts(loadedContracts);
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.freelancerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (data: any) => {
    // Get freelancers from localStorage (includes newly added ones)
    const staticFreelancers = getAllFreelancers();
    const allFreelancers = loadFreelancers(staticFreelancers);
    const selectedFreelancer = allFreelancers.find((f) => f.id === data.freelancerId);
    if (!selectedFreelancer) return;

    const newContract: Contract = {
      id: `CONTRACT${Date.now()}`,
      freelancerId: data.freelancerId,
      freelancerName: selectedFreelancer.name,
      contractType: data.contractType,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      status: 'active',
      rate: data.rate,
      description: data.description,
    };

    const updatedContracts = [...contracts, newContract];
    setContracts(updatedContracts);
    saveContracts(updatedContracts); // Save to localStorage
    setIsModalOpen(false);
    alert('Contract created successfully!');
  };

  return (
    <ModuleLayout
      title="Create Contract"
      description="Create new contracts for freelancers"
    >
      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-amber-600 text-white font-semibold transition-all hover:bg-amber-700 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          + Create New Contract
        </button>
      </div>

      {/* Search and Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>
      </ModernCard>

      {/* Contracts List */}
      {filteredContracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <ElevatedCard key={contract.id} elevation="lg" className="cursor-pointer hover:scale-105 transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{contract.freelancerName}</h3>
                    <p className="text-xs text-gray-500 mt-1">ID: {contract.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-medium ${
                    contract.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : contract.status === 'completed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {contract.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{contract.contractType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rate/Amount</p>
                    <p className="text-sm font-medium text-gray-900">
                      {contract.contractType === 'hourly' ? `₹${contract.rate}/hr` : `₹${contract.rate}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm text-gray-600">
                      {contract.startDate} {contract.endDate ? `- ${contract.endDate}` : '(Ongoing)'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Description</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{contract.description}</p>
                  </div>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 mb-4">No contracts found. Create your first contract using the button above.</p>
        </ModernCard>
      )}

      <CreateContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  );
}
