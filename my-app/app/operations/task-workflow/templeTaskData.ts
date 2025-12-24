/**
 * TEMPLE TASK MANAGEMENT SYSTEM
 * 
 * Core Design Principle: Operational Readiness, Not Micromanagement
 * 
 * This system supports temple operations through:
 * - 5 distinct task types (Daily, Ritual, Event, Facility, Emergency)
 * - Simple lifecycle (Planned → Assigned → In Progress → Completed → Escalated)
 * - Role-based access control
 * - Auto-generation for routine and ritual tasks
 * - SLA-based escalations
 * - Complete audit trail
 */

// ============================================================================
// TASK TYPES
// ============================================================================

export type TaskType = 
  | 'daily-routine'      // Auto-generated daily tasks
  | 'ritual-seva'        // Linked to seva/ritual schedules
  | 'event-festival'     // Created from event templates
  | 'facility-safety'    // Preventive and readiness tasks
  | 'exception-emergency'; // Manual emergency tasks

export type TaskStatus = 
  | 'planned'           // Task created but not assigned
  | 'assigned'          // Task assigned to someone
  | 'in-progress'       // Task being executed
  | 'completed'         // Task finished
  | 'escalated';        // Task escalated due to delay/blocker

export type TaskPriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type TimeBlock = 
  | 'morning'      // 5 AM - 12 PM
  | 'afternoon'    // 12 PM - 5 PM
  | 'evening'      // 5 PM - 10 PM
  | 'night';       // 10 PM - 5 AM

export type TaskFunction = 
  | 'ritual'       // Ritual-related tasks
  | 'kitchen'      // Kitchen and prasad tasks
  | 'facility'     // Facility management
  | 'crowd'        // Crowd management
  | 'safety'       // Safety and emergency
  | 'general';     // General operations

// ============================================================================
// ROLE DEFINITIONS
// ============================================================================

export type UserRole = 
  | 'temple-administrator'  // Full access, audit logs
  | 'operations-manager'    // Plan, assign, escalate
  | 'ops-staff'             // Execute assigned tasks
  | 'priest-gurugal'        // View and execute ritual tasks
  | 'kitchen-manager'       // Kitchen operations
  | 'kitchen-staff'         // Kitchen execution
  | 'system';               // Auto-generated tasks

// ============================================================================
// TASK INTERFACE
// ============================================================================

export interface TempleTask {
  // Core Identity
  id: string;
  title: string;
  description: string;
  
  // Classification
  type: TaskType;
  function: TaskFunction;
  timeBlock: TimeBlock;
  
  // Status & Priority
  status: TaskStatus;
  priority: TaskPriority;
  
  // Assignment
  assigneeId?: string;
  assigneeName?: string;
  assigneeRole?: UserRole;
  assigneeAvatar?: string;
  
  // Timing
  scheduledDate: string;        // ISO date string (YYYY-MM-DD)
  scheduledTime?: string;        // HH:MM format
  dueDate?: string;              // ISO date string
  dueTime?: string;              // HH:MM format
  completedDate?: string;        // ISO date string
  completedTime?: string;        // HH:MM format
  
  // Dependencies & Links
  linkedSevaId?: string;        // For ritual-seva tasks
  linkedEventId?: string;         // For event-festival tasks
  dependencies: string[];         // Array of task IDs this depends on
  blockedBy: string[];           // Array of task IDs blocking this
  
  // SLA & Escalation
  slaMinutes?: number;            // SLA in minutes from scheduled time
  escalatedAt?: string;          // ISO timestamp
  escalatedBy?: string;          // User ID who escalated
  escalationReason?: string;
  
  // Execution Details
  estimatedDuration?: number;     // in minutes
  actualDuration?: number;        // in minutes
  notes?: string;                 // Execution notes
  
  // Metadata
  tags: string[];
  category: string;               // Legacy compatibility
  createdDate: string;            // ISO timestamp
  createdBy: string;              // User ID or 'system'
  createdByRole: UserRole;
  updatedDate: string;            // ISO timestamp
  updatedBy: string;              // User ID or 'system'
  
  // Audit Trail (invisible to executors)
  auditLog: AuditLogEntry[];
}

// ============================================================================
// AUDIT LOG
// ============================================================================

