'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography } from '../../../design-system';

interface Employee {
  id: string;
  name: string;
  email: string;
  currentRole: string;
  imageUrl?: string;
  roleHistory: Array<{
    role: string;
    date: string;
    changedBy: string;
  }>;
}

export default function UpdateRolePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newRole, setNewRole] = useState('');

  const availableRoles = ['Admin', 'Manager', 'Staff', 'Volunteer'];

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setNewRole(employee.currentRole);
    setIsModalOpen(true);
  };

  const handleUpdateRole = () => {
    if (!selectedEmployee || !newRole) return;
    // API call would go here
    alert(`Role updated to ${newRole} for ${selectedEmployee.name}`);
    setIsModalOpen(false);
  };

  return (
    <ModuleLayout
      title="Update Role / Access"
      description="Modify employee roles and access permissions"
    >
      {/* Search */}
      <div
        className="rounded-3xl p-6 mb-6"
        style={{
          backgroundColor: colors.background.base,
          border: `1px solid ${colors.border}`,
          padding: spacing.xl,
        }}
      >
        <input
          type="text"
          placeholder="Search employees by name or email..."
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

      {/* Employees Grid */}
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              onClick={() => handleCardClick(employee)}
              className="rounded-3xl p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: colors.background.base,
                border: `1px solid ${colors.border}`,
                padding: spacing.xl,
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0"
                  style={{ borderColor: colors.border }}
                >
                  {employee.imageUrl ? (
                    <img
                      src={employee.imageUrl}
                      alt={employee.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: colors.background.subtle }}
                    >
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '20px',
                          fontWeight: 600,
                          color: colors.text.muted,
                        }}
                      >
                        {employee.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    style={{
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.sectionHeader.fontSize,
                      fontWeight: typography.sectionHeader.fontWeight,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {employee.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      color: colors.text.muted,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {employee.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="px-3 py-1 rounded-xl"
                  style={{
                    backgroundColor: colors.background.subtle,
                    color: colors.text.muted,
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {employee.currentRole}
                </span>
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.light,
                  }}
                >
                  {employee.roleHistory.length} {employee.roleHistory.length === 1 ? 'change' : 'changes'}
                </span>
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
          <svg
            className="mx-auto mb-4"
            width="64"
            height="64"
            fill="none"
            stroke={colors.text.muted}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.muted,
            }}
          >
            {searchTerm
              ? 'No employees found matching your search.'
              : 'No employees found. Add employees first to manage their roles.'}
          </p>
        </div>
      )}

      {/* Update Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Update Role: ${selectedEmployee?.name}`}
        size="md"
      >
        {selectedEmployee && (
          <div className="space-y-6">
            {/* Employee Info */}
            <div className="flex items-center gap-4 pb-4 border-b" style={{ borderColor: colors.border }}>
              <div
                className="w-20 h-20 rounded-full overflow-hidden border-2"
                style={{ borderColor: colors.border }}
              >
                {selectedEmployee.imageUrl ? (
                  <img
                    src={selectedEmployee.imageUrl}
                    alt={selectedEmployee.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: colors.background.subtle }}
                  >
                    <span
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '32px',
                        fontWeight: 600,
                        color: colors.text.muted,
                      }}
                    >
                      {selectedEmployee.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h4
                  style={{
                    fontFamily: typography.sectionHeader.fontFamily,
                    fontSize: typography.sectionHeader.fontSize,
                    fontWeight: typography.sectionHeader.fontWeight,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  {selectedEmployee.name}
                </h4>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.muted,
                  }}
                >
                  Current Role: {selectedEmployee.currentRole}
                </p>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block mb-2">
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  Select New Role *
                </span>
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                style={{
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              >
                <option value="">Select a role</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Role History */}
            {selectedEmployee.roleHistory.length > 0 && (
              <div>
                <h4
                  style={{
                    fontFamily: typography.sectionHeader.fontFamily,
                    fontSize: '18px',
                    fontWeight: 600,
                    marginBottom: spacing.md,
                    color: colors.text.primary,
                  }}
                >
                  Role History
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedEmployee.roleHistory.map((history, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl"
                      style={{
                        backgroundColor: colors.background.subtle,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                            fontWeight: 500,
                          }}
                        >
                          {history.role}
                        </span>
                        <span
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '12px',
                            color: colors.text.muted,
                          }}
                        >
                          {history.date}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          color: colors.text.light,
                          marginTop: spacing.xs,
                        }}
                      >
                        Changed by: {history.changedBy}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-2xl border-2 transition-all hover:scale-105"
                style={{
                  borderColor: colors.border,
                  color: colors.text.primary,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={!newRole || newRole === selectedEmployee.currentRole}
                className="flex-1 px-4 py-2 rounded-2xl transition-all hover:scale-105 disabled:opacity-50"
                style={{
                  backgroundColor: colors.primary.base,
                  color: '#ffffff',
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                }}
              >
                Update Role
              </button>
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}
