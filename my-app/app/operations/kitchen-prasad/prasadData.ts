import { PRASAD_CATEGORY, DISTRIBUTION_POINT } from './prasadTypes';

/**
 * Prasad Item - Individual item in a prasad plan
 * No financial data (price) stored here - handled by finance module
 */
export interface PrasadItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // 'kg', 'liters', 'pieces', etc.
  preparationTime: number; // minutes
  status: 'pending' | 'preparing' | 'prepared';
  notes?: string;
}

/**
 * Counter Batch - For COUNTER_PAID prasad tracking
 */
export interface CounterBatch {
  id: string;
  batchNumber: string;
  itemId: string; // Links to PrasadItem
  quantity: number;
  preparedAt: string; // ISO timestamp
  distributed: number; // Quantity distributed so far
  available: number; // Quantity available
  status: 'prepared' | 'distributing' | 'exhausted';
}

/**
 * Seva Prasad Link - Links prasad to seva bookings
 */
export interface SevaPrasadLink {
  sevaId: string;
  sevaName: string;
  bookingCount: number; // Number of seva bookings
  expectedQuantity: number; // Calculated prasad quantity
  distributedQuantity: number; // Actual distributed
  distributionTime?: string; // When prasad was distributed
}

/**
 * Distribution Record - Tracks actual distribution
 * Immutable after creation for audit purposes
 */
export interface DistributionRecord {
  id: string;
  planId: string;
  category: PRASAD_CATEGORY;
  distributionPoint: DISTRIBUTION_POINT;
  date: string; // ISO date
  time: string; // HH:mm
  quantity: number;
  unit: string;
  itemName: string;
  distributedBy: string;
  distributedTo?: string; // Token/booking ID for seva prasad, undefined for annadan
  notes?: string;
  createdAt: string; // ISO timestamp
}

/**
 * Wastage Record - Non-financial wastage tracking
 */
export interface WastageRecord {
  id: string;
  planId: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  reason: string;
  recordedBy: string;
  recordedAt: string; // ISO timestamp
}

/**
 * Kitchen Plan - Main planning entity
 * Replaces old PrasadMenu with category-based structure
 */
export interface KitchenPlan {
  id: string;
  name: string;
  date: string; // ISO date string
  templeId: string;
  category: PRASAD_CATEGORY;
  distributionPoint: DISTRIBUTION_POINT;
  
  // Timing
  mealType?: 'breakfast' | 'lunch' | 'dinner'; // Optional, not all categories have meal types
  startTime: string; // HH:mm format
  preparationDuration: number; // minutes
  distributionTime: string; // HH:mm format
  
  // Items and Planning
  items: PrasadItem[];
  
  // Category-specific fields
  annadanExpectedCount?: number; // For ANNADAN category
  annadanActualCount?: number; // Actual count during distribution
  sevaLinks?: SevaPrasadLink[]; // For SEVA_PRASAD categories
  batches?: CounterBatch[]; // For COUNTER_PAID category
  
  // Status and Workflow
  status: 'draft' | 'scheduled' | 'in-progress' | 'prepared' | 'distributing' | 'distributed' | 'completed';
  
  // Audit and Notes
  notes?: string;
  createdAt: string;
  createdBy: string;
  preparedAt?: string;
  distributedAt?: string;
  
  // Distribution tracking
  distributionRecords?: DistributionRecord[];
  wastageRecords?: WastageRecord[];
  
  // Immutability flags
  categoryLocked: boolean; // Cannot change category after distribution starts
  distributionStarted: boolean; // Has distribution begun
}

const STORAGE_KEY = 'kitchen_plans';
const DISTRIBUTION_STORAGE_KEY = 'distribution_records';
const WASTAGE_STORAGE_KEY = 'wastage_records';