export interface AuditLogEntry {
  id: string;
  timestamp: string;              // ISO timestamp
  action: 'created' | 'assigned' | 'status-changed' | 'escalated' | 'completed' | 'updated';
  userId: string;
  userName: string;
  userRole: UserRole;
  details?: string;              // Additional context
  previousValue?: string;         // For status changes
  newValue?: string;              // For status changes
}

// ============================================================================
// TASK TEMPLATE (for auto-generation)
// ============================================================================

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  function: TaskFunction;
  timeBlock: TimeBlock;
  priority: TaskPriority;
  estimatedDuration?: number;
  slaMinutes?: number;
  dependencies: string[];         // Template IDs this depends on
  assigneeRole?: UserRole;        // Default role to assign
  tags: string[];
  isActive: boolean;
  createdDate: string;
  createdBy: string;
}

// ============================================================================
// ESCALATION RULE
// ============================================================================

export interface EscalationRule {
  id: string;
  name: string;
  taskType?: TaskType;
  taskFunction?: TaskFunction;
  priority?: TaskPriority;
  slaMinutes: number;             // Escalate if not completed within this time
  notifyRoles: UserRole[];        // Roles to notify on escalation
  autoEscalate: boolean;          // Auto-escalate or require manual
  isActive: boolean;
}

// ============================================================================
// READINESS METRICS
// ============================================================================

export interface ReadinessMetrics {
  date: string;                   // YYYY-MM-DD
  timeBlock: TimeBlock;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  delayedTasks: number;
  escalatedTasks: number;
  readinessPercentage: number;    // 0-100
  criticalBlockers: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getTaskTypeLabel(type: TaskType): string {
  const labels: Record<TaskType, string> = {
    'daily-routine': 'Daily Routine',
    'ritual-seva': 'Ritual / Seva',
    'event-festival': 'Event / Festival',
    'facility-safety': 'Facility & Safety',
    'exception-emergency': 'Exception / Emergency',
  };
  return labels[type];
}

export function getTaskTypeColor(type: TaskType): string {
  const colors: Record<TaskType, string> = {
    'daily-routine': '#3b82f6',      // Blue
    'ritual-seva': '#8b5cf6',        // Purple
    'event-festival': '#f59e0b',     // Amber
    'facility-safety': '#a87738',    // Amber
    'exception-emergency': '#ef4444', // Red
  };
  return colors[type];
}

export function getStatusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    'planned': 'Planned',
    'assigned': 'Assigned',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'escalated': 'Escalated',
  };
  return labels[status];
}

export function getStatusColor(status: TaskStatus): string {
  const colors: Record<TaskStatus, string> = {
    'planned': '#6b7280',        // Gray
    'assigned': '#3b82f6',       // Blue
    'in-progress': '#2563eb',    // Darker blue
    'completed': '#a87738',      // Amber
    'escalated': '#ef4444',      // Red
  };
  return colors[status];
}

export function getTimeBlockLabel(block: TimeBlock): string {
  const labels: Record<TimeBlock, string> = {
    'morning': 'Morning (5 AM - 12 PM)',
    'afternoon': 'Afternoon (12 PM - 5 PM)',
    'evening': 'Evening (5 PM - 10 PM)',
    'night': 'Night (10 PM - 5 AM)',
  };
  return labels[block];
}

export function getFunctionLabel(func: TaskFunction): string {
  const labels: Record<TaskFunction, string> = {
    'ritual': 'Ritual',
    'kitchen': 'Kitchen',
    'facility': 'Facility',
    'crowd': 'Crowd',
    'safety': 'Safety',
    'general': 'General',
  };
  return labels[func];
}

// ============================================================================
// ROLE PERMISSIONS
// ============================================================================

