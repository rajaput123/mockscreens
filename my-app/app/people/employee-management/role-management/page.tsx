'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography, shadows } from '../../../design-system';
import { ModernCard, ElevatedCard } from '../../components';

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
  createdAt: string;
  updatedAt: string;
}

const initialRoles: Role[] = [
  {
    id: '1',
    name: 'Temple Administrator',
    description: 'Full access to all temple management features and settings',
    permissions: ['emp_view', 'emp_create', 'emp_edit', 'emp_delete', 'role_view', 'role_create', 'role_edit', 'role_delete', 'temple_view', 'temple_create', 'temple_edit', 'booking_view', 'booking_create', 'booking_edit', 'finance_view', 'finance_edit'],
    employeeCount: 2,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Operations Manager',
    description: 'Manage daily operations, employees, and temple activities',
    permissions: ['emp_view', 'emp_edit', 'temple_view', 'temple_edit', 'booking_view', 'booking_create', 'booking_edit', 'finance_view'],
    employeeCount: 5,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'HR Executive',
    description: 'Manage employee records, roles, and human resources',
    permissions: ['emp_view', 'emp_create', 'emp_edit', 'role_view', 'role_create', 'role_edit'],
    employeeCount: 3,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
  },
  {
    id: '4',
    name: 'Accounts Officer',
    description: 'Handle financial records and transactions',
    permissions: ['finance_view', 'finance_edit', 'booking_view', 'emp_view'],
    employeeCount: 2,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-22',
  },
];

