'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography } from '../../../design-system';
import { getAllContracts, Contract } from '../../peopleData';
import { loadContracts } from '../../utils/dataStorage';

export default function ContractManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);

  // Load contracts from localStorage on mount
  useEffect(() => {
    const staticContracts = getAllContracts();
    const loadedContracts = loadContracts(staticContracts);
    setContracts(loadedContracts);
  }, []);

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.freelancerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesType = filterType === 'all' || c.contractType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleRowClick = (contract: Contract) => {
    setSelectedContract(contract);
    setIsDetailModalOpen(true);
  };

  return (
    <ModuleLayout
      title="Contract Management"
      description="View and manage all freelancer contracts"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search by freelancer name, description, or ID..."
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
          <div>
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
              <option value="completed">Completed</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              <option value="all">All Types</option>
              <option value="hourly">Hourly</option>
              <option value="project">Project</option>
              <option value="retainer">Retainer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
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
                  Contract ID
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
                  Freelancer
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
                  Type
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
                  Rate/Amount
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
                  Duration
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
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                    onClick={() => handleRowClick(contract)}
                  >
                    <td
                      className="px-6 py-4"
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.primary,
                      }}
                    >
                      {contract.id}
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
                      {contract.freelancerName}
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.primary,
                      }}
                    >
                      <span className="capitalize">{contract.contractType}</span>
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
                      {contract.contractType === 'hourly' ? `₹${contract.rate}/hr` : `₹${contract.rate}`}
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.muted,
                      }}
                    >
                      {contract.startDate} {contract.endDate ? `- ${contract.endDate}` : '(Ongoing)'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-block px-3 py-1 rounded-xl text-xs"
                        style={{
                          backgroundColor:
                            contract.status === 'active'
                              ? colors.success.light
                              : contract.status === 'completed'
                              ? colors.primary.light
                              : colors.error.light,
                          color:
                            contract.status === 'active'
                              ? colors.success.dark
                              : contract.status === 'completed'
                              ? colors.primary.dark
                              : colors.error.dark,
                          fontFamily: typography.body.fontFamily,
                          fontWeight: 500,
                        }}
                      >
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(contract);
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
                    No contracts found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Contract ${selectedContract?.id}`}
        size="md"
      >
        {selectedContract && (
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
                  Contract ID
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedContract.id}
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
                  Freelancer
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedContract.freelancerName}
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
                  Contract Type
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  <span className="capitalize">{selectedContract.contractType}</span>
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
                      selectedContract.status === 'active'
                        ? colors.success.light
                        : selectedContract.status === 'completed'
                        ? colors.primary.light
                        : colors.error.light,
                    color:
                      selectedContract.status === 'active'
                        ? colors.success.dark
                        : selectedContract.status === 'completed'
                        ? colors.primary.dark
                        : colors.error.dark,
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {selectedContract.status}
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
                  Rate/Amount
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedContract.contractType === 'hourly' ? `₹${selectedContract.rate}/hr` : `₹${selectedContract.rate}`}
                </p>
              </div>
              {selectedContract.totalHours && (
                <div>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      color: colors.text.muted,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Total Hours
                  </p>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    {selectedContract.totalHours} hrs
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
                  Start Date
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedContract.startDate}
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
                  End Date
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedContract.endDate || 'Ongoing'}
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
                  Description
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedContract.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}