export interface RolePermissions {
  canViewAllTasks: boolean;
  canCreateTasks: boolean;
  canAssignTasks: boolean;
  canExecuteTasks: boolean;
  canEscalateTasks: boolean;
  canViewAuditLogs: boolean;
  canApprovePlans: boolean;
  taskTypesCanCreate: TaskType[];
  taskTypesCanView: TaskType[];
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  'temple-administrator': {
    canViewAllTasks: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canExecuteTasks: true,
    canEscalateTasks: true,
    canViewAuditLogs: true,
    canApprovePlans: true,
    taskTypesCanCreate: ['daily-routine', 'ritual-seva', 'event-festival', 'facility-safety', 'exception-emergency'],
    taskTypesCanView: ['daily-routine', 'ritual-seva', 'event-festival', 'facility-safety', 'exception-emergency'],
  },
  'operations-manager': {
    canViewAllTasks: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canExecuteTasks: true,
    canEscalateTasks: true,
    canViewAuditLogs: false,
    canApprovePlans: true,
    taskTypesCanCreate: ['event-festival', 'facility-safety', 'exception-emergency'],
    taskTypesCanView: ['daily-routine', 'ritual-seva', 'event-festival', 'facility-safety', 'exception-emergency'],
  },
  'ops-staff': {
    canViewAllTasks: false,
    canCreateTasks: false,
    canAssignTasks: false,
    canExecuteTasks: true,
    canEscalateTasks: false,
    canViewAuditLogs: false,
    canApprovePlans: false,
    taskTypesCanCreate: [],
    taskTypesCanView: ['daily-routine', 'ritual-seva', 'event-festival', 'facility-safety'],
  },
  'priest-gurugal': {
    canViewAllTasks: false,
    canCreateTasks: false,
    canAssignTasks: false,
    canExecuteTasks: true,
    canEscalateTasks: false,
    canViewAuditLogs: false,
    canApprovePlans: false,
    taskTypesCanCreate: [],
    taskTypesCanView: ['ritual-seva'],
  },
  'kitchen-manager': {
    canViewAllTasks: false,
    canCreateTasks: false,
    canAssignTasks: false,
    canExecuteTasks: true,
    canEscalateTasks: true,
    canViewAuditLogs: false,
    canApprovePlans: false,
    taskTypesCanCreate: [],
    taskTypesCanView: ['daily-routine', 'ritual-seva', 'event-festival'],
  },
  'kitchen-staff': {
    canViewAllTasks: false,
    canCreateTasks: false,
    canAssignTasks: false,
    canExecuteTasks: true,
    canEscalateTasks: false,
    canViewAuditLogs: false,
    canApprovePlans: false,
    taskTypesCanCreate: [],
    taskTypesCanView: ['daily-routine', 'ritual-seva', 'event-festival'],
  },
  'system': {
    canViewAllTasks: true,
    canCreateTasks: true,
    canAssignTasks: false,
    canExecuteTasks: false,
    canEscalateTasks: false,
    canViewAuditLogs: false,
    canApprovePlans: false,
    taskTypesCanCreate: ['daily-routine', 'ritual-seva'],
    taskTypesCanView: ['daily-routine', 'ritual-seva', 'event-festival', 'facility-safety', 'exception-emergency'],
  },
};

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEY_TASKS = 'temple_tasks';
const STORAGE_KEY_TEMPLATES = 'temple_task_templates';
const STORAGE_KEY_ESCALATION_RULES = 'temple_escalation_rules';
const STORAGE_KEY_AUDIT_LOGS = 'temple_audit_logs';

// ============================================================================
// SAMPLE DATA
// ============================================================================

export const sampleTemplates: TaskTemplate[] = [
  {
    id: 'template-daily-open',
    name: 'Open Temple',
    description: 'Unlock main gates, turn on lights, prepare main hall',
    type: 'daily-routine',
    function: 'general',
    timeBlock: 'morning',
    priority: 'high',
    estimatedDuration: 30,
    slaMinutes: 60,
    dependencies: [],
    assigneeRole: 'ops-staff',
    tags: ['opening', 'daily'],
    isActive: true,
    createdDate: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    id: 'template-daily-clean',
    name: 'Deep Clean Main Hall',
    description: 'Sweep, mop, and sanitize main hall',
    type: 'daily-routine',
    function: 'facility',
    timeBlock: 'morning',
    priority: 'high',
    estimatedDuration: 60,
    slaMinutes: 120,
    dependencies: ['template-daily-open'],
    assigneeRole: 'ops-staff',
    tags: ['cleaning', 'daily'],
    isActive: true,
    createdDate: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    id: 'template-kitchen-prep',
    name: 'Kitchen Preparation',
    description: 'Prepare ingredients and setup for prasad cooking',
    type: 'daily-routine',
    function: 'kitchen',
    timeBlock: 'morning',
    priority: 'high',
    estimatedDuration: 90,
    slaMinutes: 180,
    dependencies: [],
    assigneeRole: 'kitchen-staff',
    tags: ['kitchen', 'preparation'],
    isActive: true,
    createdDate: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    id: 'template-ritual-prep',
    name: 'Prepare Pooja Items',
    description: 'Arrange flowers, fruits, and pooja materials for seva',
    type: 'ritual-seva',
    function: 'ritual',
    timeBlock: 'morning',
    priority: 'high',
    estimatedDuration: 45,
    slaMinutes: 60,
    dependencies: [],
    assigneeRole: 'ops-staff',
    tags: ['ritual', 'preparation'],
    isActive: true,
    createdDate: new Date().toISOString(),
    createdBy: 'system',
  },
];

