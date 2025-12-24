export interface TimingBlock {
  id: string;
  applicableDays: string[]; // ['Monday', 'Tuesday', etc.]
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  effectiveFromDate: string; // YYYY-MM-DD format
  effectiveTillDate?: string; // YYYY-MM-DD format, optional
}

export interface Seva {
  id: string;
  templeId: string;
  templeName?: string; // Keep for backward compatibility
  deityName?: string; // Deity name from temple
  
  // Basic Details
  name: string;
  type: 'Ritual' | 'Offering' | 'Special';
  category: 'Daily' | 'Weekly' | 'Festival' | 'Special';
  shortDescription?: string;
  image?: string;
  devoteeVisibility: 'Visible' | 'Hidden';
  
  // Pricing
  isFree: boolean;
  basePrice?: number;
  originalPrice?: number; // For discount calculation
  allowDonation: boolean;
  minDonation?: number;
  maxDonation?: number;
  
  // Timing
  timingBlocks: TimingBlock[];
  
  // Slot Configuration
  slotDuration: number; // in minutes
  autoGenerateSlots: boolean;
  slotsPerTiming?: number;
  maxSlots?: number; // Maximum available slots
  bookingSlots?: number; // Currently booked slots
  bufferTimeBeforeSlot: number; // in minutes
  bufferTimeAfterSlot: number; // in minutes
  
  // Capacity Rules
  maxDevoteesPerSlot: number;
  maxBookingsPerDevoteePerDay: number;
  maxTotalBookingsPerDay: number;
  physicalLocation: string; // Mandap/Location name
  
  // Status & Publishing
  status: 'draft' | 'active';
  publishImmediately: boolean;
  
  // Audit Information
  createdBy: string;
  createdOn: string; // ISO date string
  draftVersion: number;
}

