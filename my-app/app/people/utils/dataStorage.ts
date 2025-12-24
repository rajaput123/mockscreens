// Utility functions for persisting data to localStorage

export function saveToLocalStorage<T>(key: string, data: T[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T[] = []): T[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error(`Error loading from localStorage (${key}):`, error);
    }
  }
  return defaultValue;
}

export function mergeWithStaticData<T extends { id: string }>(
  staticData: T[],
  storedKey: string
): T[] {
  const stored = loadFromLocalStorage<T>(storedKey);
  
  // Create a map of stored items by ID
  const storedMap = new Map(stored.map(item => [item.id, item]));
  
  // Merge: stored items override static items with same ID, new stored items are added
  const merged = staticData.map(item => {
    const storedItem = storedMap.get(item.id);
    return storedItem ? { ...item, ...storedItem } : item;
  });
  
  // Add any stored items that don't exist in static data
  stored.forEach(item => {
    if (!staticData.find(s => s.id === item.id)) {
      merged.push(item);
    }
  });
  
  return merged;
}

// Specific functions for contracts
export function saveContracts(contracts: any[]): void {
  saveToLocalStorage('freelancer_contracts', contracts);
}

export function loadContracts(staticContracts: any[]): any[] {
  return mergeWithStaticData(staticContracts, 'freelancer_contracts');
}

// Specific functions for devotees
export function saveDevotees(devotees: any[]): void {
  saveToLocalStorage('devotees', devotees);
}

export function loadDevotees(staticDevotees: any[]): any[] {
  return mergeWithStaticData(staticDevotees, 'devotees');
}

// Specific functions for VIP devotees
export function saveVIPDevotees(vipDevotees: any[]): void {
  saveToLocalStorage('vip_devotees', vipDevotees);
}

export function loadVIPDevotees(staticVIPDevotees: any[]): any[] {
  return mergeWithStaticData(staticVIPDevotees, 'vip_devotees');
}

// Specific functions for freelancers
export function saveFreelancers(freelancers: any[]): void {
  saveToLocalStorage('freelancers', freelancers);
}

export function loadFreelancers(staticFreelancers: any[]): any[] {
  return mergeWithStaticData(staticFreelancers, 'freelancers');
}

// Specific functions for content
export function saveContent(contents: any[]): void {
  saveToLocalStorage('content', contents);
}

export function loadContent(staticContent: any[]): any[] {
  return mergeWithStaticData(staticContent, 'content');
}

// Specific functions for announcements
export function saveAnnouncements(announcements: any[]): void {
  saveToLocalStorage('announcements', announcements);
}

export function loadAnnouncements(staticAnnouncements: any[]): any[] {
  return mergeWithStaticData(staticAnnouncements, 'announcements');
}

// Specific functions for delivery logs
export function saveDeliveryLogs(logs: any[]): void {
  saveToLocalStorage('delivery_logs', logs);
}

export function loadDeliveryLogs(staticLogs: any[]): any[] {
  return mergeWithStaticData(staticLogs, 'delivery_logs');
}

