export interface Activity {
  id: string;
  name: string;
  description: string;
  type: 'ritual' | 'prasad' | 'maintenance' | 'cleaning' | 'security' | 'event' | 'other';
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  duration: number; // in minutes
  location: string;
  assignedTo?: string;
  assignedToName?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  resources: string[]; // Resource IDs or names
  dependencies: string[]; // Activity IDs this depends on
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface DailyPlan {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  templeId?: string;
  templeName?: string;
  activities: Activity[];
  status: 'draft' | 'approved' | 'active' | 'completed' | 'cancelled';
  totalActivities: number;
  completedActivities: number;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Operation {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  location: string;
  assignedResources: string[];
  progress: number; // 0-100
  createdAt: string;
  createdBy: string;
}

const STORAGE_KEY_PLANS = 'operational_planning_plans';
const STORAGE_KEY_OPERATIONS = 'operational_planning_operations';

// Static sample data
export const staticActivities: Activity[] = [
  {
    id: 'act-1',
    name: 'Morning Aarti',
    description: 'Daily morning aarti ceremony',
    type: 'ritual',
    startTime: '06:00',
    endTime: '07:00',
    duration: 60,
    location: 'Main Hall',
    assignedTo: 'emp-1',
    assignedToName: 'Priest Rajesh',
    status: 'completed',
    priority: 'high',
    resources: ['sound-system', 'flowers', 'lamp'],
    dependencies: [],
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'act-2',
    name: 'Prepare Breakfast Prasad',
    description: 'Prepare and distribute breakfast prasad',
    type: 'prasad',
    startTime: '07:00',
    endTime: '09:00',
    duration: 120,
    location: 'Kitchen',
    assignedTo: 'emp-2',
    assignedToName: 'Cook Priya',
    status: 'in-progress',
    priority: 'high',
    resources: ['kitchen-staff', 'ingredients'],
    dependencies: ['act-1'],
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'act-3',
    name: 'Clean Main Hall',
    description: 'Deep cleaning of main hall',
    type: 'cleaning',
    startTime: '09:00',
    endTime: '11:00',
    duration: 120,
    location: 'Main Hall',
    assignedTo: 'emp-3',
    assignedToName: 'Cleaner Amit',
    status: 'scheduled',
    priority: 'medium',
    resources: ['cleaning-equipment'],
    dependencies: ['act-1'],
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'act-4',
    name: 'Evening Aarti',
    description: 'Evening aarti ceremony',
    type: 'ritual',
    startTime: '18:00',
    endTime: '19:00',
    duration: 60,
    location: 'Main Hall',
    assignedTo: 'emp-1',
    assignedToName: 'Priest Rajesh',
    status: 'scheduled',
    priority: 'high',
    resources: ['sound-system', 'flowers', 'lamp'],
    dependencies: ['act-3'],
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'act-5',
    name: 'Security Check',
    description: 'Evening security rounds',
    type: 'security',
    startTime: '20:00',
    endTime: '21:00',
    duration: 60,
    location: 'Entire Temple',
    assignedTo: 'emp-4',
    assignedToName: 'Security Vikram',
    status: 'scheduled',
    priority: 'medium',
    resources: ['security-staff'],
    dependencies: [],
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
];

export const staticDailyPlans: DailyPlan[] = [
  {
    id: 'plan-1',
    date: new Date().toISOString().split('T')[0],
    templeName: 'Main Temple',
    activities: staticActivities,
    status: 'active',
    totalActivities: staticActivities.length,
    completedActivities: 1,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Admin',
  },
];

// Helper functions
export function getAllDailyPlans(): DailyPlan[] {
  if (typeof window === 'undefined') return staticDailyPlans;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PLANS);
    if (stored) {
      const parsed = JSON.parse(stored);
      const staticIds = new Set(staticDailyPlans.map(p => p.id));
      const storedPlans = parsed.filter((p: DailyPlan) => !staticIds.has(p.id));
      return [...staticDailyPlans, ...storedPlans];
    }
  } catch (error) {
    console.error('Error loading daily plans:', error);
  }
  
  return staticDailyPlans;
}

export function saveDailyPlan(plan: DailyPlan): void {
  if (typeof window === 'undefined') return;
  
  try {
    const plans = getAllDailyPlans();
    const index = plans.findIndex(p => p.id === plan.id);
    
    if (index >= 0) {
      plans[index] = { ...plan, updatedAt: new Date().toISOString() };
    } else {
      plans.push(plan);
    }
    
    const staticIds = new Set(staticDailyPlans.map(p => p.id));
    const userPlans = plans.filter(p => !staticIds.has(p.id));
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(userPlans));
  } catch (error) {
    console.error('Error saving daily plan:', error);
  }
}

