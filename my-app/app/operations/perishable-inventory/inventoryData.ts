export interface InventoryItem {
  id: string;
  name: string;
  category: 'vegetables' | 'grains' | 'spices' | 'dairy' | 'fruits' | 'other';
  unit: 'kg' | 'liters' | 'pieces' | 'packets';
  currentStock: number;
  minStockLevel: number;        // Alert threshold
  maxStockLevel: number;         // Optimal stock level
  location: string;              // Storage location
  supplier?: string;
  costPerUnit: number;
  lastRestocked: string;         // ISO date
  expiryDays: number;            // Days until expiry (for perishables)
  createdAt: string;
  createdBy: string;
}

export interface StockBatch {
  id: string;
  itemId: string;
  batchNumber?: string;
  quantity: number;
  remainingQuantity: number;    // Remaining after issues
  purchaseDate: string;
  expiryDate: string;
  purchasePrice: number;
  supplier?: string;
  location: string;
  status: 'active' | 'expired' | 'consumed' | 'wasted';
  createdAt: string;
  createdBy: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  batchId?: string;
  type: 'add' | 'issue' | 'wastage' | 'adjustment' | 'rework';
  quantity: number;
  date: string;
  reason?: string;
  wastageCategory?: 'expired' | 'spoiled' | 'damaged' | 'overstock';
  issuedTo?: string;             // Kitchen menu ID or other
  reworkType?: 'return' | 'correction' | 'reprocess';
  originalMovementId?: string;   // Reference to original issue movement
  createdBy: string;
  notes?: string;
}

export interface StockRequest {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  unit: string;
  requestedQuantity: number;
  estimatedCost: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason: string;
  requestedBy: string;
  requestedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  location?: string;
  supplier?: string;
  notes?: string;
}

const STORAGE_KEY_ITEMS = 'inventory_items';
const STORAGE_KEY_BATCHES = 'inventory_batches';
const STORAGE_KEY_MOVEMENTS = 'inventory_movements';
const STORAGE_KEY_REQUESTS = 'stock_requests';

// Static sample data
export const staticInventoryItems: InventoryItem[] = [
  {
    id: 'item-1',
    name: 'Rice',
    category: 'grains',
    unit: 'kg',
    currentStock: 500,
    minStockLevel: 100,
    maxStockLevel: 1000,
    location: 'Dry Storage A',
    supplier: 'Local Supplier',
    costPerUnit: 50,
    lastRestocked: new Date().toISOString(),
    expiryDays: 365,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'item-2',
    name: 'Dal',
    category: 'grains',
    unit: 'kg',
    currentStock: 200,
    minStockLevel: 50,
    maxStockLevel: 500,
    location: 'Dry Storage A',
    supplier: 'Local Supplier',
    costPerUnit: 80,
    lastRestocked: new Date().toISOString(),
    expiryDays: 180,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'item-3',
    name: 'Tomatoes',
    category: 'vegetables',
    unit: 'kg',
    currentStock: 50,
    minStockLevel: 20,
    maxStockLevel: 100,
    location: 'Cold Storage',
    supplier: 'Vegetable Market',
    costPerUnit: 40,
    lastRestocked: new Date().toISOString(),
    expiryDays: 7,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'item-4',
    name: 'Onions',
    category: 'vegetables',
    unit: 'kg',
    currentStock: 30,
    minStockLevel: 25,
    maxStockLevel: 150,
    location: 'Cold Storage',
    supplier: 'Vegetable Market',
    costPerUnit: 30,
    lastRestocked: new Date().toISOString(),
    expiryDays: 14,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'item-5',
    name: 'Turmeric Powder',
    category: 'spices',
    unit: 'kg',
    currentStock: 10,
    minStockLevel: 5,
    maxStockLevel: 20,
    location: 'Spice Rack',
    supplier: 'Spice Merchant',
    costPerUnit: 200,
    lastRestocked: new Date().toISOString(),
    expiryDays: 365,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
];

export const staticStockBatches: StockBatch[] = [
  {
    id: 'batch-1',
    itemId: 'item-1',
    batchNumber: 'RICE-2024-001',
    quantity: 500,
    remainingQuantity: 450,
    purchaseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 355 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    purchasePrice: 50,
    supplier: 'Local Supplier',
    location: 'Dry Storage A',
    status: 'active',
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'batch-2',
    itemId: 'item-2',
    batchNumber: 'DAL-2024-001',
    quantity: 200,
    remainingQuantity: 180,
    purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 175 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    purchasePrice: 80,
    supplier: 'Local Supplier',
    location: 'Dry Storage A',
    status: 'active',
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'batch-3',
    itemId: 'item-3',
    batchNumber: 'TOM-2024-001',
    quantity: 50,
    remainingQuantity: 45,
    purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    purchasePrice: 40,
    supplier: 'Vegetable Market',
    location: 'Cold Storage',
    status: 'active',
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'batch-4',
    itemId: 'item-4',
    batchNumber: 'ONI-2024-001',
    quantity: 30,
    remainingQuantity: 30,
    purchaseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    purchasePrice: 30,
    supplier: 'Vegetable Market',
    location: 'Cold Storage',
    status: 'active',
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
];

// Helper functions
export function getAllInventoryItems(): InventoryItem[] {
  if (typeof window === 'undefined') return staticInventoryItems;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (stored) {
      const parsed = JSON.parse(stored);
      const staticIds = new Set(staticInventoryItems.map(i => i.id));
      const storedItems = parsed.filter((i: InventoryItem) => !staticIds.has(i.id));
      return [...staticInventoryItems, ...storedItems];
    }
  } catch (error) {
    console.error('Error loading inventory items:', error);
  }
  
  return staticInventoryItems;
}

export function saveInventoryItem(item: InventoryItem): void {
  if (typeof window === 'undefined') return;
  
  try {
    const items = getAllInventoryItems();
    const index = items.findIndex(i => i.id === item.id);
    
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    
    const staticIds = new Set(staticInventoryItems.map(i => i.id));
    const userItems = items.filter(i => !staticIds.has(i.id));
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(userItems));
  } catch (error) {
    console.error('Error saving inventory item:', error);
  }
}

