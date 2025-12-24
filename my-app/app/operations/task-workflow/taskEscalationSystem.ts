/**
 * ESCALATION SYSTEM
 * 
 * Monitors tasks for SLA violations and automatically escalates
 * based on configured rules. Notifies relevant roles when tasks are escalated.
 */

import {
  TempleTask,
  TaskStatus,
  EscalationRule,
  UserRole,
  getAllTasks,
  saveTask,
  addAuditLogEntry,
  getTasksByDate,
  getDelayedTasks,
} from './templeTaskData';

// ============================================================================
// ESCALATION RULES
// ============================================================================

export const defaultEscalationRules: EscalationRule[] = [
  {
    id: 'rule-critical',
    name: 'Critical Priority Escalation',
    priority: 'critical',
    slaMinutes: 30,
    notifyRoles: ['temple-administrator', 'operations-manager'],
    autoEscalate: true,
    isActive: true,
  },
  {
    id: 'rule-high',
    name: 'High Priority Escalation',
    priority: 'high',
    slaMinutes: 60,
    notifyRoles: ['operations-manager'],
    autoEscalate: true,
    isActive: true,
  },
  {
    id: 'rule-medium',
    name: 'Medium Priority Escalation',
    priority: 'medium',
    slaMinutes: 120,
    notifyRoles: ['operations-manager'],
    autoEscalate: true,
    isActive: true,
  },
  {
    id: 'rule-ritual',
    name: 'Ritual Task Escalation',
    taskFunction: 'ritual',
    slaMinutes: 30,
    notifyRoles: ['temple-administrator', 'operations-manager'],
    autoEscalate: true,
    isActive: true,
  },
  {
    id: 'rule-kitchen',
    name: 'Kitchen Task Escalation',
    taskFunction: 'kitchen',
    slaMinutes: 45,
    notifyRoles: ['kitchen-manager', 'operations-manager'],
    autoEscalate: true,
    isActive: true,
  },
];

// ============================================================================
// ESCALATION CHECKER
// ============================================================================

export interface EscalationCheckResult {
  escalatedTasks: TempleTask[];
  notifications: EscalationNotification[];
}

export interface EscalationNotification {
  taskId: string;
  taskTitle: string;
  notifiedRoles: UserRole[];
  escalationReason: string;
  timestamp: string;
}

/**
 * Check all tasks for SLA violations and escalate if needed
 */
export function checkAndEscalateTasks(
  date?: string,
  rules: EscalationRule[] = defaultEscalationRules
): EscalationCheckResult {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const tasks = getTasksByDate(targetDate);
  
  const escalatedTasks: TempleTask[] = [];
  const notifications: EscalationNotification[] = [];

  // Filter active rules
  const activeRules = rules.filter(r => r.isActive);

  tasks.forEach(task => {
    // Skip if already completed or escalated
    if (task.status === 'completed' || task.status === 'escalated') {
      return;
    }

    // Find applicable rule
    const applicableRule = activeRules.find(rule => {
      if (rule.taskType && rule.taskType !== task.type) return false;
      if (rule.taskFunction && rule.taskFunction !== task.function) return false;
      if (rule.priority && rule.priority !== task.priority) return false;
      return true;
    });

    if (!applicableRule) return;

    // Check if SLA is violated
    const isSlaViolated = checkSlaViolation(task, applicableRule.slaMinutes);

    if (isSlaViolated && applicableRule.autoEscalate) {
      // Escalate the task
      const escalatedTask = escalateTask(task, applicableRule);
      escalatedTasks.push(escalatedTask);
      
      // Create notification
      notifications.push({
        taskId: task.id,
        taskTitle: task.title,
        notifiedRoles: applicableRule.notifyRoles,
        escalationReason: `SLA violation: Task not completed within ${applicableRule.slaMinutes} minutes`,
        timestamp: new Date().toISOString(),
      });
    }
  });

  return { escalatedTasks, notifications };
}

/**
 * Check if a task has violated its SLA
 */
function checkSlaViolation(task: TempleTask, slaMinutes: number): boolean {
  if (!task.scheduledTime || !task.scheduledDate) return false;
  
  const scheduledDateTime = new Date(`${task.scheduledDate}T${task.scheduledTime}`);
  const now = new Date();
  const elapsedMinutes = (now.getTime() - scheduledDateTime.getTime()) / (1000 * 60);
  
  return elapsedMinutes > slaMinutes;
}