// Static sample data with new structure
export const staticKitchenPlans: KitchenPlan[] = [
  {
    id: 'plan-1',
    name: 'Daily Breakfast Annadan',
    date: new Date().toISOString().split('T')[0],
    templeId: 'temple-1',
    category: PRASAD_CATEGORY.ANNADAN,
    distributionPoint: DISTRIBUTION_POINT.ANNADAN_HALL,
    mealType: 'breakfast',
    startTime: '08:00',
    preparationDuration: 60,
    distributionTime: '09:00',
    items: [
      { id: 'item-1', name: 'Rice', quantity: 50, unit: 'kg', preparationTime: 30, status: 'prepared' },
      { id: 'item-2', name: 'Dal', quantity: 20, unit: 'kg', preparationTime: 25, status: 'prepared' },
      { id: 'item-3', name: 'Vegetables', quantity: 15, unit: 'kg', preparationTime: 20, status: 'preparing' },
    ],
    annadanExpectedCount: 500,
    annadanActualCount: 0,
    status: 'in-progress',
    notes: 'Daily community breakfast',
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
    categoryLocked: false,
    distributionStarted: false,
  },
  {
    id: 'plan-2',
    name: 'Laddu Counter Stock',
    date: new Date().toISOString().split('T')[0],
    templeId: 'temple-1',
    category: PRASAD_CATEGORY.COUNTER_PAID,
    distributionPoint: DISTRIBUTION_POINT.COUNTER,
    startTime: '09:00',
    preparationDuration: 120,
    distributionTime: '10:00',
    items: [
      { id: 'item-4', name: 'Laddu', quantity: 100, unit: 'kg', preparationTime: 90, status: 'prepared' },
    ],
    batches: [
      {
        id: 'batch-1',
        batchNumber: 'BATCH-001',
        itemId: 'item-4',
        quantity: 50,
        preparedAt: new Date().toISOString(),
        distributed: 10,
        available: 40,
        status: 'distributing',
      },
      {
        id: 'batch-2',
        batchNumber: 'BATCH-002',
        itemId: 'item-4',
        quantity: 50,
        preparedAt: new Date().toISOString(),
        distributed: 0,
        available: 50,
        status: 'prepared',
      },
    ],
    status: 'distributing',
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
    categoryLocked: true,
    distributionStarted: true,
  },
  {
    id: 'plan-3',
    name: 'Seva Prasad - Morning Aarti',
    date: new Date().toISOString().split('T')[0],
    templeId: 'temple-1',
    category: PRASAD_CATEGORY.SEVA_PRASAD_PAID,
    distributionPoint: DISTRIBUTION_POINT.SEVA_AREA,
    startTime: '06:00',
    preparationDuration: 30,
    distributionTime: '07:00',
    items: [
      { id: 'item-5', name: 'Kumkum Prasad', quantity: 5, unit: 'kg', preparationTime: 20, status: 'prepared' },
      { id: 'item-6', name: 'Laddu', quantity: 10, unit: 'kg', preparationTime: 30, status: 'prepared' },
    ],
    sevaLinks: [
      {
        sevaId: 'seva-1',
        sevaName: 'Morning Aarti',
        bookingCount: 45,
        expectedQuantity: 45,
        distributedQuantity: 30,
        distributionTime: '07:15',
      },
    ],
    status: 'distributing',
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
    categoryLocked: true,
    distributionStarted: true,
  },
];

// Helper functions
export function getAllKitchenPlans(): KitchenPlan[] {
  if (typeof window === 'undefined') return staticKitchenPlans;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const staticIds = new Set(staticKitchenPlans.map(p => p.id));
      const storedPlans = parsed.filter((p: KitchenPlan) => !staticIds.has(p.id));
      return [...staticKitchenPlans, ...storedPlans];
    }
  } catch (error) {
    console.error('Error loading kitchen plans:', error);
  }
  
  return staticKitchenPlans;
}

export function saveKitchenPlan(plan: KitchenPlan): void {
  if (typeof window === 'undefined') return;
  
  // Prevent category changes if distribution has started
  if (plan.categoryLocked || plan.distributionStarted) {
    const existing = getAllKitchenPlans().find(p => p.id === plan.id);
    if (existing && existing.category !== plan.category) {
      throw new Error('Cannot change category after distribution has started');
    }
  }
  
  try {
    const plans = getAllKitchenPlans();
    const index = plans.findIndex(p => p.id === plan.id);
    
    if (index >= 0) {
      plans[index] = plan;
    } else {
      plans.push(plan);
    }
    
    const staticIds = new Set(staticKitchenPlans.map(p => p.id));
    const userPlans = plans.filter(p => !staticIds.has(p.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userPlans));
  } catch (error) {
    console.error('Error saving kitchen plan:', error);
    throw error;
  }
}

