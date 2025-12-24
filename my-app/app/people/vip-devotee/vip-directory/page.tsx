'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography, shadows, borders } from '../../../design-system';
import { getAllVIPDevotees, VIPDevotee } from '../../peopleData';
import { ModernCard, ElevatedCard } from '../../components';
import { maskName, maskPhone, maskEmail, canViewUnmasked } from '../utils/masking';

export default function VIPDirectoryPage() {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [selectedVIP, setSelectedVIP] = useState<VIPDevotee | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const vipDevotees = getAllVIPDevotees();

  const filteredVIPs = vipDevotees.filter((vip) => {
    const matchesSearch =
      vip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vip.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vip.devoteeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || vip.vipLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const handleCardClick = (vip: VIPDevotee) => {
    setSelectedVIP(vip);
    setIsDetailModalOpen(true);
  };

  return (
    <ModuleLayout
      title="VIP Directory"
      description="View all VIP devotees in table or card format"
    >
      {/* Access Warning */}
      {!canViewUnmasked() && (
        <div
          className="rounded-2xl p-4 mb-6"
          style={{
            backgroundColor: colors.warning.light,
            border: `1px solid ${colors.warning.base}40`,
            boxShadow: shadows.sm,
          }}
        >
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '0.875rem',
              color: colors.warning.base,
              fontWeight: 600,
            }}
          >
            Restricted Access: VIP data is masked for privacy protection.
          </p>
        </div>
      )}

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

          {/* VIP Level Filter */}
          <div className="w-full md:w-48">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              <option value="all">All Levels</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
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
                    VIP Level
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
                    Services
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
                    VIP Since
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
                {filteredVIPs.length > 0 ? (
                  filteredVIPs.map((vip) => (
                    <tr
                      key={vip.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                      onClick={() => handleCardClick(vip)}
                    >
                      <td
                        className="px-6 py-4"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {vip.devoteeId}
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
                        {vip.name}
                      </td>
                      <td
                        className="px-6 py-4"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.muted,
                        }}
                      >
                        {vip.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 rounded-xl text-xs capitalize"
                          style={{
                            backgroundColor:
                              vip.vipLevel === 'platinum'
                                ? '#E5E7EB'
                                : vip.vipLevel === 'gold'
                                ? '#FEF3C7'
                                : '#F3F4F6',
                            color:
                              vip.vipLevel === 'platinum'
                                ? '#374151'
                                : vip.vipLevel === 'gold'
                                ? '#92400E'
                                : '#4B5563',
                            fontFamily: typography.body.fontFamily,
                            fontWeight: 500,
                          }}
                        >
                          {vip.vipLevel}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {vip.vipServices.length} services
                      </td>
                      <td
                        className="px-6 py-4"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.muted,
                        }}
                      >
                        {vip.vipSince}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(vip);
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
                      No VIP devotees found matching your criteria.
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
          {filteredVIPs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVIPs.map((vip) => {
                const canView = canViewUnmasked();
                return (
                  <ElevatedCard
                    key={vip.id}
                    onClick={() => handleCardClick(vip)}
                    title={canView ? vip.name : maskName(vip.name)}
                    subtitle={`Level: ${vip.vipLevel}`}
                    badge={
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold capitalize"
                        style={{
                          backgroundColor: colors.primary.base + '20',
                          color: colors.primary.base,
                          fontFamily: typography.body.fontFamily,
                          fontWeight: 600,
                          boxShadow: shadows.sm,
                        }}
                      >
                        {vip.vipLevel}
                      </span>
                    }
                  >
                    <div className="space-y-2">
                      <span
                        className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold capitalize"
                        style={{
                          fontFamily: typography.body.fontFamily,
                        }}
                      >
                        {vip.vipLevel}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '12px',
                        color: colors.text.muted,
                      }}
                    >
                      ID: {vip.devoteeId}
                    </p>
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '12px',
                        color: colors.text.muted,
                      }}
                    >
                      {canView ? vip.email : maskEmail(vip.email)}
                    </p>
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '12px',
                        color: colors.text.muted,
                      }}
                    >
                      {canView ? vip.phone : maskPhone(vip.phone)}
                    </p>
                    <div className="mt-2">
                      <p
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          color: colors.text.muted,
                          marginBottom: spacing.xs,
                        }}
                      >
                        Services: {vip.vipServices.length}
                      </p>
                      <p
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          color: colors.text.muted,
                        }}
                      >
                        VIP Since: {vip.vipSince}
                      </p>
                    </div>
                  </ElevatedCard>
                );
              })}
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
                {searchTerm || filterLevel !== 'all'
                  ? 'No VIP devotees found matching your criteria.'
                  : 'No VIP devotees available.'}
              </p>
            </ModernCard>
          )}
        </>
      )}

      {/* VIP Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedVIP?.name}
        size="md"
      >
        {selectedVIP && (
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
                  {selectedVIP.devoteeId}
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
                  VIP Level
                </p>
                <span
                  className="inline-block px-3 py-1 rounded-xl capitalize"
                  style={{
                    backgroundColor:
                      selectedVIP.vipLevel === 'platinum'
                        ? '#E5E7EB'
                        : selectedVIP.vipLevel === 'gold'
                        ? '#FEF3C7'
                        : '#F3F4F6',
                    color:
                      selectedVIP.vipLevel === 'platinum'
                        ? '#374151'
                        : selectedVIP.vipLevel === 'gold'
                        ? '#92400E'
                        : '#4B5563',
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {selectedVIP.vipLevel}
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
                  {selectedVIP.email}
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
                  {selectedVIP.phone}
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
                  VIP Since
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedVIP.vipSince}
                </p>
              </div>
              {selectedVIP.visitCount !== undefined && (
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
                    {selectedVIP.visitCount}
                  </p>
                </div>
              )}
              <div className="col-span-2">
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                    marginBottom: spacing.xs,
                  }}
                >
                  VIP Services
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedVIP.vipServices.map((service, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-amber-100 rounded-xl text-sm"
                      style={{
                        fontFamily: typography.body.fontFamily,
                        color: colors.primary.dark,
                      }}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              {selectedVIP.specialNotes && (
                <div className="col-span-2">
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      color: colors.text.muted,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Special Notes
                  </p>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    {selectedVIP.specialNotes}
                  </p>
                </div>
              )}
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
                  {selectedVIP.address}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}
