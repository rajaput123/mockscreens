/**
 * Role-Based Access Control (RBAC) utilities for People & Communications module
 */

export type UserRole =
  | 'temple_administrator'
  | 'operations_manager'
  | 'hr_admin'
  | 'pr_content_team'
  | 'trustee';

export type Permission =
  | 'people.employee.view'
  | 'people.employee.create'
  | 'people.employee.edit'
  | 'people.employee.delete'
  | 'people.volunteer.view'
  | 'people.volunteer.create'
  | 'people.volunteer.assign'
  | 'people.volunteer.delete'
  | 'people.freelancer.view'
  | 'people.freelancer.create'
  | 'people.freelancer.edit'
  | 'people.freelancer.delete'
  | 'people.devotee.view'
  | 'people.devotee.create'
  | 'people.devotee.edit'
  | 'people.devotee.delete'
  | 'people.vip.view'
  | 'people.vip.manage'
  | 'people.content.create'
  | 'people.content.edit'
  | 'people.content.approve'
  | 'people.content.publish'
  | 'people.communications.send'
  | 'people.communications.schedule'
  | 'people.communications.view'
  | 'people.audit.view';

const rolePermissions: Record<UserRole, Permission[]> = {
  temple_administrator: [
    'people.employee.view',
    'people.employee.create',
    'people.employee.edit',
    'people.employee.delete',
    'people.volunteer.view',
    'people.volunteer.create',
    'people.volunteer.assign',
    'people.volunteer.delete',
    'people.freelancer.view',
    'people.freelancer.create',
    'people.freelancer.edit',
    'people.freelancer.delete',
    'people.devotee.view',
    'people.devotee.create',
    'people.devotee.edit',
    'people.devotee.delete',
    'people.vip.view',
    'people.vip.manage',
    'people.content.create',
    'people.content.edit',
    'people.content.approve',
    'people.content.publish',
    'people.communications.send',
    'people.communications.schedule',
    'people.communications.view',
    'people.audit.view',
  ],
  operations_manager: [
    'people.employee.view',
    'people.volunteer.view',
    'people.volunteer.create',
    'people.volunteer.assign',
    'people.freelancer.view',
    'people.devotee.view',
    'people.vip.view',
    'people.communications.view',
  ],
  hr_admin: [
    'people.employee.view',
    'people.employee.create',
    'people.employee.edit',
    'people.volunteer.view',
    'people.volunteer.create',
    'people.freelancer.view',
    'people.freelancer.create',
    'people.freelancer.edit',
  ],
  pr_content_team: [
    'people.content.create',
    'people.content.edit',
    'people.communications.send',
    'people.communications.schedule',
    'people.communications.view',
  ],
  trustee: [
    'people.employee.view',
    'people.volunteer.view',
    'people.freelancer.view',
    'people.devotee.view',
    'people.audit.view',
  ],
};

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role] ?? [];
}

/**
 * Check if user can view a specific module
 */
export function canViewModule(role: UserRole, module: string): boolean {
  const viewPermission = `people.${module}.view` as Permission;
  return hasPermission(role, viewPermission) || hasPermission(role, 'people.audit.view');
}

/**
 * Check if user can edit a specific module
 */
export function canEditModule(role: UserRole, module: string): boolean {
  const editPermission = `people.${module}.edit` as Permission;
  return hasPermission(role, editPermission) || hasPermission(role, 'people.audit.view');
}

/**
 * Get current user role (mock - replace with actual auth)
 */
export function getCurrentUserRole(): UserRole {
  // TODO: Replace with actual authentication
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user_role');
    if (stored && Object.keys(rolePermissions).includes(stored)) {
      return stored as UserRole;
    }
  }
  return 'operations_manager'; // Default role
}

/**
 * Check if current user has permission
 */
export function checkPermission(permission: Permission): boolean {
  const role = getCurrentUserRole();
  return hasPermission(role, permission);
}