export function deleteKitchenPlan(planId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const plans = getAllKitchenPlans();
    const plan = plans.find(p => p.id === planId);
    
    // Prevent deletion if distribution has started
    if (plan && (plan.distributionStarted || plan.status === 'distributed' || plan.status === 'completed')) {
      throw new Error('Cannot delete plan after distribution has started');
    }
    
    const staticIds = new Set(staticKitchenPlans.map(p => p.id));
    if (staticIds.has(planId)) return;
    
    const userPlans = plans.filter(p => !staticIds.has(p.id) && p.id !== planId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userPlans));
  } catch (error) {
    console.error('Error deleting kitchen plan:', error);
    throw error;
  }
}

export function getPlansByDate(date: string): KitchenPlan[] {
  return getAllKitchenPlans().filter(p => p.date === date);
}

export function getPlansByCategory(category: PRASAD_CATEGORY): KitchenPlan[] {
  return getAllKitchenPlans().filter(p => p.category === category);
}

export function getPlansByStatus(status: KitchenPlan['status']): KitchenPlan[] {
  return getAllKitchenPlans().filter(p => p.status === status);
}

export function getTodayPlans(): KitchenPlan[] {
  const today = new Date().toISOString().split('T')[0];
  return getPlansByDate(today);
}

export function getPlanProgress(plan: KitchenPlan): number {
  if (plan.items.length === 0) return 0;
  const preparedCount = plan.items.filter(item => item.status === 'prepared').length;
  return Math.round((preparedCount / plan.items.length) * 100);
}

// Distribution record functions
export function saveDistributionRecord(record: DistributionRecord): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(DISTRIBUTION_STORAGE_KEY);
    const records: DistributionRecord[] = stored ? JSON.parse(stored) : [];
    records.push(record);
    localStorage.setItem(DISTRIBUTION_STORAGE_KEY, JSON.stringify(records));
    
    // Also update the plan
    const plans = getAllKitchenPlans();
    const planIndex = plans.findIndex(p => p.id === record.planId);
    if (planIndex >= 0) {
      if (!plans[planIndex].distributionRecords) {
        plans[planIndex].distributionRecords = [];
      }
      plans[planIndex].distributionRecords!.push(record);
      plans[planIndex].distributionStarted = true;
      plans[planIndex].categoryLocked = true;
      saveKitchenPlan(plans[planIndex]);
    }
  } catch (error) {
    console.error('Error saving distribution record:', error);
  }
}

export function getDistributionRecordsByPlan(planId: string): DistributionRecord[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(DISTRIBUTION_STORAGE_KEY);
    if (!stored) return [];
    const records: DistributionRecord[] = JSON.parse(stored);
    return records.filter(r => r.planId === planId);
  } catch (error) {
    console.error('Error loading distribution records:', error);
    return [];
  }
}

// Wastage record functions
export function saveWastageRecord(record: WastageRecord): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(WASTAGE_STORAGE_KEY);
    const records: WastageRecord[] = stored ? JSON.parse(stored) : [];
    records.push(record);
    localStorage.setItem(WASTAGE_STORAGE_KEY, JSON.stringify(records));
    
    // Also update the plan
    const plans = getAllKitchenPlans();
    const planIndex = plans.findIndex(p => p.id === record.planId);
    if (planIndex >= 0) {
      if (!plans[planIndex].wastageRecords) {
        plans[planIndex].wastageRecords = [];
      }
      plans[planIndex].wastageRecords!.push(record);
      saveKitchenPlan(plans[planIndex]);
    }
  } catch (error) {
    console.error('Error saving wastage record:', error);
  }
}

// Backward compatibility exports (for migration period)
export type PrasadMenu = KitchenPlan;
export type PrasadMenuItem = PrasadItem;

export function getAllPrasadMenus(): KitchenPlan[] {
  return getAllKitchenPlans();
}

export function savePrasadMenu(menu: KitchenPlan): void {
  return saveKitchenPlan(menu);
}

export function deletePrasadMenu(menuId: string): void {
  return deleteKitchenPlan(menuId);
}

export function getMenusByDate(date: string): KitchenPlan[] {
  return getPlansByDate(date);
}

export function getMenusByStatus(status: KitchenPlan['status']): KitchenPlan[] {
  return getPlansByStatus(status);
}

export function getTodayMenus(): KitchenPlan[] {
  return getTodayPlans();
}

export function getMenuProgress(menu: KitchenPlan): number {
  return getPlanProgress(menu);
}

