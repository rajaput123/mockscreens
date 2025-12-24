/**
 * Role-based Access Control for Kitchen & Prasad Module
 */

export type UserRole = 
  | 'temple_administrator'
  | 'operations_manager'
  | 'kitchen_manager'
  | 'kitchen_staff'
  | 'counter_staff'
  | 'finance'
  | 'auditor';

export interface RolePermissions {
  canViewPlanning: boolean;
  canCreatePlans: boolean;
  canModifyPlans: boolean;
  canDeletePlans: boolean;
  canChangeCategory: boolean;
  canViewFinancialData: boolean;
  canModifyFinancialData: boolean;
  canViewAuditTrail: boolean;
  canRecordWastage: boolean;
  canDistributeCounter: boolean;
  canDistributeSeva: boolean;
  canDistributeAnnadan: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  temple_administrator: {
    canViewPlanning: true,
    canCreatePlans: true,
    canModifyPlans: true,
    canDeletePlans: true,
    canChangeCategory: true,
    canViewFinancialData: true,
    canModifyFinancialData: false, // Finance module handles this
    canViewAuditTrail: true,
    canRecordWastage: true,
    canDistributeCounter: true,
    canDistributeSeva: true,
    canDistributeAnnadan: true,
  },
  operations_manager: {
    canViewPlanning: true,
    canCreatePlans: true,
    canModifyPlans: true,
    canDeletePlans: true,
    canChangeCategory: true,
    canViewFinancialData: false, // No financial data in kitchen module
    canModifyFinancialData: false,
    canViewAuditTrail: true,
    canRecordWastage: true,
    canDistributeCounter: true,
    canDistributeSeva: true,
    canDistributeAnnadan: true,
  },
  kitchen_manager: {
    canViewPlanning: true,
    canCreatePlans: true,
    canModifyPlans: true,
    canDeletePlans: false, // Only if not distributed
    canChangeCategory: false, // Cannot change category
    canViewFinancialData: false,
    canModifyFinancialData: false,
    canViewAuditTrail: true,
    canRecordWastage: true,
    canDistributeCounter: true,
    canDistributeSeva: true,
    canDistributeAnnadan: true,
  },
  kitchen_staff: {
    canViewPlanning: true,
    canCreatePlans: false,
    canModifyPlans: false,
    canDeletePlans: false,
    canChangeCategory: false,
    canViewFinancialData: false,
    canModifyFinancialData: false,
    canViewAuditTrail: false,
    canRecordWastage: true,
    canDistributeCounter: false,
    canDistributeSeva: false,
    canDistributeAnnadan: true,
  },
  counter_staff: {
    canViewPlanning: false,
    canCreatePlans: false,
    canModifyPlans: false,
    canDeletePlans: false,
    canChangeCategory: false,
    canViewFinancialData: false,
    canModifyFinancialData: false,
    canViewAuditTrail: false,
    canRecordWastage: false,
    canDistributeCounter: true,
    canDistributeSeva: false,
    canDistributeAnnadan: false,
  },
  finance: {
    canViewPlanning: false,
    canCreatePlans: false,
    canModifyPlans: false,
    canDeletePlans: false,
    canChangeCategory: false,
    canViewFinancialData: true,
    canModifyFinancialData: true,
    canViewAuditTrail: true,
    canRecordWastage: false,
    canDistributeCounter: false,
    canDistributeSeva: false,
    canDistributeAnnadan: false,
  },
  auditor: {
    canViewPlanning: true,
    canCreatePlans: false,
    canModifyPlans: false,
    canDeletePlans: false,
    canChangeCategory: false,
    canViewFinancialData: true,
    canModifyFinancialData: false,
    canViewAuditTrail: true,
    canRecordWastage: false,
    canDistributeCounter: false,
    canDistributeSeva: false,
    canDistributeAnnadan: false,
  },
};

/**
 * Get permissions for a role
 */
export function getRolePermissions(role: UserRole): RolePermissions {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.kitchen_staff;
}

/**
 * Check if user can modify plan category
 * Even with permissions, category cannot be changed after distribution starts
 */
export function canModifyCategory(
  role: UserRole,
  planDistributionStarted: boolean,
  planCategoryLocked: boolean
): boolean {
  const permissions = getRolePermissions(role);
  if (!permissions.canChangeCategory) return false;
  if (planDistributionStarted || planCategoryLocked) return false;
  return true;
}

/**
 * Check if user can view financial data
 * Financial data is never shown in kitchen module
 */
export function canViewFinancialData(role: UserRole): boolean {
  // Financial data is handled by finance module, not kitchen module
  return false;
}

/**
 * Get current user role (mock - replace with actual auth)
 */
export function getCurrentUserRole(): UserRole {
  // In production, get from auth context
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user_role');
    if (stored && Object.keys(ROLE_PERMISSIONS).includes(stored)) {
      return stored as UserRole;
    }
  }
  return 'kitchen_staff'; // Default
}