/**
 * Escalate a task
 */
function escalateTask(task: TempleTask, rule: EscalationRule): TempleTask {
  const escalatedTask: TempleTask = {
    ...task,
    status: 'escalated',
    escalatedAt: new Date().toISOString(),
    escalatedBy: 'system',
    escalationReason: `Auto-escalated: SLA violation (${rule.slaMinutes} minutes exceeded)`,
    updatedDate: new Date().toISOString(),
    updatedBy: 'system',
  };

  // Add audit log entry
  escalatedTask.auditLog.push({
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    action: 'escalated',
    userId: 'system',
    userName: 'System',
    userRole: 'system',
    details: `Auto-escalated due to SLA violation. Rule: ${rule.name}`,
    previousValue: task.status,
    newValue: 'escalated',
  });

  saveTask(escalatedTask);
  return escalatedTask;
}

/**
 * Manually escalate a task
 */
export function manuallyEscalateTask(
  taskId: string,
  reason: string,
  userId: string,
  userName: string,
  userRole: UserRole
): TempleTask | null {
  const tasks = getAllTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) return null;
  if (task.status === 'completed') return null; // Can't escalate completed tasks

  const escalatedTask: TempleTask = {
    ...task,
    status: 'escalated',
    escalatedAt: new Date().toISOString(),
    escalatedBy: userId,
    escalationReason: reason,
    updatedDate: new Date().toISOString(),
    updatedBy: userId,
  };

  // Add audit log entry
  escalatedTask.auditLog.push({
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    action: 'escalated',
    userId,
    userName,
    userRole,
    details: `Manually escalated: ${reason}`,
    previousValue: task.status,
    newValue: 'escalated',
  });

  saveTask(escalatedTask);
  return escalatedTask;
}

/**
 * Resolve an escalated task (change status back to in-progress or assigned)
 */
export function resolveEscalation(
  taskId: string,
  newStatus: TaskStatus,
  resolutionNotes: string,
  userId: string,
  userName: string,
  userRole: UserRole
): TempleTask | null {
  const tasks = getAllTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task || task.status !== 'escalated') return null;

  const resolvedTask: TempleTask = {
    ...task,
    status: newStatus,
    escalationReason: undefined, // Clear escalation reason
    notes: resolutionNotes,
    updatedDate: new Date().toISOString(),
    updatedBy: userId,
  };

  // Add audit log entry
  resolvedTask.auditLog.push({
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    action: 'status-changed',
    userId,
    userName,
    userRole,
    details: `Escalation resolved: ${resolutionNotes}`,
    previousValue: 'escalated',
    newValue: newStatus,
  });

  saveTask(resolvedTask);
  return resolvedTask;
}

// ============================================================================
// PERIODIC ESCALATION CHECKER
// ============================================================================

/**
 * Run escalation checks periodically (call this from a cron job or interval)
 */
export function startEscalationMonitor(intervalMinutes: number = 15): () => void {
  const intervalId = setInterval(() => {
    const today = new Date().toISOString().split('T')[0];
    const result = checkAndEscalateTasks(today);
    
    if (result.escalatedTasks.length > 0) {
      console.log(`Escalated ${result.escalatedTasks.length} tasks`);
      // TODO: Send notifications to relevant roles
      // This would integrate with your notification system
    }
  }, intervalMinutes * 60 * 1000);

  // Return cleanup function
  return () => clearInterval(intervalId);
}

/**
 * Get all escalated tasks for a date
 */
export function getEscalatedTasksForDate(date: string): TempleTask[] {
  const tasks = getTasksByDate(date);
  return tasks.filter(t => t.status === 'escalated');
}

/**
 * Get escalation statistics
 */
export function getEscalationStats(date: string): {
  totalEscalated: number;
  byPriority: Record<string, number>;
  byFunction: Record<string, number>;
  byType: Record<string, number>;
} {
  const escalated = getEscalatedTasksForDate(date);
  
  const byPriority: Record<string, number> = {};
  const byFunction: Record<string, number> = {};
  const byType: Record<string, number> = {};

  escalated.forEach(task => {
    byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
    byFunction[task.function] = (byFunction[task.function] || 0) + 1;
    byType[task.type] = (byType[task.type] || 0) + 1;
  });

  return {
    totalEscalated: escalated.length,
    byPriority,
    byFunction,
    byType,
  };
}