export const sampleTasks: TempleTask[] = [
  {
    id: 'task-1',
    title: 'Open Temple',
    description: 'Unlock main gates, turn on lights, prepare main hall',
    type: 'daily-routine',
    function: 'general',
    timeBlock: 'morning',
    status: 'completed',
    priority: 'high',
    assigneeId: 'emp-1',
    assigneeName: 'Rajesh Kumar',
    assigneeRole: 'ops-staff',
    assigneeAvatar: 'RK',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '05:00',
    dueTime: '06:00',
    completedDate: new Date().toISOString().split('T')[0],
    completedTime: '05:45',
    dependencies: [],
    blockedBy: [],
    slaMinutes: 60,
    estimatedDuration: 30,
    actualDuration: 45,
    tags: ['opening', 'daily'],
    category: 'operations',
    createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system',
    createdByRole: 'system',
    updatedDate: new Date().toISOString(),
    updatedBy: 'emp-1',
    auditLog: [
      {
        id: 'audit-1',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        action: 'created',
        userId: 'system',
        userName: 'System',
        userRole: 'system',
        details: 'Auto-generated daily routine task',
      },
      {
        id: 'audit-2',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        action: 'assigned',
        userId: 'ops-mgr-1',
        userName: 'Operations Manager',
        userRole: 'operations-manager',
        details: 'Assigned to Rajesh Kumar',
      },
      {
        id: 'audit-3',
        timestamp: new Date().toISOString(),
        action: 'completed',
        userId: 'emp-1',
        userName: 'Rajesh Kumar',
        userRole: 'ops-staff',
        details: 'Task completed at 05:45',
      },
    ],
  },
  {
    id: 'task-2',
    title: 'Prepare Morning Prasad',
    description: 'Cook rice, dal, and prepare sweets for morning darshan',
    type: 'daily-routine',
    function: 'kitchen',
    timeBlock: 'morning',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'kitchen-1',
    assigneeName: 'Priya Sharma',
    assigneeRole: 'kitchen-staff',
    assigneeAvatar: 'PS',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '06:00',
    dueTime: '09:00',
    dependencies: [],
    blockedBy: [],
    slaMinutes: 180,
    estimatedDuration: 120,
    tags: ['kitchen', 'prasad', 'morning'],
    category: 'operations',
    createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system',
    createdByRole: 'system',
    updatedDate: new Date().toISOString(),
    updatedBy: 'kitchen-1',
    auditLog: [
      {
        id: 'audit-4',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        action: 'created',
        userId: 'system',
        userName: 'System',
        userRole: 'system',
        details: 'Auto-generated daily routine task',
      },
      {
        id: 'audit-5',
        timestamp: new Date().toISOString(),
        action: 'status-changed',
        userId: 'kitchen-1',
        userName: 'Priya Sharma',
        userRole: 'kitchen-staff',
        previousValue: 'assigned',
        newValue: 'in-progress',
      },
    ],
  },
  {
    id: 'task-3',
    title: 'Prepare Pooja Items for Morning Seva',
    description: 'Arrange flowers, fruits, and pooja materials',
    type: 'ritual-seva',
    function: 'ritual',
    timeBlock: 'morning',
    status: 'assigned',
    priority: 'high',
    assigneeId: 'priest-1',
    assigneeName: 'Guruji',
    assigneeRole: 'priest-gurugal',
    assigneeAvatar: 'G',
    linkedSevaId: 'seva-1',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '07:00',
    dueTime: '08:00',
    dependencies: [],
    blockedBy: [],
    slaMinutes: 60,
    estimatedDuration: 45,
    tags: ['ritual', 'seva', 'preparation'],
    category: 'ritual',
    createdDate: new Date().toISOString(),
    createdBy: 'system',
    createdByRole: 'system',
    updatedDate: new Date().toISOString(),
    updatedBy: 'system',
    auditLog: [
      {
        id: 'audit-6',
        timestamp: new Date().toISOString(),
        action: 'created',
        userId: 'system',
        userName: 'System',
        userRole: 'system',
        details: 'Auto-generated from seva schedule',
      },
    ],
  },
];

