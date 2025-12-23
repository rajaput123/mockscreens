'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography } from '../../../design-system';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  joinDate: string;
  employeeId: string;
}

interface EmployeeFormData {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const initialEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'Arjun Rao',
    email: 'arjun.rao@example.com',
    phone: '+91 98765 43210',
    role: 'Operations Manager',
    department: 'Operations',
    status: 'active',
    joinDate: '2022-01-15',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Meera Iyer',
    email: 'meera.iyer@example.com',
    phone: '+91 98765 43211',
    role: 'HR Executive',
    department: 'Human Resources',
    status: 'active',
    joinDate: '2023-03-01',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Karthik Sharma',
    email: 'karthik.sharma@example.com',
    phone: '+91 98765 43212',
    role: 'Accounts Officer',
    department: 'Finance',
    status: 'inactive',
    joinDate: '2021-08-10',
  },
];

export default function AddEmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [formData, setFormData] = useState<EmployeeFormData>({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: 'active',
    joinDate: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || emp.role === filterRole;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + pageSize);

  const uniqueRoles = Array.from(new Set(employees.map((e) => e.role))).filter(Boolean);

  const handleRowClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  };

  const handleFormChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};

    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.joinDate.trim()) newErrors.joinDate = 'Join date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const newEmployee: Employee = {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        department: formData.department,
        status: formData.status,
        joinDate: formData.joinDate,
        employeeId: formData.employeeId,
      };

      setEmployees((prev) => [newEmployee, ...prev]);
      setIsAddModalOpen(false);
      setFormData({
        employeeId: '',
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        status: 'active',
        joinDate: '',
      });
      setCurrentPage(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModuleLayout
      title="Add / Update Employee"
      description="Add employees and manage them in a table"
    >
      {/* Search, Filters & Add Button */}
      <div
        className="rounded-3xl p-6 mb-6"
        style={{
          backgroundColor: colors.background.base,
          border: `1px solid ${colors.border}`,
          padding: spacing.xl,
        }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            {/* Search */}
            <div>
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

            {/* Role Filter */}
            <div>
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
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
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
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Add Employee Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-2 rounded-2xl transition-all hover:scale-105"
              style={{
                backgroundColor: colors.primary.base,
                color: '#ffffff',
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                fontWeight: 500,
              }}
            >
              + Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          backgroundColor: colors.background.base,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: colors.border }}>
            <thead
              style={{
                backgroundColor: colors.background.subtle,
              }}
            >
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{
                    fontFamily: typography.body.fontFamily,
                    color: colors.text.muted,
                  }}
                >
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{
                    fontFamily: typography.body.fontFamily,
                    color: colors.text.muted,
                  }}
                >
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{
                    fontFamily: typography.body.fontFamily,
                    color: colors.text.muted,
                  }}
                >
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{
                    fontFamily: typography.body.fontFamily,
                    color: colors.text.muted,
                  }}
                >
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{
                    fontFamily: typography.body.fontFamily,
                    color: colors.text.muted,
                  }}
                >
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{
                    fontFamily: typography.body.fontFamily,
                    color: colors.text.muted,
                  }}
                >
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{
                    fontFamily: typography.body.fontFamily,
                    color: colors.text.muted,
                  }}
                >
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{
                    fontFamily: typography.body.fontFamily,
                    color: colors.text.muted,
                  }}
                >
                  Join Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: colors.border }}>
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-amber-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(employee)}
                  >
                    <td className="px-4 py-3">
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                          fontWeight: 500,
                        }}
                      >
                        {employee.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {employee.employeeId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '13px',
                          color: colors.text.muted,
                        }}
                      >
                        {employee.email}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '13px',
                          color: colors.text.muted,
                        }}
                      >
                        {employee.phone}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-3 py-1 rounded-xl text-xs"
                        style={{
                          backgroundColor:
                            employee.status === 'active'
                              ? colors.success.light
                              : colors.error.light,
                          color:
                            employee.status === 'active'
                              ? colors.success.dark
                              : colors.error.dark,
                          fontFamily: typography.body.fontFamily,
                          fontWeight: 500,
                        }}
                      >
                        {employee.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '13px',
                          color: colors.text.primary,
                        }}
                      >
                        {employee.joinDate}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.muted,
                      }}
                    >
                      {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                        ? 'No employees found matching your criteria.'
                        : 'No employees added yet. Click "Add Employee" to create the first record.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredEmployees.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <span
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '12px',
              color: colors.text.muted,
            }}
          >
            Page {safeCurrentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className="px-4 py-1 rounded-2xl border text-sm disabled:opacity-50"
              style={{
                borderColor: colors.border,
                color: colors.text.primary,
                fontFamily: typography.body.fontFamily,
              }}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              className="px-4 py-1 rounded-2xl border text-sm disabled:opacity-50"
              style={{
                borderColor: colors.border,
                color: colors.text.primary,
                fontFamily: typography.body.fontFamily,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedEmployee?.name}
        size="md"
      >
        {selectedEmployee && (
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
                  Employee ID
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedEmployee.employeeId}
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
                  Role
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedEmployee.role}
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
                  Department
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedEmployee.department}
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
                      selectedEmployee.status === 'active'
                        ? colors.success.light
                        : colors.error.light,
                    color:
                      selectedEmployee.status === 'active'
                        ? colors.success.dark
                        : colors.error.dark,
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {selectedEmployee.status === 'active' ? 'Active' : 'Inactive'}
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
                  {selectedEmployee.email}
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
                  {selectedEmployee.phone}
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
                  {selectedEmployee.joinDate}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Employee"
        size="lg"
      >
        <form onSubmit={handleAddEmployee} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Employee ID *
                </span>
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => handleFormChange('employeeId', e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.employeeId ? colors.error.base : colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              />
              {errors.employeeId && (
                <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
                  {errors.employeeId}
                </p>
              )}
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
                  Name *
                </span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.name ? colors.error.base : colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              />
              {errors.name && (
                <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
                  {errors.name}
                </p>
              )}
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
                  Email *
                </span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.email ? colors.error.base : colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              />
              {errors.email && (
                <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
                  {errors.email}
                </p>
              )}
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
                  Phone *
                </span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.phone ? colors.error.base : colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              />
              {errors.phone && (
                <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Role & Department */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  Role *
                </span>
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => handleFormChange('role', e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.role ? colors.error.base : colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              />
              {errors.role && (
                <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
                  {errors.role}
                </p>
              )}
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
                  Department *
                </span>
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleFormChange('department', e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.department ? colors.error.base : colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              />
              {errors.department && (
                <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
                  {errors.department}
                </p>
              )}
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
                  Status
                </span>
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleFormChange('status', e.target.value as EmployeeFormData['status'])
                }
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                style={{
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Join Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  Join Date *
                </span>
              </label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => handleFormChange('joinDate', e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.joinDate ? colors.error.base : colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              />
              {errors.joinDate && (
                <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
                  {errors.joinDate}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-6 py-2 rounded-2xl border-2 transition-all hover:scale-105"
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
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-2xl transition-all hover:scale-105 disabled:opacity-50"
              style={{
                backgroundColor: colors.primary.base,
                color: '#ffffff',
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                fontWeight: 500,
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </Modal>
    </ModuleLayout>
  );
}
