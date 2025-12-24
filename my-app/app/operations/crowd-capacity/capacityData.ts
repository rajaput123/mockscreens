// Capacity Management Data Types and Helpers

export interface CapacityRule {
  id: string;
  templeId: string;
  location: string; // Mandap, Hall, Parking, etc.
  maxCapacity: number;
  currentOccupancy: number;
  isLocked: boolean;
  lockedReason?: string;
  lockedBy?: string;
  lockedAt?: string;
  effectiveFrom?: string;
  effectiveTill?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CrowdSnapshot {
  id: string;
  templeId: string;
  location: string;
  timestamp: string;
  occupancy: number;
  capacity: number;
  utilization: number; // percentage
}

export function getCapacityRuleById(id: string): CapacityRule | null {
  const rules = getAllCapacityRules();
  return rules.find(r => r.id === id) || null;
}

// Generate historical utilization data for charts
export function generateHistoricalData(location: string, days: number = 7): Array<{timestamp: string; utilization: number}> {
  const data: Array<{timestamp: string; utilization: number}> = [];
  const rule = getAllCapacityRules().find(r => r.location === location);
  
  if (!rule) return data;
  
  const baseUtilization = getUtilization(rule.currentOccupancy, rule.maxCapacity);
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(Math.floor(Math.random() * 24), 0, 0, 0);
    
    // Add some variation to utilization (±10%)
    const variation = (Math.random() - 0.5) * 20;
    const utilization = Math.max(0, Math.min(100, baseUtilization + variation));
    
    data.push({
      timestamp: date.toISOString(),
      utilization: Math.round(utilization),
    });
  }
  
  return data;
}

export function getCapacityRulesByTemple(templeId: string): CapacityRule[] {
  const rules = getAllCapacityRules();
  return rules.filter(r => r.templeId === templeId);
}

export function saveCapacityRule(rule: CapacityRule): void {
  if (typeof window === 'undefined') return;
  
  try {
    const rules = getAllCapacityRules();
    const index = rules.findIndex(r => r.id === rule.id);
    
    if (index >= 0) {
      rules[index] = { ...rule, updatedAt: new Date().toISOString() };
    } else {
      rules.push(rule);
    }
    
    localStorage.setItem('capacityRules', JSON.stringify(rules));
  } catch (e) {
    console.error('Error saving capacity rule:', e);
  }
}

export function deleteCapacityRule(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const rules = getAllCapacityRules();
    const filtered = rules.filter(r => r.id !== id);
    localStorage.setItem('capacityRules', JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting capacity rule:', e);
  }
}

export function generateCapacityRuleId(): string {
  return `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function lockCapacity(ruleId: string, reason: string, lockedBy: string): void {
  const rule = getCapacityRuleById(ruleId);
  if (rule) {
    rule.isLocked = true;
    rule.lockedReason = reason;
    rule.lockedBy = lockedBy;
    rule.lockedAt = new Date().toISOString();
    saveCapacityRule(rule);
  }
}

export function unlockCapacity(ruleId: string): void {
  const rule = getCapacityRuleById(ruleId);
  if (rule) {
    rule.isLocked = false;
    rule.lockedReason = undefined;
    rule.lockedBy = undefined;
    rule.lockedAt = undefined;
    saveCapacityRule(rule);
  }
}

// Get current utilization percentage
export function getUtilization(occupancy: number, capacity: number): number {
  if (capacity === 0) return 0;
  return Math.round((occupancy / capacity) * 100);
}

// Get capacity status color
export function getCapacityStatusColor(utilization: number): string {
  if (utilization >= 90) return 'red';
  if (utilization >= 70) return 'orange';
  if (utilization >= 50) return 'yellow';
  return 'green';
}

// Static Capacity Rules Data
export const staticCapacityRules: CapacityRule[] = [
  {
    id: 'cap-1',
    templeId: '1',
    location: 'Main Hall',
    maxCapacity: 500,
    currentOccupancy: 425,
    isLocked: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'cap-2',
    templeId: '1',
    location: 'Mandap 1',
    maxCapacity: 150,
    currentOccupancy: 90,
    isLocked: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'cap-3',
    templeId: '1',
    location: 'Mandap 2',
    maxCapacity: 200,
    currentOccupancy: 60,
    isLocked: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'cap-4',
    templeId: '1',
    location: 'Mandap 3',
    maxCapacity: 100,
    currentOccupancy: 95,
    isLocked: true,
    lockedReason: 'Maintenance work in progress',
    lockedBy: 'Admin',
    lockedAt: '2024-01-15T10:00:00.000Z',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 'cap-5',
    templeId: '1',
    location: 'Parking Area',
    maxCapacity: 300,
    currentOccupancy: 165,
    isLocked: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'cap-6',
    templeId: '1',
    location: 'Lodge',
    maxCapacity: 80,
    currentOccupancy: 45,
    isLocked: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'cap-7',
    templeId: '1',
    location: 'Dining Hall',
    maxCapacity: 250,
    currentOccupancy: 180,
    isLocked: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

// Helper functions for localStorage
export function getAllCapacityRules(): CapacityRule[] {
  if (typeof window === 'undefined') return [];
  
  let userRules: CapacityRule[] = [];
  try {
    const stored = localStorage.getItem('capacityRules');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        userRules = parsed;
      }
    }
  } catch (e) {
    console.error('Error reading capacity rules:', e);
  }
  
  // Merge static capacity rules with user-created rules
  // Static rules can be overridden by stored versions
  const staticIds = staticCapacityRules.map(r => r.id);
  const mergedStatic = staticCapacityRules.map(staticRule => {
    const stored = userRules.find((r: CapacityRule) => r.id === staticRule.id);
    if (stored) {
      return {
        ...staticRule,
        ...stored,
      };
    }
    return staticRule;
  });
  
  // Add user-created rules that don't exist in static data
  const userOnlyRules = userRules.filter((r: CapacityRule) => !staticIds.includes(r.id));
  
  // Return merged static rules + user-only rules
  return [...mergedStatic, ...userOnlyRules];
}