// Static Seva Data
export const staticSevaData: Seva[] = [
  {
    id: 'seva-1',
    templeId: '1',
    templeName: 'Main Temple Complex',
    deityName: 'Lord Shiva',
    name: 'Morning Aarti',
    type: 'Ritual',
    category: 'Daily',
    shortDescription: 'Early morning aarti with traditional prayers and offerings',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop',
    devoteeVisibility: 'Visible',
    isFree: false,
    basePrice: 500,
    originalPrice: 600,
    allowDonation: true,
    minDonation: 100,
    maxDonation: 5000,
    timingBlocks: [{
      id: 'timing-1',
      applicableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      startTime: '06:00',
      endTime: '07:00',
      effectiveFromDate: '2024-01-01',
    }],
    slotDuration: 30,
    autoGenerateSlots: true,
    slotsPerTiming: 2,
    maxSlots: 100,
    bookingSlots: 45,
    bufferTimeBeforeSlot: 5,
    bufferTimeAfterSlot: 5,
    maxDevoteesPerSlot: 50,
    maxBookingsPerDevoteePerDay: 2,
    maxTotalBookingsPerDay: 100,
    physicalLocation: 'Main Hall',
    status: 'active',
    publishImmediately: true,
    createdBy: 'System Admin',
    createdOn: '2024-01-01T00:00:00.000Z',
    draftVersion: 1,
  },
  {
    id: 'seva-2',
    templeId: '1',
    templeName: 'Main Temple Complex',
    deityName: 'Lord Shiva',
    name: 'Abhishekam',
    type: 'Ritual',
    category: 'Daily',
    shortDescription: 'Sacred bath ceremony for the deity with milk, honey, and water',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop',
    devoteeVisibility: 'Visible',
    isFree: false,
    basePrice: 1000,
    originalPrice: 1200,
    allowDonation: false,
    timingBlocks: [{
      id: 'timing-2',
      applicableDays: ['Monday', 'Wednesday', 'Friday'],
      startTime: '08:00',
      endTime: '09:00',
      effectiveFromDate: '2024-01-01',
    }],
    slotDuration: 45,
    autoGenerateSlots: true,
    slotsPerTiming: 1,
    maxSlots: 50,
    bookingSlots: 20,
    bufferTimeBeforeSlot: 10,
    bufferTimeAfterSlot: 10,
    maxDevoteesPerSlot: 30,
    maxBookingsPerDevoteePerDay: 1,
    maxTotalBookingsPerDay: 50,
    physicalLocation: 'Mandap 1',
    status: 'active',
    publishImmediately: true,
    createdBy: 'System Admin',
    createdOn: '2024-01-01T00:00:00.000Z',
    draftVersion: 1,
  },
  {
    id: 'seva-3',
    templeId: '1',
    templeName: 'Main Temple Complex',
    deityName: 'Lord Shiva',
    name: 'Evening Aarti',
    type: 'Ritual',
    category: 'Daily',
    shortDescription: 'Evening aarti with lamps and devotional songs',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop',
    devoteeVisibility: 'Visible',
    isFree: false,
    basePrice: 500,
    allowDonation: true,
    minDonation: 50,
    maxDonation: 2000,
    timingBlocks: [{
      id: 'timing-3',
      applicableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      startTime: '19:00',
      endTime: '20:00',
      effectiveFromDate: '2024-01-01',
    }],
    slotDuration: 30,
    autoGenerateSlots: true,
    slotsPerTiming: 2,
    maxSlots: 120,
    bookingSlots: 78,
    bufferTimeBeforeSlot: 5,
    bufferTimeAfterSlot: 5,
    maxDevoteesPerSlot: 60,
    maxBookingsPerDevoteePerDay: 2,
    maxTotalBookingsPerDay: 120,
    physicalLocation: 'Main Hall',
    status: 'active',
    publishImmediately: true,
    createdBy: 'System Admin',
    createdOn: '2024-01-01T00:00:00.000Z',
    draftVersion: 1,
  },
  {
    id: 'seva-4',
    templeId: '1',
    templeName: 'Main Temple Complex',
    deityName: 'Lord Shiva',
    name: 'Rudrabhishekam',
    type: 'Special',
    category: 'Special',
    shortDescription: 'Powerful Vedic ritual for Lord Shiva',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop',
    devoteeVisibility: 'Visible',
    isFree: false,
    basePrice: 5000,
    originalPrice: 6000,
    allowDonation: false,
    timingBlocks: [{
      id: 'timing-4',
      applicableDays: ['Monday'],
      startTime: '10:00',
      endTime: '12:00',
      effectiveFromDate: '2024-01-01',
    }],
    slotDuration: 120,
    autoGenerateSlots: false,
    maxSlots: 20,
    bookingSlots: 8,
    bufferTimeBeforeSlot: 15,
    bufferTimeAfterSlot: 15,
    maxDevoteesPerSlot: 10,
    maxBookingsPerDevoteePerDay: 1,
    maxTotalBookingsPerDay: 20,
    physicalLocation: 'Mandap 1',
    status: 'active',
    publishImmediately: true,
    createdBy: 'System Admin',
    createdOn: '2024-01-01T00:00:00.000Z',
    draftVersion: 1,
  },
  {
    id: 'seva-5',
    templeId: '2',
    templeName: 'North Branch Temple',
    deityName: 'Lord Vishnu',
    name: 'Lakshmi Puja',
    type: 'Offering',
    category: 'Weekly',
    shortDescription: 'Weekly Lakshmi Puja for prosperity and wealth',
    image: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400&h=300&fit=crop',
    devoteeVisibility: 'Visible',
    isFree: false,
    basePrice: 800,
    allowDonation: true,
    minDonation: 100,
    maxDonation: 3000,
    timingBlocks: [{
      id: 'timing-5',
      applicableDays: ['Friday'],
      startTime: '18:00',
      endTime: '19:00',
      effectiveFromDate: '2024-01-01',
    }],
    slotDuration: 60,
    autoGenerateSlots: true,
    slotsPerTiming: 1,
    maxSlots: 30,
    bookingSlots: 12,
    bufferTimeBeforeSlot: 5,
    bufferTimeAfterSlot: 5,
    maxDevoteesPerSlot: 25,
    maxBookingsPerDevoteePerDay: 1,
    maxTotalBookingsPerDay: 30,
    physicalLocation: 'Main Hall',
    status: 'active',
    publishImmediately: true,
    createdBy: 'System Admin',
    createdOn: '2024-01-01T00:00:00.000Z',
    draftVersion: 1,
  },
];

// Helper function to enrich sevas with deity names
// Reads temple data from localStorage to get deity names
function enrichSevasWithDeityNames(sevas: Seva[]): Seva[] {
  if (typeof window === 'undefined') {
    return sevas;
  }

  // Try to get temple data from localStorage
  let temples: any[] = [];
  try {
    const storedTemples = localStorage.getItem('temples');
    if (storedTemples) {
      const parsed = JSON.parse(storedTemples);
      if (Array.isArray(parsed) && parsed.length > 0) {
        temples = parsed;
      }
    }
  } catch (e) {
    console.error('Error reading temples from localStorage:', e);
  }

  // If no stored temples, use static mapping as fallback
  const staticTempleDeityMap: Record<string, string> = {
    '1': 'Lord Shiva',
    '2': 'Lord Vishnu',
    '3': 'Goddess Lakshmi',
    '4': 'Lord Ganesha',
  };

  return sevas.map(seva => {
    // If deityName already exists, use it
    if (seva.deityName) {
      return seva;
    }
    
    // Try to find temple in localStorage data
    const temple = temples.find((t: any) => t.id === seva.templeId);
    if (temple && temple.deity) {
      return {
        ...seva,
        deityName: temple.deity,
      };
    }
    
    // Fallback to static mapping
    const deityName = staticTempleDeityMap[seva.templeId] || 'Unknown Deity';
    
    return {
      ...seva,
      deityName: deityName,
    };
  });
}

