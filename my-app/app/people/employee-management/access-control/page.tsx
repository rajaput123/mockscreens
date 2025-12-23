'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography } from '../../../design-system';

interface User {
  id: string;
  name: string;
  email: string;
  currentRole: string;
  imageUrl?: string;
  permissions: string[];
}

export default function AccessControlPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const availableRoles = ['Admin', 'Manager', 'Staff', 'Volunteer'];
  const availablePermissions = [
    'View Employees',
    'Create Employees',
    'Edit Employees',
    'Delete Employees',
    'View Roles',
    'Create Roles',
    'Edit Roles',
    'View Temples',
    'Create Temples',
    'Edit Temples',
    'View Bookings',
    'Create Bookings',
    'Edit Bookings',
    'View Finance',
    'Edit Finance',
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.currentRole === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCardClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <ModuleLayout
      title="Access Control"
      description="Configure access permissions and controls"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
          >
            <option value="all">All Roles</option>
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleCardClick(user)}
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
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.name}
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
                        {user.name.charAt(0).toUpperCase()}
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
                  {user.currentRole}
                </span>
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.light,
                  }}
                >
                  {user.permissions.length} {user.permissions.length === 1 ? 'permission' : 'permissions'}
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
        </div>
      )}

      {/* User Access Management Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Manage Access: ${selectedUser?.name}`}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4 pb-4 border-b" style={{ borderColor: colors.border }}>
              <div
                className="w-20 h-20 rounded-full overflow-hidden border-2"
                style={{ borderColor: colors.border }}
              >
                {selectedUser.imageUrl ? (
                  <img
                    src={selectedUser.imageUrl}
                    alt={selectedUser.name}
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
                      {selectedUser.name.charAt(0).toUpperCase()}
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
                  {selectedUser.name}
                </h4>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.muted,
                  }}
                >
                  {selectedUser.email}
                </p>
              </div>
            </div>

            {/* Role Assignment */}
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
                  Assign Role
                </span>
              </label>
              <select
                defaultValue={selectedUser.currentRole}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                style={{
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Permissions */}
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
                Custom Permissions
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availablePermissions.map((permission) => (
                  <label
                    key={permission}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedUser.permissions.includes(permission)
                        ? colors.success.light
                        : 'transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={selectedUser.permissions.includes(permission)}
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
                      }}
                    >
                      {permission}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
              <button
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
                className="flex-1 px-4 py-2 rounded-2xl transition-all hover:scale-105"
                style={{
                  backgroundColor: colors.primary.base,
                  color: '#ffffff',
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
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
