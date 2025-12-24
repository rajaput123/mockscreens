'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography, shadows } from '../../../design-system';
import { ModernCard, ElevatedCard } from '../../components';

interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  currentRole: string;
  department: string;
  imageUrl?: string;
  permissions: string[];
}

const initialUsers: User[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'Arjun Rao',
    email: 'arjun.rao@example.com',
    currentRole: 'Operations Manager',
    department: 'Operations',
    permissions: [
      'View Employees',
      'Edit Employees',
      'View Temples',
      'Create Temples',
      'Edit Temples',
      'View Bookings',
      'Create Bookings',
      'View Finance',
    ],
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Meera Iyer',
    email: 'meera.iyer@example.com',
    currentRole: 'HR Executive',
    department: 'Human Resources',
    permissions: [
      'View Employees',
      'Create Employees',
      'Edit Employees',
      'View Roles',
      'Create Roles',
      'Edit Roles',
    ],
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Karthik Sharma',
    email: 'karthik.sharma@example.com',
    currentRole: 'Accounts Officer',
    department: 'Finance',
    permissions: [
      'View Finance',
      'Edit Finance',
      'View Bookings',
      'View Employees',
    ],
  },
];

const AVAILABLE_ROLES = [
  'Temple Administrator',
  'Operations Manager',
  'HR / Admin Team',
  'PR / Content Team',
  'Trustees',
  'HR Executive',
  'Accounts Officer',
  'Finance Manager',
  'Security Officer',
];

const PERMISSION_CATEGORIES = {
  'Employee Management': [
    'View Employees',
    'Create Employees',
    'Edit Employees',
    'Delete Employees',
  ],
  'Role Management': [
    'View Roles',
    'Create Roles',
    'Edit Roles',
    'Delete Roles',
  ],
  'Temple Management': [
    'View Temples',
    'Create Temples',
    'Edit Temples',
    'Delete Temples',
  ],
  'Booking Management': [
    'View Bookings',
    'Create Bookings',
    'Edit Bookings',
    'Delete Bookings',
  ],
  'Finance': [
    'View Finance',
    'Edit Finance',
    'Approve Payments',
    'View Reports',
  ],
  'Content & Communications': [
    'View Content',
    'Create Content',
    'Edit Content',
    'Publish Content',
    'Send Announcements',
  ],
};

export default function AccessControlPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const uniqueRoles = Array.from(new Set(users.map((u) => u.currentRole))).filter(Boolean);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.currentRole === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCardClick = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.currentRole);
    setSelectedPermissions([...user.permissions]);
    setIsModalOpen(true);
  };

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSaveChanges = () => {
    if (!selectedUser) return;

    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          currentRole: selectedRole,
          permissions: selectedPermissions,
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    alert(`Access permissions updated for ${selectedUser.name}`);
    setIsModalOpen(false);
  };

  const allPermissions = Object.values(PERMISSION_CATEGORIES).flat();

  return (
    <ModuleLayout
      title="Access Control"
      description="Configure access permissions and controls for employees"
    >
      {/* Search and Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search by name, email, or employee ID..."
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

      {/* Users Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <ElevatedCard
              key={user.id}
              onClick={() => handleCardClick(user)}
              elevation="lg"
              className="cursor-pointer transition-all hover:scale-[1.02]"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0 flex items-center justify-center"
                    style={{
                      borderColor: colors.warning.base,
                      backgroundColor: colors.warning.light,
                    }}
                  >
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '24px',
                          fontWeight: 600,
                          color: colors.warning.base,
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
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
                      {user.name}
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
                      {user.email}
                    </p>
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '11px',
                        color: colors.text.muted,
                        marginTop: spacing.xs,
                      }}
                    >
                      ID: {user.employeeId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: colors.border }}>
                  <span
                    className="px-3 py-1 rounded-xl"
                    style={{
                      backgroundColor: colors.warning.light,
                      color: colors.warning.base,
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {user.currentRole}
                  </span>
                  <span
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '11px',
                      color: colors.text.muted,
                    }}
                  >
                    {user.permissions.length} {user.permissions.length === 1 ? 'permission' : 'permissions'}
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
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
              ? 'No users found matching your criteria.'
              : 'No users found. Add employees first to manage their access.'}
          </p>
        </ModernCard>
      )}

      {/* User Access Management Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Manage Access Permissions"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4 pb-4 border-b" style={{ borderColor: colors.border }}>
              <div
                className="w-20 h-20 rounded-full overflow-hidden border-2 flex items-center justify-center"
                style={{
                  borderColor: colors.warning.base,
                  backgroundColor: colors.warning.light,
                }}
              >
                {selectedUser.imageUrl ? (
                  <img
                    src={selectedUser.imageUrl}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '32px',
                      fontWeight: 600,
                      color: colors.warning.base,
                    }}
                  >
                    {selectedUser.name.charAt(0).toUpperCase()}
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
                  {selectedUser.name}
                </h4>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.muted,
                    marginBottom: spacing.xs,
                  }}
                >
                  {selectedUser.email}
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                  }}
                >
                  ID: {selectedUser.employeeId} • {selectedUser.department}
                </p>
              </div>
            </div>

            {/* Role Assignment */}
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
                  Assign Role
                </span>
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  boxShadow: shadows.sm,
                }}
              >
                {AVAILABLE_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Permissions by Category */}
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
                Custom Permissions
              </h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h5
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {category}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {permissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
                          style={{
                            backgroundColor: selectedPermissions.includes(permission)
                              ? colors.success.light
                              : colors.background.subtle,
                            boxShadow: shadows.sm,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission)}
                            onChange={() => handlePermissionToggle(permission)}
                            className="w-4 h-4"
                            style={{
                              accentColor: colors.primary.base,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: typography.body.fontFamily,
                              fontSize: typography.body.fontSize,
                              color: colors.text.primary,
                              fontWeight: selectedPermissions.includes(permission) ? 500 : 400,
                            }}
                          >
                            {permission}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Permission Summary */}
            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: colors.info.light,
                border: `1px solid ${colors.info.base}`,
              }}
            >
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: '0.875rem',
                  color: colors.info.base,
                  fontWeight: 500,
                }}
              >
                <strong>{selectedPermissions.length}</strong> permission{selectedPermissions.length !== 1 ? 's' : ''} selected
              </p>
            </div>

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
                onClick={handleSaveChanges}
                className="flex-1 px-4 py-2 rounded-2xl transition-all hover:scale-105"
                style={{
                  backgroundColor: colors.primary.base,
                  color: '#ffffff',
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                  boxShadow: shadows.md,
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}