// Helper functions
export function getAllSevas(): Seva[] {
  if (typeof window !== 'undefined') {
    const storedSevas = localStorage.getItem('sevas');
    let userSevas: Seva[] = [];
    
    if (storedSevas) {
      try {
        const parsed = JSON.parse(storedSevas);
        if (Array.isArray(parsed) && parsed.length > 0) {
          userSevas = parsed;
        }
      } catch (e) {
        console.error('Error parsing stored sevas:', e);
      }
    }
    
    // Merge static sevas with user-created sevas
    // Static sevas can be overridden by stored versions
    const staticIds = staticSevaData.map(s => s.id);
    const mergedStatic = staticSevaData.map(staticSeva => {
      const stored = userSevas.find((s: Seva) => s.id === staticSeva.id);
      // Always check for uploaded image in localStorage first
      const imageKey = `seva-image-${staticSeva.id}`;
      let uploadedImage: string | null = null;
      try {
        uploadedImage = localStorage.getItem(imageKey);
        if (uploadedImage && uploadedImage.length < 50) {
          // Invalid image data, ignore it
          uploadedImage = null;
        }
      } catch (e) {
        console.error('Error reading image from localStorage:', e);
      }
      
      if (stored) {
        return {
          ...staticSeva,
          ...stored,
          // Prioritize uploaded image from localStorage
          image: uploadedImage || stored.image || staticSeva.image,
        };
      }
      // Check for uploaded image even if not in stored sevas
      return {
        ...staticSeva,
        image: uploadedImage || staticSeva.image,
      };
    });
    
    // Add user-created sevas (not in static data)
    const newUserSevas = userSevas
      .filter((s: Seva) => !staticIds.includes(s.id))
      .map((seva: Seva) => {
        const imageKey = `seva-image-${seva.id}`;
        let uploadedImage: string | null = null;
        try {
          uploadedImage = localStorage.getItem(imageKey);
          if (uploadedImage && uploadedImage.length < 50) {
            // Invalid image data, ignore it
            uploadedImage = null;
          }
        } catch (e) {
          console.error('Error reading image from localStorage:', e);
        }
        return {
          ...seva,
          // Prioritize uploaded image from localStorage
          image: uploadedImage || seva.image,
        };
      });
    
    const allSevas = [...mergedStatic, ...newUserSevas];
    return enrichSevasWithDeityNames(allSevas);
  }
  
  // Server-side: return static data with deity names
  return enrichSevasWithDeityNames(staticSevaData);
}

export function getSevaById(id: string): Seva | undefined {
  return getAllSevas().find(seva => seva.id === id);
}

export function getSevasByTemple(templeId: string): Seva[] {
  return getAllSevas().filter(seva => seva.templeId === templeId);
}

export function saveSeva(seva: Seva): void {
  if (typeof window !== 'undefined') {
    // Get all sevas (static + stored)
    const allSevas = getAllSevas();
    const existingIndex = allSevas.findIndex(s => s.id === seva.id);
    
    let updatedSevas: Seva[];
    if (existingIndex >= 0) {
      // Update existing
      updatedSevas = [...allSevas];
      updatedSevas[existingIndex] = seva;
    } else {
      // Add new
      updatedSevas = [...allSevas, seva];
    }
    
    // Filter out static sevas and only save user-created/modified ones
    const staticIds = staticSevaData.map(s => s.id);
    const userSevas = updatedSevas.filter(s => !staticIds.includes(s.id));
    
    // Also include modified static sevas
    const modifiedStatic = updatedSevas.filter(s => 
      staticIds.includes(s.id) && JSON.stringify(s) !== JSON.stringify(staticSevaData.find(staticS => staticS.id === s.id))
    );
    
    const sevasToStore = [...userSevas, ...modifiedStatic].map(s => ({
      ...s,
      image: undefined, // Don't store base64 in main storage
    }));
    
    localStorage.setItem('sevas', JSON.stringify(sevasToStore));
    
    // Save image separately if exists (check for data:image or base64)
    if (seva.image) {
      const imageKey = `seva-image-${seva.id}`;
      // Save regardless of format - handle both data:image and base64 strings
      if (seva.image.startsWith('data:image') || seva.image.startsWith('data:') || seva.image.length > 100) {
        localStorage.setItem(imageKey, seva.image);
      }
    }
  }
}

export function deleteSeva(id: string): void {
  if (typeof window !== 'undefined') {
    const allSevas = getAllSevas();
    const updatedSevas = allSevas.filter(s => s.id !== id);
    localStorage.setItem('sevas', JSON.stringify(updatedSevas));
    
    // Remove image from localStorage
    const imageKey = `seva-image-${id}`;
    localStorage.removeItem(imageKey);
  }
}

export function generateSevaId(): string {
  return `seva-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

