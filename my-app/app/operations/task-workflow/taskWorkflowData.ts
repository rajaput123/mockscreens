export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'blocked' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  dueDate?: string; // ISO date string
  createdDate: string; // ISO date string
  completedDate?: string; // ISO date string
  estimatedHours?: number;
  actualHours?: number;
  progress: number; // 0-100
  tags: string[];
  category: string; // e.g., 'operations', 'maintenance', 'event', 'ritual'
  workflowId?: string;
  dependencies: string[]; // Array of task IDs this task depends on
  blockedBy: string[]; // Array of task IDs blocking this task
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  order: number;
  assigneeRole?: string;
  estimatedDuration?: number; // in hours
  requiredApproval?: boolean;
  nextSteps: string[]; // Array of step IDs that can follow this step
}

export interface TaskDependency {
  id: string;
  fromTaskId: string;
  toTaskId: string;
  type: 'blocks' | 'follows' | 'related';
  createdAt: string;
}

const STORAGE_KEY_TASKS = 'task_workflow_tasks';
const STORAGE_KEY_WORKFLOWS = 'task_workflow_workflows';
const STORAGE_KEY_DEPENDENCIES = 'task_workflow_dependencies';

// Static sample data
export const staticTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Prepare Morning Prasad',
    description: 'Prepare prasad for morning darshan including rice, dal, and sweets',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'emp-1',
    assigneeName: 'Rajesh Kumar',
    assigneeAvatar: 'RK',
    dueDate: new Date().toISOString(),
    createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 4,
    actualHours: 2,
    progress: 50,
    tags: ['kitchen', 'prasad', 'morning'],
    category: 'operations',
    workflowId: 'workflow-1',
    dependencies: [],
    blockedBy: [],
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Admin',
  },
  {
    id: 'task-2',
    title: 'Clean Main Hall',
    description: 'Deep cleaning of main hall before evening aarti',
    status: 'pending',
    priority: 'medium',
    assigneeId: 'emp-2',
    assigneeName: 'Priya Sharma',
    assigneeAvatar: 'PS',
    dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 2,
    progress: 0,
    tags: ['cleaning', 'hall'],
    category: 'maintenance',
    dependencies: ['task-1'],
    blockedBy: [],
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Admin',
  },
  {
    id: 'task-3',
    title: 'Setup Sound System',
    description: 'Setup and test sound system for evening aarti',
    status: 'pending',
    priority: 'high',
    assigneeId: 'emp-3',
    assigneeName: 'Amit Patel',
    assigneeAvatar: 'AP',
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    createdDate: new Date().toISOString(),
    estimatedHours: 1,
    progress: 0,
    tags: ['equipment', 'aarti'],
    category: 'operations',
    dependencies: [],
    blockedBy: [],
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Admin',
  },
  {
    id: 'task-4',
    title: 'Review Inventory Stock',
    description: 'Review and update inventory levels for perishable items',
    status: 'review',
    priority: 'medium',
    assigneeId: 'emp-4',
    assigneeName: 'Sneha Reddy',
    assigneeAvatar: 'SR',
    dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 3,
    actualHours: 2.5,
    progress: 100,
    tags: ['inventory', 'review'],
    category: 'operations',
    dependencies: [],
    blockedBy: [],
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Admin',
  },
  {
    id: 'task-5',
    title: 'Maintain Parking Lot',
    description: 'Repair potholes and repaint parking lines',
    status: 'blocked',
    priority: 'low',
    assigneeId: 'emp-5',
    assigneeName: 'Vikram Singh',
    assigneeAvatar: 'VS',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 8,
    progress: 0,
    tags: ['maintenance', 'parking'],
    category: 'maintenance',
    dependencies: [],
    blockedBy: ['task-6'],
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Admin',
  },
  {
    id: 'task-6',
    title: 'Order Maintenance Materials',
    description: 'Order paint, tools, and materials for parking maintenance',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: 'emp-6',
    assigneeName: 'Anjali Mehta',
    assigneeAvatar: 'AM',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 2,
    actualHours: 1,
    progress: 50,
    tags: ['procurement', 'maintenance'],
    category: 'maintenance',
    dependencies: [],
    blockedBy: [],
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Admin',
  },
];

