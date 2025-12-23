'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography } from '../../../design-system';

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  employeeCount: number;
}

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const allPermissions: Permission[] = [
    { id: 'emp_view', name: 'View Employees', category: 'Employee', description: 'View employee directory' },
    { id: 'emp_create', name: 'Create Employees', category: 'Employee', description: 'Add new employees' },
    { id: 'emp_edit', name: 'Edit Employees', category: 'Employee', description: 'Update employee information' },
    { id: 'emp_delete', name: 'Delete Employees', category: 'Employee', description: 'Remove employees' },
    { id: 'role_view', name: 'View Roles', category: 'Role', description: 'View role definitions' },
    { id: 'role_create', name: 'Create Roles', category: 'Role', description: 'Create new roles' },
    { id: 'role_edit', name: 'Edit Roles', category: 'Role', description: 'Modify role permissions' },
    { id: 'role_delete', name: 'Delete Roles', category: 'Role', description: 'Remove roles' },
    { id: 'temple_view', name: 'View Temples', category: 'Temple', description: 'View temple directory' },
    { id: 'temple_create', name: 'Create Temples', category: 'Temple', description: 'Add new temples' },
    { id: 'temple_edit', name: 'Edit Temples', category: 'Temple', description: 'Update temple information' },
    { id: 'booking_view', name: 'View Bookings', category: 'Booking', description: 'View all bookings' },
    { id: 'booking_create', name: 'Create Bookings', category: 'Booking', description: 'Create new bookings' },
    { id: 'booking_edit', name: 'Edit Bookings', category: 'Booking', description: 'Modify bookings' },
    { id: 'finance_view', name: 'View Finance', category: 'Finance', description: 'View financial data' },
    { id: 'finance_edit', name: 'Edit Finance', category: 'Finance', description: 'Modify financial records' },
  ];

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleCreateRole = () => {
    setIsCreateModalOpen(true);
  };

  const permissionsByCategory = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <ModuleLayout
      title="Role Management"
      description="Manage employee roles and permissions"
    >
      {/* Header with Search and Create Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search roles..."
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
        <button
          onClick={handleCreateRole}
          className="px-6 py-2 rounded-2xl transition-all hover:scale-105"
          style={{
            backgroundColor: colors.primary.base,
            color: '#ffffff',
            fontFamily: typography.body.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: 500,
          }}
        >
          + Create Role
        </button>
      </div>

      {/* Roles Grid */}
      {filteredRoles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleCardClick(role)}
              className="rounded-3xl p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: colors.background.base,
                border: `1px solid ${colors.border}`,
                padding: spacing.xl,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3
                  style={{
                    fontFamily: typography.sectionHeader.fontFamily,
                    fontSize: typography.sectionHeader.fontSize,
                    fontWeight: typography.sectionHeader.fontWeight,
                    color: colors.text.primary,
                  }}
                >
                  {role.name}
                </h3>
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
                  {role.employeeCount} {role.employeeCount === 1 ? 'employee' : 'employees'}
                </span>
              </div>
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.muted,
                  marginBottom: spacing.sm,
                }}
              >
                {role.description}
              </p>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.light,
                  }}
                >
                  {role.permissions.length} {role.permissions.length === 1 ? 'permission' : 'permissions'}
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
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
              ? 'No roles found matching your search.'
              : 'No roles created yet. Create your first role to get started.'}
          </p>
        </div>
      )}

      {/* Role Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRole?.name}
        size="lg"
      >
        {selectedRole && (
          <div className="space-y-6">
            <div>
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.muted,
                  marginBottom: spacing.sm,
                }}
              >
                {selectedRole.description}
              </p>
            </div>

            {/* Permissions Matrix */}
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
                Permissions
              </h4>
              <div className="space-y-4">
                {Object.entries(permissionsByCategory).map(([category, perms]) => (
                  <div key={category}>
                    <h5
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '14px',
                        fontWeight: 600,
                        marginBottom: spacing.sm,
                        color: colors.text.secondary,
                      }}
                    >
                      {category}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {perms.map((perm) => (
                        <label
                          key={perm.id}
                          className="flex items-center gap-2 p-2 rounded-xl cursor-pointer hover:bg-gray-50"
                          style={{
                            backgroundColor: selectedRole.permissions.includes(perm.id)
                              ? colors.success.light
                              : 'transparent',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRole.permissions.includes(perm.id)}
                            readOnly
                            className="w-4 h-4"
                            style={{
                              accentColor: colors.primary.base,
                            }}
                          />
                          <div>
                            <span
                              style={{
                                fontFamily: typography.body.fontFamily,
                                fontSize: typography.body.fontSize,
                                color: colors.text.primary,
                                fontWeight: 500,
                              }}
                            >
                              {perm.name}
                            </span>
                            <p
                              style={{
                                fontFamily: typography.body.fontFamily,
                                fontSize: '12px',
                                color: colors.text.muted,
                              }}
                            >
                              {perm.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
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
                Edit Role
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-2xl border-2 transition-all hover:scale-105"
                style={{
                  borderColor: colors.error.base,
                  color: colors.error.base,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                }}
              >
                Delete Role
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Role Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Role"
        size="lg"
      >
        <div className="space-y-6">
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
                Role Name *
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g., Manager, Staff, Admin"
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            />
          </div>

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
                Description
              </span>
            </label>
            <textarea
              placeholder="Describe the role and its responsibilities..."
              rows={3}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            />
          </div>

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
              Select Permissions
            </h4>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(permissionsByCategory).map(([category, perms]) => (
                <div key={category}>
                  <h5
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '14px',
                      fontWeight: 600,
                      marginBottom: spacing.sm,
                      color: colors.text.secondary,
                    }}
                  >
                    {category}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {perms.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex items-center gap-2 p-2 rounded-xl cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          style={{
                            accentColor: colors.primary.base,
                          }}
                        />
                        <div>
                          <span
                            style={{
                              fontFamily: typography.body.fontFamily,
                              fontSize: typography.body.fontSize,
                              color: colors.text.primary,
                              fontWeight: 500,
                            }}
                          >
                            {perm.name}
                          </span>
                          <p
                            style={{
                              fontFamily: typography.body.fontFamily,
                              fontSize: '12px',
                              color: colors.text.muted,
                            }}
                          >
                            {perm.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
            <button
              onClick={() => setIsCreateModalOpen(false)}
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
              Create Role
            </button>
          </div>
        </div>
      </Modal>
    </ModuleLayout>
  );
}
