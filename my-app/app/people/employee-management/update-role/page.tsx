'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography, shadows } from '../../../design-system';
import { ModernCard, ElevatedCard } from '../../components';

interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  currentRole: string;
  department: string;
  imageUrl?: string;
  roleHistory: Array<{
    role: string;
    date: string;
    changedBy: string;
  }>;
}

const initialEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'Arjun Rao',
    email: 'arjun.rao@example.com',
    currentRole: 'Operations Manager',
    department: 'Operations',
    roleHistory: [
      { role: 'Operations Manager', date: '2022-01-15', changedBy: 'Admin' },
      { role: 'Operations Executive', date: '2021-06-01', changedBy: 'HR Manager' },
    ],
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Meera Iyer',
    email: 'meera.iyer@example.com',
    currentRole: 'HR Executive',
    department: 'Human Resources',
    roleHistory: [
      { role: 'HR Executive', date: '2023-03-01', changedBy: 'HR Manager' },
    ],
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Karthik Sharma',
    email: 'karthik.sharma@example.com',
    currentRole: 'Accounts Officer',
    department: 'Finance',
    roleHistory: [
      { role: 'Accounts Officer', date: '2021-08-10', changedBy: 'Finance Manager' },
      { role: 'Junior Accountant', date: '2020-01-15', changedBy: 'Admin' },
    ],
  },
];

const ROLES = [
  'Temple Administrator',
  'Operations Manager',
  'HR / Admin Team',
  'PR / Content Team',
  'Trustees',
  'HR Executive',
  'Accounts Officer',
  'Finance Manager',
  'Security Officer',
  'Maintenance Staff',
  'Prasad Coordinator',
  'Event Manager',
  'IT Support',
];

export default function UpdateRolePage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [newRole, setNewRole] = useState('');
  const [reason, setReason] = useState('');

  const uniqueRoles = Array.from(new Set(employees.map((e) => e.currentRole))).filter(Boolean);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || emp.currentRole === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCardClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setNewRole(employee.currentRole);
    setReason('');
    setIsModalOpen(true);
  };

  const handleUpdateRole = () => {
    if (!selectedEmployee || !newRole || newRole === selectedEmployee.currentRole) return;

    const updatedEmployees = employees.map((emp) => {
      if (emp.id === selectedEmployee.id) {
        return {
          ...emp,
          currentRole: newRole,
          roleHistory: [
            {
              role: newRole,
              date: new Date().toISOString().split('T')[0],
              changedBy: 'Current User', // In real app, get from auth context
            },
            ...emp.roleHistory,
          ],
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    alert(`Role updated to ${newRole} for ${selectedEmployee.name}`);
    setIsModalOpen(false);
  };

  return (
    <ModuleLayout
      title="Update Role"
      description="Modify employee roles and track role history"
    >
      {/* Search and Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search employees by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                boxShadow: shadows.sm,
              }}
            />
          </div>
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                boxShadow: shadows.sm,
              }}
            >
              <option value="all">All Roles</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ModernCard>

      {/* Employees Grid */}
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <ElevatedCard
              key={employee.id}
              onClick={() => handleCardClick(employee)}
              elevation="lg"
              className="cursor-pointer transition-all hover:scale-[1.02]"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0 flex items-center justify-center"
                    style={{
                      borderColor: colors.primary.base,
                      backgroundColor: colors.primary.light,
                    }}
                  >
                    {employee.imageUrl ? (
                      <img
                        src={employee.imageUrl}
                        alt={employee.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '24px',
                          fontWeight: 600,
                          color: colors.primary.base,
                        }}
                      >
                        {employee.name.charAt(0).toUpperCase()}
                      </span>
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
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '11px',
                        color: colors.text.muted,
                        marginTop: spacing.xs,
                      }}
                    >
                      ID: {employee.employeeId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: colors.border }}>
                  <span
                    className="px-3 py-1 rounded-xl"
                    style={{
                      backgroundColor: colors.primary.light,
                      color: colors.primary.base,
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {employee.currentRole}
                  </span>
                  <span
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '11px',
                      color: colors.text.muted,
                    }}
                  >
                    {employee.roleHistory.length} {employee.roleHistory.length === 1 ? 'change' : 'changes'}
                  </span>
                </div>
              </div>
            </ElevatedCard>
          ))}
        </div>
      ) : (
        <ModernCard elevation="md" className="text-center p-12">
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
            {searchTerm || filterRole !== 'all'
              ? 'No employees found matching your criteria.'
              : 'No employees found. Add employees first to manage their roles.'}
          </p>
        </ModernCard>
      )}

      {/* Update Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Employee Role"
        size="md"
      >
        {selectedEmployee && (
          <div className="space-y-6">
            {/* Employee Info */}
            <div className="flex items-center gap-4 pb-4 border-b" style={{ borderColor: colors.border }}>
              <div
                className="w-20 h-20 rounded-full overflow-hidden border-2 flex items-center justify-center"
                style={{
                  borderColor: colors.primary.base,
                  backgroundColor: colors.primary.light,
                }}
              >
                {selectedEmployee.imageUrl ? (
                  <img
                    src={selectedEmployee.imageUrl}
                    alt={selectedEmployee.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '32px',
                      fontWeight: 600,
                      color: colors.primary.base,
                    }}
                  >
                    {selectedEmployee.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
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
                    marginBottom: spacing.xs,
                  }}
                >
                  {selectedEmployee.email}
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                  }}
                >
                  ID: {selectedEmployee.employeeId} • {selectedEmployee.department}
                </p>
                <div className="mt-2">
                  <span
                    className="px-3 py-1 rounded-xl inline-block"
                    style={{
                      backgroundColor: colors.primary.light,
                      color: colors.primary.base,
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    Current: {selectedEmployee.currentRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block mb-2">
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  Select New Role <span style={{ color: colors.error.base }}>*</span>
                </span>
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  boxShadow: shadows.sm,
                }}
              >
                <option value="">Select a role</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason for Change */}
            <div>
              <label className="block mb-2">
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  Reason for Change (Optional)
                </span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for role change..."
                rows={3}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all resize-none"
                style={{
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  boxShadow: shadows.sm,
                }}
              />
            </div>

            {/* Role History */}
            {selectedEmployee.roleHistory.length > 0 && (
              <div>
                <h4
                  style={{
                    fontFamily: typography.sectionHeader.fontFamily,
                    fontSize: '1rem',
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
                      className="p-3 rounded-xl transition-all"
                      style={{
                        backgroundColor: colors.background.subtle,
                        boxShadow: shadows.sm,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                            fontWeight: 600,
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
                          {new Date(history.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          color: colors.text.muted,
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
                  boxShadow: shadows.sm,
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
                  boxShadow: shadows.md,
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