export const staticWorkflows: Workflow[] = [
  {
    id: 'workflow-1',
    name: 'Daily Prasad Preparation',
    description: 'Standard workflow for daily prasad preparation',
    category: 'operations',
    isActive: true,
    steps: [
      {
        id: 'step-1',
        name: 'Plan Menu',
        description: 'Plan the prasad menu for the day',
        order: 1,
        assigneeRole: 'Kitchen Manager',
        estimatedDuration: 1,
        nextSteps: ['step-2'],
      },
      {
        id: 'step-2',
        name: 'Prepare Ingredients',
        description: 'Prepare and organize all ingredients',
        order: 2,
        assigneeRole: 'Cook',
        estimatedDuration: 2,
        nextSteps: ['step-3'],
      },
      {
        id: 'step-3',
        name: 'Cook Prasad',
        description: 'Cook the prasad according to menu',
        order: 3,
        assigneeRole: 'Cook',
        estimatedDuration: 4,
        nextSteps: ['step-4'],
      },
      {
        id: 'step-4',
        name: 'Quality Check',
        description: 'Quality check and approval',
        order: 4,
        assigneeRole: 'Kitchen Manager',
        estimatedDuration: 0.5,
        requiredApproval: true,
        nextSteps: ['step-5'],
      },
      {
        id: 'step-5',
        name: 'Distribute',
        description: 'Distribute prasad to devotees',
        order: 5,
        assigneeRole: 'Volunteer',
        estimatedDuration: 2,
        nextSteps: [],
      },
    ],
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
];

// Helper functions
export function getAllTasks(): Task[] {
  if (typeof window === 'undefined') return staticTasks;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_TASKS);
    if (stored) {
      const parsed = JSON.parse(stored);
      const staticIds = new Set(staticTasks.map(t => t.id));
      const storedTasks = parsed.filter((t: Task) => !staticIds.has(t.id));
      return [...staticTasks, ...storedTasks];
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
  
  return staticTasks;
}

export function saveTask(task: Task): void {
  if (typeof window === 'undefined') return;
  
  try {
    const tasks = getAllTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    
    if (index >= 0) {
      tasks[index] = { ...task, updatedAt: new Date().toISOString() };
    } else {
      tasks.push(task);
    }
    
    const staticIds = new Set(staticTasks.map(t => t.id));
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
    const staticIds = new Set(staticTasks.map(t => t.id));
    const userTasks = filtered.filter(t => !staticIds.has(t.id));
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(userTasks));
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

export function getAllWorkflows(): Workflow[] {
  if (typeof window === 'undefined') return staticWorkflows;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_WORKFLOWS);
    if (stored) {
      const parsed = JSON.parse(stored);
      const staticIds = new Set(staticWorkflows.map(w => w.id));
      const storedWorkflows = parsed.filter((w: Workflow) => !staticIds.has(w.id));
      return [...staticWorkflows, ...storedWorkflows];
    }
  } catch (error) {
    console.error('Error loading workflows:', error);
  }
  
  return staticWorkflows;
}

export function saveWorkflow(workflow: Workflow): void {
  if (typeof window === 'undefined') return;
  
  try {
    const workflows = getAllWorkflows();
    const index = workflows.findIndex(w => w.id === workflow.id);
    
    if (index >= 0) {
      workflows[index] = workflow;
    } else {
      workflows.push(workflow);
    }
    
    const staticIds = new Set(staticWorkflows.map(w => w.id));
    const userWorkflows = workflows.filter(w => !staticIds.has(w.id));
    localStorage.setItem(STORAGE_KEY_WORKFLOWS, JSON.stringify(userWorkflows));
  } catch (error) {
    console.error('Error saving workflow:', error);
  }
}

export function getTasksByStatus(status: Task['status']): Task[] {
  return getAllTasks().filter(t => t.status === status);
}

export function getTasksByPriority(priority: Task['priority']): Task[] {
  return getAllTasks().filter(t => t.priority === priority);
}

export function getTasksByAssignee(assigneeId: string): Task[] {
  return getAllTasks().filter(t => t.assigneeId === assigneeId);
}

export function getTasksByCategory(category: string): Task[] {
  return getAllTasks().filter(t => t.category === category);
}

export function getOverdueTasks(): Task[] {
  const today = new Date();
  return getAllTasks().filter(t => {
    if (!t.dueDate || t.status === 'completed' || t.status === 'cancelled') return false;
    return new Date(t.dueDate) < today;
  });
}

export function getUpcomingTasks(days: number = 7): Task[] {
  const today = new Date();
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  
  return getAllTasks().filter(t => {
    if (!t.dueDate || t.status === 'completed' || t.status === 'cancelled') return false;
    const dueDate = new Date(t.dueDate);
    return dueDate >= today && dueDate <= futureDate;
  });
}

export function getBlockedTasks(): Task[] {
  return getAllTasks().filter(t => t.status === 'blocked' || t.blockedBy.length > 0);
}

export function getTaskDependencies(taskId: string): Task[] {
  const task = getAllTasks().find(t => t.id === taskId);
  if (!task) return [];
  
  return getAllTasks().filter(t => task.dependencies.includes(t.id));
}

export function getBlockingTasks(taskId: string): Task[] {
  const task = getAllTasks().find(t => t.id === taskId);
  if (!task) return [];
  
  return getAllTasks().filter(t => task.blockedBy.includes(t.id));
}


