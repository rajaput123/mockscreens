'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography } from '../../../design-system';
import { getAllFreelancers, Freelancer } from '../../peopleData';
import { loadFreelancers } from '../../utils/dataStorage';

export default function FreelancerDirectoryPage() {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSpecialization, setFilterSpecialization] = useState<string>('all');
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);

  // Load freelancers from localStorage on mount
  useEffect(() => {
    const staticFreelancers = getAllFreelancers();
    const loadedFreelancers = loadFreelancers(staticFreelancers);
    setFreelancers(loadedFreelancers);
  }, []);
  const uniqueSpecializations = Array.from(new Set(freelancers.map(f => f.specialization))).filter(Boolean);

  const filteredFreelancers = freelancers.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.freelancerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
    const matchesSpecialization = filterSpecialization === 'all' || f.specialization === filterSpecialization;
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  const handleCardClick = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
    setIsDetailModalOpen(true);
  };

  return (
    <ModuleLayout
      title="Freelancer Directory"
      description="View all freelancers in table or card format"
    >
      {/* Search and Filters */}
      <div
        className="rounded-3xl p-6 mb-6"
        style={{
          backgroundColor: colors.background.base,
          border: `1px solid ${colors.border}`,
          padding: spacing.xl,
        }}
      >
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            />
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-contract">On Contract</option>
            </select>
          </div>

          {/* Specialization Filter */}
          <div className="w-full md:w-48">
            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              <option value="all">All Specializations</option>
              {uniqueSpecializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-2xl border transition-all ${
                viewMode === 'table' ? 'bg-amber-600 text-white border-amber-600' : 'border-gray-300'
              }`}
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-2xl border transition-all ${
                viewMode === 'cards' ? 'bg-amber-600 text-white border-amber-600' : 'border-gray-300'
              }`}
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            backgroundColor: colors.background.base,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    backgroundColor: colors.background.subtle,
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <th
                    className="px-6 py-4 text-left"
                    style={{
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    ID
                  </th>
                  <th
                    className="px-6 py-4 text-left"
                    style={{
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-4 text-left"
                    style={{
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Email
                  </th>
                  <th
                    className="px-6 py-4 text-left"
                    style={{
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Phone
                  </th>
                  <th
                    className="px-6 py-4 text-left"
                    style={{
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Specialization
                  </th>
                  <th
                    className="px-6 py-4 text-left"
                    style={{
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-4 text-left"
                    style={{
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFreelancers.length > 0 ? (
                  filteredFreelancers.map((freelancer) => (
                    <tr
                      key={freelancer.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                      onClick={() => handleCardClick(freelancer)}
                    >
                      <td
                        className="px-6 py-4"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {freelancer.freelancerId}
                      </td>
                      <td
                        className="px-6 py-4"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                          fontWeight: 500,
                        }}
                      >
                        {freelancer.name}
                      </td>
                      <td
                        className="px-6 py-4"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.muted,
                        }}
                      >
                        {freelancer.email}
                      </td>
                      <td
                        className="px-6 py-4"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.muted,
                        }}
                      >
                        {freelancer.phone}
                      </td>
                      <td
                        className="px-6 py-4"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {freelancer.specialization}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 rounded-xl text-xs"
                          style={{
                            backgroundColor:
                              freelancer.status === 'active'
                                ? colors.success.light
                                : freelancer.status === 'on-contract'
                                ? colors.primary.light
                                : colors.error.light,
                            color:
                              freelancer.status === 'active'
                                ? colors.success.dark
                                : freelancer.status === 'on-contract'
                                ? colors.primary.dark
                                : colors.error.dark,
                            fontFamily: typography.body.fontFamily,
                            fontWeight: 500,
                          }}
                        >
                          {freelancer.status === 'on-contract' ? 'On Contract' : freelancer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(freelancer);
                          }}
                          className="text-amber-600 hover:text-amber-700"
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center"
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.muted,
                      }}
                    >
                      No freelancers found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <>
          {filteredFreelancers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFreelancers.map((freelancer) => (
                <div
                  key={freelancer.id}
                  onClick={() => handleCardClick(freelancer)}
                  className="rounded-3xl p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: colors.background.base,
                    border: `1px solid ${colors.border}`,
                    padding: spacing.xl,
                  }}
                >
                  <div className="space-y-2">
                    <h3
                      style={{
                        fontFamily: typography.sectionHeader.fontFamily,
                        fontSize: typography.sectionHeader.fontSize,
                        fontWeight: typography.sectionHeader.fontWeight,
                        color: colors.text.primary,
                      }}
                    >
                      {freelancer.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '12px',
                        color: colors.text.muted,
                      }}
                    >
                      ID: {freelancer.freelancerId}
                    </p>
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.primary,
                      }}
                    >
                      {freelancer.specialization}
                    </p>
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '12px',
                        color: colors.text.muted,
                      }}
                    >
                      {freelancer.email}
                    </p>
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '12px',
                        color: colors.text.muted,
                      }}
                    >
                      {freelancer.phone}
                    </p>
                    {freelancer.hourlyRate && (
                      <p
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          color: colors.text.primary,
                          fontWeight: 500,
                        }}
                      >
                        ₹{freelancer.hourlyRate}/hr
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className="inline-block px-3 py-1 rounded-xl text-xs"
                        style={{
                          backgroundColor:
                            freelancer.status === 'active'
                              ? colors.success.light
                              : freelancer.status === 'on-contract'
                              ? colors.primary.light
                              : colors.error.light,
                          color:
                            freelancer.status === 'active'
                              ? colors.success.dark
                              : freelancer.status === 'on-contract'
                              ? colors.primary.dark
                              : colors.error.dark,
                          fontFamily: typography.body.fontFamily,
                          fontWeight: 500,
                        }}
                      >
                        {freelancer.status === 'on-contract' ? 'On Contract' : freelancer.status}
                      </span>
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          color: colors.text.muted,
                        }}
                      >
                        Joined: {freelancer.joinDate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="rounded-3xl p-12 text-center"
              style={{
                backgroundColor: colors.background.base,
                border: `1px solid ${colors.border}`,
                padding: spacing.xl,
              }}
            >
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.muted,
                }}
              >
                {searchTerm || filterStatus !== 'all' || filterSpecialization !== 'all'
                  ? 'No freelancers found matching your criteria.'
                  : 'No freelancers available.'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Freelancer Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedFreelancer?.name}
        size="md"
      >
        {selectedFreelancer && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                    marginBottom: spacing.xs,
                  }}
                >
                  Freelancer ID
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedFreelancer.freelancerId}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                    marginBottom: spacing.xs,
                  }}
                >
                  Specialization
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedFreelancer.specialization}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                    marginBottom: spacing.xs,
                  }}
                >
                  Status
                </p>
                <span
                  className="inline-block px-3 py-1 rounded-xl"
                  style={{
                    backgroundColor:
                      selectedFreelancer.status === 'active'
                        ? colors.success.light
                        : selectedFreelancer.status === 'on-contract'
                        ? colors.primary.light
                        : colors.error.light,
                    color:
                      selectedFreelancer.status === 'active'
                        ? colors.success.dark
                        : selectedFreelancer.status === 'on-contract'
                        ? colors.primary.dark
                        : colors.error.dark,
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {selectedFreelancer.status === 'on-contract' ? 'On Contract' : selectedFreelancer.status}
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                    marginBottom: spacing.xs,
                  }}
                >
                  Email
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedFreelancer.email}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                    marginBottom: spacing.xs,
                  }}
                >
                  Phone
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedFreelancer.phone}
                </p>
              </div>
              {selectedFreelancer.hourlyRate && (
                <div>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      color: colors.text.muted,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Hourly Rate
                  </p>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    ₹{selectedFreelancer.hourlyRate}/hr
                  </p>
                </div>
              )}
              {selectedFreelancer.totalProjects !== undefined && (
                <div>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      color: colors.text.muted,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Total Projects
                  </p>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    {selectedFreelancer.totalProjects}
                  </p>
                </div>
              )}
              <div>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                    marginBottom: spacing.xs,
                  }}
                >
                  Join Date
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedFreelancer.joinDate}
                </p>
              </div>
              {selectedFreelancer.address && (
                <div className="col-span-2">
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      color: colors.text.muted,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Address
                  </p>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    {selectedFreelancer.address}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}