// ============================================================================
// DATA ACCESS FUNCTIONS
// ============================================================================

export function getAllTasks(): TempleTask[] {
  if (typeof window === 'undefined') return sampleTasks;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_TASKS);
    if (stored) {
      const parsed = JSON.parse(stored);
      const staticIds = new Set(sampleTasks.map(t => t.id));
      const storedTasks = parsed.filter((t: TempleTask) => !staticIds.has(t.id));
      return [...sampleTasks, ...storedTasks];
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
  
  return sampleTasks;
}

export function saveTask(task: TempleTask): void {
  if (typeof window === 'undefined') return;
  
  try {
    const tasks = getAllTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    
    const updatedTask = {
      ...task,
      updatedDate: new Date().toISOString(),
    };
    
    if (index >= 0) {
      tasks[index] = updatedTask;
    } else {
      tasks.push(updatedTask);
    }
    
    const staticIds = new Set(sampleTasks.map(t => t.id));
    const userTasks = tasks.filter(t => !staticIds.has(t.id));
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(userTasks));
  } catch (error) {
    console.error('Error saving task:', error);
  }
}

export function deleteTask(taskId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const tasks = getAllTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    const staticIds = new Set(sampleTasks.map(t => t.id));
    const userTasks = filtered.filter(t => !staticIds.has(t.id));
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(userTasks));
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

export function addAuditLogEntry(
  taskId: string,
  entry: Omit<AuditLogEntry, 'id'>
): void {
  const task = getAllTasks().find(t => t.id === taskId);
  if (!task) return;
  
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  
  task.auditLog.push(newEntry);
  saveTask(task);
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export function getTasksByType(type: TaskType): TempleTask[] {
  return getAllTasks().filter(t => t.type === type);
}

export function getTasksByStatus(status: TaskStatus): TempleTask[] {
  return getAllTasks().filter(t => t.status === status);
}

export function getTasksByTimeBlock(block: TimeBlock, date?: string): TempleTask[] {
  const tasks = getAllTasks();
  const filtered = tasks.filter(t => t.timeBlock === block);
  
  if (date) {
    return filtered.filter(t => t.scheduledDate === date);
  }
  
  return filtered;
}

export function getTasksByFunction(func: TaskFunction): TempleTask[] {
  return getAllTasks().filter(t => t.function === func);
}

export function getTasksByDate(date: string): TempleTask[] {
  return getAllTasks().filter(t => t.scheduledDate === date);
}

export function getTasksByAssignee(assigneeId: string): TempleTask[] {
  return getAllTasks().filter(t => t.assigneeId === assigneeId);
}

export function getEscalatedTasks(): TempleTask[] {
  return getAllTasks().filter(t => t.status === 'escalated');
}

export function getDelayedTasks(): TempleTask[] {
  const now = new Date();
  return getAllTasks().filter(t => {
    if (t.status === 'completed' || t.status === 'escalated') return false;
    if (!t.dueDate || !t.dueTime) return false;
    
    const dueDateTime = new Date(`${t.dueDate}T${t.dueTime}`);
    return dueDateTime < now;
  });
}

export function calculateReadinessMetrics(
  date: string,
  timeBlock: TimeBlock
): ReadinessMetrics {
  const tasks = getTasksByTimeBlock(timeBlock, date);
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const delayed = getDelayedTasks().filter(t => 
    t.scheduledDate === date && t.timeBlock === timeBlock
  ).length;
  const escalated = tasks.filter(t => t.status === 'escalated').length;
  const criticalBlockers = tasks.filter(t => 
    t.priority === 'critical' && 
    (t.status === 'escalated' || t.blockedBy.length > 0)
  ).length;
  
  const readinessPercentage = tasks.length > 0
    ? Math.round((completed / tasks.length) * 100)
    : 100;
  
  return {
    date,
    timeBlock,
    totalTasks: tasks.length,
    completedTasks: completed,
    inProgressTasks: inProgress,
    delayedTasks: delayed,
    escalatedTasks: escalated,
    readinessPercentage,
    criticalBlockers,
  };
}

