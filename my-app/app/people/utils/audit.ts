/**
 * Audit logging utilities for People & Communications module
 */

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  entityId: string;
  entityType: string;
  changes?: Record<string, { old: any; new: any }>;
  metadata?: Record<string, any>;
}

export interface AccessLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'view' | 'edit' | 'delete' | 'export';
  module: string;
  entityId: string;
  entityType: string;
  ipAddress?: string;
  userAgent?: string;
}

const STORAGE_KEY_AUDIT = 'people_audit_logs';
const STORAGE_KEY_ACCESS = 'people_access_logs';

/**
 * Log an audit event
 */
export function logAudit(
  action: string,
  module: string,
  entityId: string,
  entityType: string,
  changes?: Record<string, { old: any; new: any }>,
  metadata?: Record<string, any>
): void {
  if (typeof window === 'undefined') return;

  try {
    const logs = getAuditLogs();
    const log: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: getCurrentUserId(),
      userName: getCurrentUserName(),
      action,
      module,
      entityId,
      entityType,
      changes,
      metadata,
    };

    logs.push(log);
    // Keep only last 1000 logs
    const recentLogs = logs.slice(-1000);
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(recentLogs));
  } catch (error) {
    console.error('Error logging audit:', error);
  }
}

/**
 * Log an access event
 */
export function logAccess(
  action: 'view' | 'edit' | 'delete' | 'export',
  module: string,
  entityId: string,
  entityType: string
): void {
  if (typeof window === 'undefined') return;

  try {
    const logs = getAccessLogs();
    const log: AccessLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: getCurrentUserId(),
      userName: getCurrentUserName(),
      action,
      module,
      entityId,
      entityType,
      ipAddress: getClientIP(),
      userAgent: navigator.userAgent,
    };

    logs.push(log);
    // Keep only last 1000 logs
    const recentLogs = logs.slice(-1000);
    localStorage.setItem(STORAGE_KEY_ACCESS, JSON.stringify(recentLogs));
  } catch (error) {
    console.error('Error logging access:', error);
  }
}

/**
 * Get all audit logs
 */
export function getAuditLogs(): AuditLog[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY_AUDIT);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading audit logs:', error);
    return [];
  }
}

/**
 * Get all access logs
 */
export function getAccessLogs(): AccessLog[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY_ACCESS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading access logs:', error);
    return [];
  }
}

/**
 * Get audit logs for a specific entity
 */
export function getEntityAuditLogs(entityId: string, entityType: string): AuditLog[] {
  return getAuditLogs().filter(
    (log) => log.entityId === entityId && log.entityType === entityType
  );
}

/**
 * Get access logs for a specific entity
 */
export function getEntityAccessLogs(entityId: string, entityType: string): AccessLog[] {
  return getAccessLogs().filter(
    (log) => log.entityId === entityId && log.entityType === entityType
  );
}

/**
 * Get audit logs for a module
 */
export function getModuleAuditLogs(module: string): AuditLog[] {
  return getAuditLogs().filter((log) => log.module === module);
}

// Helper functions (mock - replace with actual auth)
function getCurrentUserId(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_id') || 'unknown';
  }
  return 'unknown';
}

function getCurrentUserName(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_name') || 'Unknown User';
  }
  return 'Unknown User';
}

function getClientIP(): string {
  // Mock - in production, get from server
  return '127.0.0.1';
}

