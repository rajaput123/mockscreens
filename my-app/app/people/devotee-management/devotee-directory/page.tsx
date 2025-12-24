'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography, shadows, borders } from '../../../design-system';
import { getAllDevotees, Devotee } from '../../peopleData';
import { ModernCard, PrivacyNotice } from '../../components';
import { loadDevotees } from '../../utils/dataStorage';

export default function DevoteeDirectoryPage() {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVIP, setFilterVIP] = useState<string>('all');
  const [selectedDevotee, setSelectedDevotee] = useState<Devotee | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [devotees, setDevotees] = useState<Devotee[]>([]);

  // Load devotees from localStorage on mount
  useEffect(() => {
    const staticDevotees = getAllDevotees();
    const loadedDevotees = loadDevotees(staticDevotees);
    setDevotees(loadedDevotees);
  }, []);

  const filteredDevotees = devotees.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.devoteeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    const matchesVIP = filterVIP === 'all' || (filterVIP === 'yes' && d.isVIP) || (filterVIP === 'no' && !d.isVIP);
    return matchesSearch && matchesStatus && matchesVIP;
  });

  const handleCardClick = (devotee: Devotee) => {
    setSelectedDevotee(devotee);
    setIsDetailModalOpen(true);
  };

  return (
    <ModuleLayout
      title="Devotee Directory"
      description="View all devotees in table or card format"
    >
      {/* Privacy Notice */}
      <PrivacyNotice className="mb-6" />

      {/* Search and Filters */}
      <ModernCard elevation="md" className="mb-6">
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
            </select>
          </div>

          {/* VIP Filter */}
          <div className="w-full md:w-48">
            <select
              value={filterVIP}
              onChange={(e) => setFilterVIP(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              <option value="all">All Devotees</option>
              <option value="yes">VIP Only</option>
              <option value="no">Non-VIP</option>
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
      </ModernCard>

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
                    Visit Count
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
                    Last Visit
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
                {filteredDevotees.length > 0 ? (
                  filteredDevotees.map((devotee) => (
                    <tr
                      key={devotee.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                      onClick={() => handleCardClick(devotee)}
                    >
                      <td
                        className="px-6 py-4"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {devotee.devoteeId}
                          {devotee.isVIP && (
                            <span
                              className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold"
                              style={{
                                fontFamily: typography.body.fontFamily,
                              }}
                            >
                              VIP
                            </span>
                          )}
                        </div>
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
                        {devotee.name}
                      </td>
                      <td
                        className="px-6 py-4"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.muted,
                        }}
                      >
                        {devotee.email}
                      </td>
                      <td
                        className="px-6 py-4"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.muted,
                        }}
                      >
                        {devotee.phone}
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
                        {devotee.visitCount || 0}
                      </td>
                      <td
                        className="px-6 py-4"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.muted,
                        }}
                      >
                        {devotee.lastVisit || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 rounded-xl text-xs"
                          style={{
                            backgroundColor:
                              devotee.status === 'active'
                                ? colors.success.light
                                : colors.error.light,
                            color:
                              devotee.status === 'active'
                                ? colors.success.dark
                                : colors.error.dark,
                            fontFamily: typography.body.fontFamily,
                            fontWeight: 500,
                          }}
                        >
                          {devotee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(devotee);
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
                      colSpan={8}
                      className="px-6 py-12 text-center"
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.muted,
                      }}
                    >
                      No devotees found matching your criteria.
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
          {filteredDevotees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDevotees.map((devotee) => (
                <ModernCard
                  key={devotee.id}
                  onClick={() => handleCardClick(devotee)}
                  elevation="md"
                  className={devotee.isVIP ? 'border-2' : ''}
                  style={devotee.isVIP ? { borderColor: colors.primary.base } : undefined}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3
                        style={{
                          fontFamily: typography.sectionHeader.fontFamily,
                          fontSize: typography.sectionHeader.fontSize,
                          fontWeight: typography.sectionHeader.fontWeight,
                          color: colors.text.primary,
                        }}
                      >
                        {devotee.name}
                      </h3>
                      {devotee.isVIP && (
                        <span
                          className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold"
                          style={{
                            fontFamily: typography.body.fontFamily,
                          }}
                        >
                          VIP
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '12px',
                        color: colors.text.muted,
                      }}
                    >
                      ID: {devotee.devoteeId}
                    </p>
                    {/* Privacy-first: Only show minimal info */}
                    {devotee.lastVisit && (
                      <p
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          color: colors.text.muted,
                        }}
                      >
                        Last Visit: {new Date(devotee.lastVisit).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className="inline-block px-3 py-1 rounded-xl text-xs"
                        style={{
                          backgroundColor:
                            devotee.status === 'active'
                              ? colors.success.light
                              : colors.error.light,
                          color:
                            devotee.status === 'active'
                              ? colors.success.dark
                              : colors.error.dark,
                          fontFamily: typography.body.fontFamily,
                          fontWeight: 500,
                        }}
                      >
                        {devotee.status}
                      </span>
                      {devotee.visitCount !== undefined && (
                        <span
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '12px',
                            color: colors.text.muted,
                          }}
                        >
                          {devotee.visitCount} visits
                        </span>
                      )}
                    </div>
                  </div>
                </ModernCard>
              ))}
            </div>
          ) : (
            <ModernCard elevation="sm" className="text-center p-12">
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.muted,
                }}
              >
                {searchTerm || filterStatus !== 'all' || filterVIP !== 'all'
                  ? 'No devotees found matching your criteria.'
                  : 'No devotees available.'}
              </p>
            </ModernCard>
          )}
        </>
      )}

      {/* Devotee Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedDevotee?.name}
        size="md"
      >
        {selectedDevotee && (
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
                  Devotee ID
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedDevotee.devoteeId}
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
                      selectedDevotee.status === 'active'
                        ? colors.success.light
                        : colors.error.light,
                    color:
                      selectedDevotee.status === 'active'
                        ? colors.success.dark
                        : colors.error.dark,
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {selectedDevotee.status}
                </span>
              </div>
              {selectedDevotee.isVIP && (
                <div className="col-span-2">
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      color: colors.text.muted,
                      marginBottom: spacing.xs,
                    }}
                  >
                    VIP Status
                  </p>
                  <span
                    className="inline-block px-3 py-1 rounded-xl bg-yellow-100 text-yellow-800"
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    VIP Devotee
                  </span>
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
                  {selectedDevotee.email}
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
                  {selectedDevotee.phone}
                </p>
              </div>
              {selectedDevotee.visitCount !== undefined && (
                <div>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      color: colors.text.muted,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Visit Count
                  </p>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    {selectedDevotee.visitCount}
                  </p>
                </div>
              )}
              {selectedDevotee.lastVisit && (
                <div>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      color: colors.text.muted,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Last Visit
                  </p>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    {selectedDevotee.lastVisit}
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
                  Registration Date
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedDevotee.registrationDate}
                </p>
              </div>
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
                  {selectedDevotee.address}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}