export function getAllStockBatches(): StockBatch[] {
  if (typeof window === 'undefined') return staticStockBatches;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_BATCHES);
    if (stored) {
      const parsed = JSON.parse(stored);
      const staticIds = new Set(staticStockBatches.map(b => b.id));
      const storedBatches = parsed.filter((b: StockBatch) => !staticIds.has(b.id));
      return [...staticStockBatches, ...storedBatches];
    }
  } catch (error) {
    console.error('Error loading stock batches:', error);
  }
  
  return staticStockBatches;
}

export function saveStockBatch(batch: StockBatch): void {
  if (typeof window === 'undefined') return;
  
  try {
    const batches = getAllStockBatches();
    const index = batches.findIndex(b => b.id === batch.id);
    
    if (index >= 0) {
      batches[index] = batch;
    } else {
      batches.push(batch);
    }
    
    const staticIds = new Set(staticStockBatches.map(b => b.id));
    const userBatches = batches.filter(b => !staticIds.has(b.id));
    localStorage.setItem(STORAGE_KEY_BATCHES, JSON.stringify(userBatches));
  } catch (error) {
    console.error('Error saving stock batch:', error);
  }
}

export function getAllStockMovements(): StockMovement[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_MOVEMENTS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading stock movements:', error);
  }
  
  return [];
}

export function saveStockMovement(movement: StockMovement): void {
  if (typeof window === 'undefined') return;
  
  try {
    const movements = getAllStockMovements();
    movements.push(movement);
    localStorage.setItem(STORAGE_KEY_MOVEMENTS, JSON.stringify(movements));
  } catch (error) {
    console.error('Error saving stock movement:', error);
  }
}

export function getBatchesByItem(itemId: string): StockBatch[] {
  return getAllStockBatches().filter(b => b.itemId === itemId && b.status === 'active');
}

export function getBatchesByLocation(location: string): StockBatch[] {
  return getAllStockBatches().filter(b => b.location === location && b.status === 'active');
}

export function getExpiringBatches(days: number = 7): StockBatch[] {
  const today = new Date();
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  
  return getAllStockBatches().filter(batch => {
    if (batch.status !== 'active') return false;
    const expiryDate = new Date(batch.expiryDate);
    return expiryDate <= futureDate && expiryDate >= today;
  });
}

export function getExpiredBatches(): StockBatch[] {
  const today = new Date().toISOString().split('T')[0];
  return getAllStockBatches().filter(batch => 
    batch.expiryDate < today && batch.status === 'active'
  );
}

export function getLowStockItems(): InventoryItem[] {
  return getAllInventoryItems().filter(item => item.currentStock <= item.minStockLevel);
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getStockStatus(item: InventoryItem): 'good' | 'low' | 'critical' {
  if (item.currentStock <= item.minStockLevel) return 'critical';
  if (item.currentStock <= item.minStockLevel * 1.5) return 'low';
  return 'good';
}

export function calculateTotalValue(): number {
  const items = getAllInventoryItems();
  return items.reduce((total, item) => total + (item.currentStock * item.costPerUnit), 0);
}

// FIFO batch selection for issuing stock
export function getFIFOBatch(itemId: string, quantity: number): StockBatch | null {
  const batches = getBatchesByItem(itemId)
    .filter(b => b.remainingQuantity > 0)
    .sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime());
  
  if (batches.length === 0) return null;
  
  // Find batch with enough quantity or use first batch
  const suitableBatch = batches.find(b => b.remainingQuantity >= quantity) || batches[0];
  return suitableBatch;
}

// Update item stock after movement
// Stock Request Functions
export function getAllStockRequests(): StockRequest[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_REQUESTS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading stock requests:', e);
  }
  return [];
}

export function saveStockRequest(request: StockRequest): void {
  if (typeof window === 'undefined') return;
  
  try {
    const requests = getAllStockRequests();
    const index = requests.findIndex(r => r.id === request.id);
    
    if (index >= 0) {
      requests[index] = request;
    } else {
      requests.push(request);
    }
    
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.error('Error saving stock request:', e);
  }
}

export function getStockRequestById(id: string): StockRequest | undefined {
  return getAllStockRequests().find(r => r.id === id);
}

export function getPendingStockRequests(): StockRequest[] {
  return getAllStockRequests().filter(r => r.status === 'pending');
}

export function updateItemStock(itemId: string): void {
  const batches = getBatchesByItem(itemId);
  const totalStock = batches.reduce((sum, batch) => sum + batch.remainingQuantity, 0);
  
  const items = getAllInventoryItems();
  const item = items.find(i => i.id === itemId);
  if (item) {
    item.currentStock = totalStock;
    item.lastRestocked = new Date().toISOString();
    saveInventoryItem(item);
  }
}

