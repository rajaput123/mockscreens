'use client';

import { useState } from 'react';
import { navigationMenus } from '../../components/navigation/navigationData';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import HelpButton from '../../components/help/HelpButton';
import { colors, spacing, typography, shadows } from '../../design-system';
import { ModernCard, ElevatedCard } from '../components';
import AddEmployeeModal from './components/AddEmployeeModal';

export default function EmployeeManagementPage() {
  const module = navigationMenus.people.find(m => m.id === 'employee-management');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  if (!module) {
    return <div>Module not found</div>;
  }

  // Mock data - in real app, this would come from API
  const stats = {
    totalEmployees: 24,
    activeEmployees: 22,
    inactiveEmployees: 2,
    totalRoles: 8,
    pendingRequests: 3,
    newThisMonth: 2,
  };

  const recentEmployees = [
    { name: 'Arjun Rao', role: 'Operations Manager', joinDate: '2024-01-15', status: 'active' },
    { name: 'Meera Iyer', role: 'HR Executive', joinDate: '2024-01-10', status: 'active' },
    { name: 'Karthik Sharma', role: 'Accounts Officer', joinDate: '2024-01-05', status: 'active' },
  ];

  const departments = [
    { name: 'Operations', count: 8, color: colors.primary.base },
    { name: 'Human Resources', count: 5, color: colors.success.base },
    { name: 'Finance', count: 4, color: colors.warning.base },
    { name: 'Administration', count: 3, color: colors.info.base },
    { name: 'Security', count: 4, color: colors.error.base },
  ];

  return (
    <ModuleLayout
      title="Employee Management"
      description="Manage employees, roles, and access controls"
    >
      <ModuleNavigation
        subServices={module.subServices}
        functions={module.functions}
        moduleId={module.id}
        category="people"
      />

      {/* Quick Action Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 rounded-2xl transition-all hover:scale-105"
          style={{
            backgroundColor: colors.primary.base,
            color: '#ffffff',
            fontFamily: typography.body.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: 600,
            boxShadow: shadows.md,
          }}
        >
          + Add New Employee
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ModernCard elevation="md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: colors.text.muted,
                }}
              >
                Total Employees
              </h3>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: colors.primary.light,
                }}
              >
                <svg width="20" height="20" fill="none" stroke={colors.primary.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p
              style={{
                fontFamily: typography.kpi.fontFamily,
                fontSize: '32px',
                fontWeight: typography.kpi.fontWeight,
                color: colors.text.primary,
              }}
            >
              {stats.totalEmployees}
            </p>
            <p
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.75rem',
                color: colors.text.muted,
                marginTop: spacing.xs,
              }}
            >
              {stats.activeEmployees} active, {stats.inactiveEmployees} inactive
            </p>
          </div>
        </ModernCard>

        <ModernCard elevation="md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: colors.text.muted,
                }}
              >
                Active Roles
              </h3>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: colors.success.light,
                }}
              >
                <svg width="20" height="20" fill="none" stroke={colors.success.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <p
              style={{
                fontFamily: typography.kpi.fontFamily,
                fontSize: '32px',
                fontWeight: typography.kpi.fontWeight,
                color: colors.text.primary,
              }}
            >
              {stats.totalRoles}
            </p>
            <p
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.75rem',
                color: colors.text.muted,
                marginTop: spacing.xs,
              }}
            >
              Roles configured
            </p>
          </div>
        </ModernCard>

        <ModernCard elevation="md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: colors.text.muted,
                }}
              >
                Pending Requests
              </h3>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: colors.warning.light,
                }}
              >
                <svg width="20" height="20" fill="none" stroke={colors.warning.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p
              style={{
                fontFamily: typography.kpi.fontFamily,
                fontSize: '32px',
                fontWeight: typography.kpi.fontWeight,
                color: colors.text.primary,
              }}
            >
              {stats.pendingRequests}
            </p>
            <p
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.75rem',
                color: colors.text.muted,
                marginTop: spacing.xs,
              }}
            >
              Access requests pending
            </p>
          </div>
        </ModernCard>

        <ModernCard elevation="md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: colors.text.muted,
                }}
              >
                New This Month
              </h3>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: colors.info.light,
                }}
              >
                <svg width="20" height="20" fill="none" stroke={colors.info.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <p
              style={{
                fontFamily: typography.kpi.fontFamily,
                fontSize: '32px',
                fontWeight: typography.kpi.fontWeight,
                color: colors.text.primary,
              }}
            >
              {stats.newThisMonth}
            </p>
            <p
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.75rem',
                color: colors.text.muted,
                marginTop: spacing.xs,
              }}
            >
              Employees joined
            </p>
          </div>
        </ModernCard>
      </div>

      {/* Department Distribution & Recent Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department Distribution */}
        <ElevatedCard elevation="lg">
          <div className="p-6">
            <h2
              style={{
                fontFamily: typography.sectionHeader.fontFamily,
                fontSize: typography.sectionHeader.fontSize,
                fontWeight: typography.sectionHeader.fontWeight,
                color: colors.text.primary,
                marginBottom: spacing.lg,
              }}
            >
              Department Distribution
            </h2>
            <div className="space-y-4">
              {departments.map((dept, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        fontWeight: 500,
                        color: colors.text.primary,
                      }}
                    >
                      {dept.name}
                    </span>
                    <span
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        fontWeight: 600,
                        color: colors.text.primary,
                      }}
                    >
                      {dept.count}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: colors.background.subtle,
                    }}
                  >
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${(dept.count / stats.totalEmployees) * 100}%`,
                        backgroundColor: dept.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ElevatedCard>

        {/* Recent Employees */}
        <ElevatedCard elevation="lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2
                style={{
                  fontFamily: typography.sectionHeader.fontFamily,
                  fontSize: typography.sectionHeader.fontSize,
                  fontWeight: typography.sectionHeader.fontWeight,
                  color: colors.text.primary,
                }}
              >
                Recent Employees
              </h2>
              <a
                href="/people/employee-management/employee-directory"
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: '0.875rem',
                  color: colors.primary.base,
                  textDecoration: 'none',
                }}
              >
                View All →
              </a>
            </div>
            <div className="space-y-4">
              {recentEmployees.map((emp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: colors.background.subtle,
                    boxShadow: shadows.sm,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        fontWeight: 600,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {emp.name}
                    </p>
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '0.875rem',
                        color: colors.text.muted,
                      }}
                    >
                      {emp.role}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className="inline-block px-3 py-1 rounded-xl text-xs"
                      style={{
                        backgroundColor: colors.success.light,
                        color: colors.success.dark,
                        fontFamily: typography.body.fontFamily,
                        fontWeight: 500,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {emp.status}
                    </span>
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '0.75rem',
                        color: colors.text.muted,
                      }}
                    >
                      {new Date(emp.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ElevatedCard>
      </div>

      {/* Quick Actions */}
      <ModernCard elevation="md">
        <div className="p-6">
          <h2
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              color: colors.text.primary,
              marginBottom: spacing.lg,
            }}
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/people/employee-management/employee-directory"
              className="p-4 rounded-2xl transition-all hover:scale-105 text-center"
              style={{
                backgroundColor: colors.background.subtle,
                boxShadow: shadows.sm,
                textDecoration: 'none',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{
                  backgroundColor: colors.primary.light,
                }}
              >
                <svg width="24" height="24" fill="none" stroke={colors.primary.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                  color: colors.text.primary,
                }}
              >
                Employee Directory
              </p>
            </a>

            <a
              href="/people/employee-management/role-management"
              className="p-4 rounded-2xl transition-all hover:scale-105 text-center"
              style={{
                backgroundColor: colors.background.subtle,
                boxShadow: shadows.sm,
                textDecoration: 'none',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{
                  backgroundColor: colors.success.light,
                }}
              >
                <svg width="24" height="24" fill="none" stroke={colors.success.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                  color: colors.text.primary,
                }}
              >
                Role Management
              </p>
            </a>

            <a
              href="/people/employee-management/access-control"
              className="p-4 rounded-2xl transition-all hover:scale-105 text-center"
              style={{
                backgroundColor: colors.background.subtle,
                boxShadow: shadows.sm,
                textDecoration: 'none',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{
                  backgroundColor: colors.warning.light,
                }}
              >
                <svg width="24" height="24" fill="none" stroke={colors.warning.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                  color: colors.text.primary,
                }}
              >
                Access Control
              </p>
            </a>

            <a
              href="/people/employee-management/update-role"
              className="p-4 rounded-2xl transition-all hover:scale-105 text-center"
              style={{
                backgroundColor: colors.background.subtle,
                boxShadow: shadows.sm,
                textDecoration: 'none',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{
                  backgroundColor: colors.info.light,
                }}
              >
                <svg width="24" height="24" fill="none" stroke={colors.info.base} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                  color: colors.text.primary,
                }}
              >
                Update Roles
              </p>
            </a>
          </div>
        </div>
      </ModernCard>

      <HelpButton module="employee-management" />

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(data) => {
          console.log('Employee saved:', data);
          setIsAddModalOpen(false);
        }}
      />
    </ModuleLayout>
  );
}