const allPermissions: Permission[] = [
  { id: 'emp_view', name: 'View Employees', category: 'Employee Management', description: 'View employee directory and details' },
  { id: 'emp_create', name: 'Create Employees', category: 'Employee Management', description: 'Add new employees to the system' },
  { id: 'emp_edit', name: 'Edit Employees', category: 'Employee Management', description: 'Update employee information' },
  { id: 'emp_delete', name: 'Delete Employees', category: 'Employee Management', description: 'Remove employees from the system' },
  { id: 'role_view', name: 'View Roles', category: 'Role Management', description: 'View role definitions and permissions' },
  { id: 'role_create', name: 'Create Roles', category: 'Role Management', description: 'Create new roles with custom permissions' },
  { id: 'role_edit', name: 'Edit Roles', category: 'Role Management', description: 'Modify role permissions and settings' },
  { id: 'role_delete', name: 'Delete Roles', category: 'Role Management', description: 'Remove roles from the system' },
  { id: 'temple_view', name: 'View Temples', category: 'Temple Management', description: 'View temple directory and information' },
  { id: 'temple_create', name: 'Create Temples', category: 'Temple Management', description: 'Add new temples to the system' },
  { id: 'temple_edit', name: 'Edit Temples', category: 'Temple Management', description: 'Update temple information' },
  { id: 'booking_view', name: 'View Bookings', category: 'Booking Management', description: 'View all bookings and reservations' },
  { id: 'booking_create', name: 'Create Bookings', category: 'Booking Management', description: 'Create new bookings' },
  { id: 'booking_edit', name: 'Edit Bookings', category: 'Booking Management', description: 'Modify existing bookings' },
  { id: 'finance_view', name: 'View Finance', category: 'Finance', description: 'View financial data and reports' },
  { id: 'finance_edit', name: 'Edit Finance', category: 'Finance', description: 'Modify financial records and transactions' },
];

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  const [errors, setErrors] = useState<{ name?: string; permissions?: string }>({});

  const permissionsByCategory = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const categories = Object.keys(permissionsByCategory);

  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterCategory === 'all') return matchesSearch;
    
    const rolePermissions = role.permissions;
    const categoryPermissions = permissionsByCategory[filterCategory] || [];
    const hasCategoryPermission = categoryPermissions.some(p => rolePermissions.includes(p.id));
    
    return matchesSearch && hasCategoryPermission;
  });

  const handleCardClick = (role: Role) => {
    setSelectedRole(role);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleCreateRole = () => {
    setFormData({ name: '', description: '', permissions: [] });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const handleEditRole = () => {
    if (!selectedRole) return;
    setFormData({
      name: selectedRole.name,
      description: selectedRole.description,
      permissions: [...selectedRole.permissions],
    });
    setErrors({});
    setIsEditMode(true);
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;
    if (selectedRole.employeeCount > 0) {
      alert(`Cannot delete role "${selectedRole.name}" because it is assigned to ${selectedRole.employeeCount} employee(s).`);
      return;
    }
    if (confirm(`Are you sure you want to delete the role "${selectedRole.name}"?`)) {
      setRoles(roles.filter((r) => r.id !== selectedRole.id));
      setIsModalOpen(false);
      setSelectedRole(null);
      alert('Role deleted successfully!');
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
    if (errors.permissions) {
      setErrors((prev) => ({ ...prev, permissions: undefined }));
    }
  };

  const handleCategoryToggle = (category: string) => {
    const categoryPermissions = permissionsByCategory[category] || [];
    const categoryPermissionIds = categoryPermissions.map((p) => p.id);
    const allSelected = categoryPermissionIds.every((id) => formData.permissions.includes(id));

    setFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((id) => !categoryPermissionIds.includes(id))
        : [...new Set([...prev.permissions, ...categoryPermissionIds])],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; permissions?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    }
    if (formData.permissions.length === 0) {
      newErrors.permissions = 'At least one permission must be selected';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveRole = () => {
    if (!validateForm()) return;

    if (isEditMode && selectedRole) {
      // Update existing role
      const updatedRoles = roles.map((role) =>
        role.id === selectedRole.id
          ? {
              ...role,
              name: formData.name,
              description: formData.description,
              permissions: formData.permissions,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : role
      );
      setRoles(updatedRoles);
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedRole(null);
      alert('Role updated successfully!');
    } else {
      // Create new role
      const newRole: Role = {
        id: crypto.randomUUID(),
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
        employeeCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setRoles([...roles, newRole]);
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '', permissions: [] });
      alert('Role created successfully!');
    }
  };

  const handleCancel = () => {
    setIsCreateModalOpen(false);
    setIsModalOpen(false);
    setIsEditMode(false);
    setFormData({ name: '', description: '', permissions: [] });
    setErrors({});
    setSelectedRole(null);
  };

  return (
    <ModuleLayout
      title="Role Management"
      description="Manage employee roles and permissions"
    >
      {/* Header with Search, Filter, and Create Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search roles by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCreateRole}
          className="px-6 py-2 rounded-2xl bg-amber-600 text-white font-medium transition-all hover:bg-amber-700 hover:scale-105 shadow-md hover:shadow-lg"
        >
          + Create Role
        </button>
      </div>

      {/* Roles Grid */}
      {filteredRoles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <ElevatedCard
              key={role.id}
              onClick={() => handleCardClick(role)}
              elevation="lg"
              className="cursor-pointer transition-all hover:scale-[1.02]"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{role.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{role.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-700 text-xs font-semibold whitespace-nowrap ml-2">
                    {role.employeeCount} {role.employeeCount === 1 ? 'user' : 'users'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    {role.permissions.length} {role.permissions.length === 1 ? 'permission' : 'permissions'}
                  </span>
                  <span className="text-xs text-gray-400">
                    Updated: {new Date(role.updatedAt).toLocaleDateString()}
                  </span>
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <p className="text-gray-600">
            {searchTerm || filterCategory !== 'all'
              ? 'No roles found matching your criteria.'
              : 'No roles created yet. Create your first role to get started.'}
          </p>
        </ModernCard>
      )}

      {/* Role Detail/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={isEditMode ? `Edit Role: ${selectedRole?.name}` : selectedRole?.name}
        size="lg"
      >
        {selectedRole && !isEditMode && (
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-4">{selectedRole.description}</p>
              <div className="flex gap-2 text-sm text-gray-500">
                <span>Created: {new Date(selectedRole.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Updated: {new Date(selectedRole.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Permissions Display */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(permissionsByCategory).map(([category, perms]) => {
                  const categoryPermissionIds = perms.map((p) => p.id);
                  const hasAnyPermission = categoryPermissionIds.some((id) =>
                    selectedRole.permissions.includes(id)
                  );
                  
                  if (!hasAnyPermission) return null;

                  return (
                    <div key={category} className="space-y-2">
                      <h5 className="text-sm font-semibold text-gray-700">{category}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {perms.map((perm) => (
                          <div
                            key={perm.id}
                            className={`flex items-start gap-2 p-3 rounded-xl ${
                              selectedRole.permissions.includes(perm.id)
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedRole.permissions.includes(perm.id)}
                              readOnly
                              className="w-4 h-4 mt-0.5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-900 block">
                                {perm.name}
                              </span>
                              <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleEditRole}
                className="flex-1 px-4 py-2 rounded-2xl bg-amber-600 text-white font-medium transition-all hover:bg-amber-700 hover:scale-105 shadow-md"
              >
                Edit Role
              </button>
              <button
                onClick={handleDeleteRole}
                disabled={selectedRole.employeeCount > 0}
                className="flex-1 px-4 py-2 rounded-2xl border-2 border-red-500 text-red-600 font-medium transition-all hover:bg-red-50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Role
              </button>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {selectedRole && isEditMode && (
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Enter role name..."
                className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-amber-500 focus:border-transparent'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role and its responsibilities..."
                rows={3}
                className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Select Permissions</h4>
                <span className="text-sm text-gray-500">
                  {formData.permissions.length} selected
                </span>
              </div>
              {errors.permissions && (
                <p className="mb-2 text-xs text-red-500">{errors.permissions}</p>
              )}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(permissionsByCategory).map(([category, perms]) => {
                  const categoryPermissionIds = perms.map((p) => p.id);
                  const allSelected = categoryPermissionIds.every((id) =>
                    formData.permissions.includes(id)
                  );
                  const someSelected = categoryPermissionIds.some((id) =>
                    formData.permissions.includes(id)
                  );

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(input) => {
                            if (input) input.indeterminate = someSelected && !allSelected;
                          }}
                          onChange={() => handleCategoryToggle(category)}
                          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                        />
                        <h5 className="text-sm font-semibold text-gray-700">{category}</h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-6">
                        {perms.map((perm) => (
                          <label
                            key={perm.id}
                            className={`flex items-start gap-2 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
                              formData.permissions.includes(perm.id)
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(perm.id)}
                              onChange={() => handlePermissionToggle(perm.id)}
                              className="w-4 h-4 mt-0.5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-900 block">
                                {perm.name}
                              </span>
                              <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 rounded-2xl border-2 border-gray-300 text-gray-700 font-medium transition-all hover:bg-gray-50 hover:scale-105 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                className="flex-1 px-4 py-2 rounded-2xl bg-amber-600 text-white font-medium transition-all hover:bg-amber-700 hover:scale-105 shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Role Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCancel}
        title="Create New Role"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g., Manager, Staff, Admin"
              className={`w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-amber-500 focus:border-transparent'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role and its responsibilities..."
              rows={3}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Select Permissions</h4>
              <span className="text-sm text-gray-500">
                {formData.permissions.length} selected
              </span>
            </div>
            {errors.permissions && (
              <p className="mb-2 text-xs text-red-500">{errors.permissions}</p>
            )}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(permissionsByCategory).map(([category, perms]) => {
                const categoryPermissionIds = perms.map((p) => p.id);
                const allSelected = categoryPermissionIds.every((id) =>
                  formData.permissions.includes(id)
                );
                const someSelected = categoryPermissionIds.some((id) =>
                  formData.permissions.includes(id)
                );

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = someSelected && !allSelected;
                        }}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <h5 className="text-sm font-semibold text-gray-700">{category}</h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-6">
                      {perms.map((perm) => (
                        <label
                          key={perm.id}
                          className={`flex items-start gap-2 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
                            formData.permissions.includes(perm.id)
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(perm.id)}
                            onChange={() => handlePermissionToggle(perm.id)}
                            className="w-4 h-4 mt-0.5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900 block">
                              {perm.name}
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 rounded-2xl border-2 border-gray-300 text-gray-700 font-medium transition-all hover:bg-gray-50 hover:scale-105 shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRole}
              className="flex-1 px-4 py-2 rounded-2xl bg-amber-600 text-white font-medium transition-all hover:bg-amber-700 hover:scale-105 shadow-md"
            >
              Create Role
            </button>
          </div>
        </div>
      </Modal>
    </ModuleLayout>
  );
}
