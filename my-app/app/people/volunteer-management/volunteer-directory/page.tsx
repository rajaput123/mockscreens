'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { ModernCard, ElevatedCard } from '../../components';
import { mockVolunteers } from '../mockData';
import { Volunteer } from '../types';

export default function VolunteerDirectoryPage() {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const volunteers = mockVolunteers;

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.email && v.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      v.volunteerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCardClick = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsDetailModalOpen(true);
  };

  return (
    <ModuleLayout
      title="Volunteer Directory"
      description="View all volunteers in table or card format"
    >
      {/* Search and Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>

          {/* View Toggle */}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Hours</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.length > 0 ? (
                  filteredVolunteers.map((volunteer) => (
                    <tr
                      key={volunteer.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                      onClick={() => handleCardClick(volunteer)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{volunteer.volunteerId}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{volunteer.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{volunteer.email || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{volunteer.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{volunteer.totalHours || 0} hrs</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-xl text-xs font-medium ${
                          volunteer.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : volunteer.status === 'temporary'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {volunteer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(volunteer);
                          }}
                          className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No volunteers found matching your criteria.
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
          {filteredVolunteers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVolunteers.map((volunteer) => (
                <ElevatedCard
                  key={volunteer.id}
                  onClick={() => handleCardClick(volunteer)}
                  elevation="lg"
                  className="cursor-pointer hover:scale-105 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{volunteer.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">ID: {volunteer.volunteerId}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                        volunteer.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : volunteer.status === 'temporary'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {volunteer.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {volunteer.email && (
                        <p className="text-xs text-gray-600 truncate">{volunteer.email}</p>
                      )}
                      <p className="text-xs text-gray-600">{volunteer.phone}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-900">
                        {volunteer.totalHours || 0} hrs
                      </span>
                      {volunteer.eventName && (
                        <span className="text-xs text-amber-600 truncate max-w-[120px]">
                          {volunteer.eventName}
                        </span>
                      )}
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
                {searchTerm || filterStatus !== 'all'
                  ? 'No volunteers found matching your criteria.'
                  : 'No volunteers available.'}
              </p>
            </ModernCard>
          )}
        </>
      )}

      {/* Volunteer Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedVolunteer?.name}
        size="md"
      >
        {selectedVolunteer && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Volunteer ID</p>
                <p className="text-sm font-semibold text-gray-900">{selectedVolunteer.volunteerId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium ${
                  selectedVolunteer.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : selectedVolunteer.status === 'temporary'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedVolunteer.status}
                </span>
              </div>
              {selectedVolunteer.email && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedVolunteer.email}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="text-sm font-semibold text-gray-900">{selectedVolunteer.phone}</p>
              </div>
              {selectedVolunteer.totalHours !== undefined && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Hours</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedVolunteer.totalHours} hrs</p>
                </div>
              )}
              {selectedVolunteer.eventName && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Event</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedVolunteer.eventName}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}