export function deleteDailyPlan(planId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const plans = getAllDailyPlans();
    const filtered = plans.filter(p => p.id !== planId);
    const staticIds = new Set(staticDailyPlans.map(p => p.id));
    const userPlans = filtered.filter(p => !staticIds.has(p.id));
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(userPlans));
  } catch (error) {
    console.error('Error deleting daily plan:', error);
  }
}

export function getDailyPlanByDate(date: string): DailyPlan | null {
  return getAllDailyPlans().find(p => p.date === date) || null;
}

export function getDailyPlanById(planId: string): DailyPlan | null {
  return getAllDailyPlans().find(p => p.id === planId) || null;
}

export function getActiveDailyPlans(): DailyPlan[] {
  return getAllDailyPlans().filter(p => p.status === 'active' || p.status === 'approved');
}

export function getPlansByStatus(status: DailyPlan['status']): DailyPlan[] {
  return getAllDailyPlans().filter(p => p.status === status);
}

export function getAllOperations(): Operation[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_OPERATIONS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading operations:', error);
  }
  
  return [];
}

export function saveOperation(operation: Operation): void {
  if (typeof window === 'undefined') return;
  
  try {
    const operations = getAllOperations();
    const index = operations.findIndex(o => o.id === operation.id);
    
    if (index >= 0) {
      operations[index] = operation;
    } else {
      operations.push(operation);
    }
    
    localStorage.setItem(STORAGE_KEY_OPERATIONS, JSON.stringify(operations));
  } catch (error) {
    console.error('Error saving operation:', error);
  }
}

export function getActivitiesByType(type: Activity['type']): Activity[] {
  const allPlans = getAllDailyPlans();
  const allActivities: Activity[] = [];
  allPlans.forEach(plan => {
    allActivities.push(...plan.activities.filter(a => a.type === type));
  });
  return allActivities;
}

export function getActivitiesByStatus(status: Activity['status']): Activity[] {
  const allPlans = getAllDailyPlans();
  const allActivities: Activity[] = [];
  allPlans.forEach(plan => {
    allActivities.push(...plan.activities.filter(a => a.status === status));
  });
  return allActivities;
}

export function getActivitiesByTimeRange(startTime: string, endTime: string): Activity[] {
  const allPlans = getAllDailyPlans();
  const allActivities: Activity[] = [];
  allPlans.forEach(plan => {
    allActivities.push(...plan.activities.filter(a => {
      return a.startTime >= startTime && a.startTime <= endTime;
    }));
  });
  return allActivities;
}

export function getTodayActivities(): Activity[] {
  const today = new Date().toISOString().split('T')[0];
  const todayPlan = getDailyPlanByDate(today);
  return todayPlan ? todayPlan.activities : [];
}

export function getUpcomingActivities(hours: number = 24): Activity[] {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const futureTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
  const futureTimeStr = `${String(futureTime.getHours()).padStart(2, '0')}:${String(futureTime.getMinutes()).padStart(2, '0')}`;
  
  return getActivitiesByTimeRange(currentTime, futureTimeStr);
}


