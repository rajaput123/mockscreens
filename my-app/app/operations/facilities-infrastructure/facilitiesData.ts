export interface Room {
  id: string;
  name: string;
  type: 'lodge' | 'hall' | 'office' | 'storage' | 'other';
  floor: number;
  building: string;
  location: {
    x: number; // Position on floor plan (0-100)
    y: number;
    width: number;
    height: number;
  };
  capacity: number; // Maximum occupancy
  amenities: string[]; // e.g., ['AC', 'WiFi', 'TV']
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  currentOccupancy: number;
  pricePerNight?: number;
  createdAt: string;
  createdBy: string;
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  location: string; // e.g., 'Parking Lot A', 'Parking Lot B'
  type: 'car' | 'bike' | 'bus' | 'vip';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  coordinates?: {
    x: number;
    y: number;
  };
  createdAt: string;
  createdBy: string;
}

export interface Booking {
  id: string;
  roomId?: string;
  parkingSlotId?: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  numberOfGuests: number;
  totalAmount?: number;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  facilityId: string; // Room ID or Parking Slot ID
  facilityType: 'room' | 'parking' | 'building' | 'other';
  type: 'preventive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string; // ISO date string
  completedDate?: string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

const STORAGE_KEY_ROOMS = 'facilities_rooms';
const STORAGE_KEY_PARKING = 'facilities_parking';
const STORAGE_KEY_BOOKINGS = 'facilities_bookings';
const STORAGE_KEY_MAINTENANCE = 'facilities_maintenance';

// Static sample data
export const staticRooms: Room[] = [
  {
    id: 'room-1',
    name: 'Lodge Room 101',
    type: 'lodge',
    floor: 1,
    building: 'Main Building',
    location: { x: 10, y: 10, width: 15, height: 12 },
    capacity: 2,
    amenities: ['AC', 'WiFi', 'TV', 'Attached Bathroom'],
    status: 'available',
    currentOccupancy: 0,
    pricePerNight: 500,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'room-2',
    name: 'Lodge Room 102',
    type: 'lodge',
    floor: 1,
    building: 'Main Building',
    location: { x: 27, y: 10, width: 15, height: 12 },
    capacity: 2,
    amenities: ['AC', 'WiFi', 'TV', 'Attached Bathroom'],
    status: 'occupied',
    currentOccupancy: 2,
    pricePerNight: 500,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'room-3',
    name: 'Conference Hall A',
    type: 'hall',
    floor: 2,
    building: 'Main Building',
    location: { x: 10, y: 30, width: 40, height: 20 },
    capacity: 100,
    amenities: ['AC', 'Projector', 'Sound System', 'WiFi'],
    status: 'available',
    currentOccupancy: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'room-4',
    name: 'VIP Suite 201',
    type: 'lodge',
    floor: 2,
    building: 'Main Building',
    location: { x: 55, y: 10, width: 20, height: 15 },
    capacity: 4,
    amenities: ['AC', 'WiFi', 'TV', 'Kitchen', 'Balcony'],
    status: 'reserved',
    currentOccupancy: 0,
    pricePerNight: 1500,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'room-5',
    name: 'Storage Room 1',
    type: 'storage',
    floor: 0,
    building: 'Main Building',
    location: { x: 10, y: 55, width: 20, height: 15 },
    capacity: 0,
    amenities: [],
    status: 'available',
    currentOccupancy: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
];

export const staticParkingSlots: ParkingSlot[] = [
  {
    id: 'parking-1',
    slotNumber: 'A-001',
    location: 'Parking Lot A',
    type: 'car',
    status: 'occupied',
    coordinates: { x: 10, y: 10 },
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'parking-2',
    slotNumber: 'A-002',
    location: 'Parking Lot A',
    type: 'car',
    status: 'available',
    coordinates: { x: 20, y: 10 },
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'parking-3',
    slotNumber: 'A-003',
    location: 'Parking Lot A',
    type: 'car',
    status: 'available',
    coordinates: { x: 30, y: 10 },
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'parking-4',
    slotNumber: 'B-001',
    location: 'Parking Lot B',
    type: 'bike',
    status: 'occupied',
    coordinates: { x: 10, y: 30 },
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'parking-5',
    slotNumber: 'VIP-001',
    location: 'VIP Parking',
    type: 'vip',
    status: 'reserved',
    coordinates: { x: 50, y: 10 },
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
];

// Helper functions
export function getAllRooms(): Room[] {
  if (typeof window === 'undefined') return staticRooms;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ROOMS);
    if (stored) {
      const parsed = JSON.parse(stored);
      const staticIds = new Set(staticRooms.map(r => r.id));
      const storedRooms = parsed.filter((r: Room) => !staticIds.has(r.id));
      return [...staticRooms, ...storedRooms];
    }
  } catch (error) {
    console.error('Error loading rooms:', error);
  }
  
  return staticRooms;
}

export function saveRoom(room: Room): void {
  if (typeof window === 'undefined') return;
  
  try {
    const rooms = getAllRooms();
    const index = rooms.findIndex(r => r.id === room.id);
    
    if (index >= 0) {
      rooms[index] = room;
    } else {
      rooms.push(room);
    }
    
    const staticIds = new Set(staticRooms.map(r => r.id));
    const userRooms = rooms.filter(r => !staticIds.has(r.id));
    localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(userRooms));
  } catch (error) {
    console.error('Error saving room:', error);
  }
}

export function getAllParkingSlots(): ParkingSlot[] {
  if (typeof window === 'undefined') return staticParkingSlots;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PARKING);
    if (stored) {
      const parsed = JSON.parse(stored);
      const staticIds = new Set(staticParkingSlots.map(p => p.id));
      const storedSlots = parsed.filter((p: ParkingSlot) => !staticIds.has(p.id));
      return [...staticParkingSlots, ...storedSlots];
    }
  } catch (error) {
    console.error('Error loading parking slots:', error);
  }
  
  return staticParkingSlots;
}

export function saveParkingSlot(slot: ParkingSlot): void {
  if (typeof window === 'undefined') return;
  
  try {
    const slots = getAllParkingSlots();
    const index = slots.findIndex(s => s.id === slot.id);
    
    if (index >= 0) {
      slots[index] = slot;
    } else {
      slots.push(slot);
    }
    
    const staticIds = new Set(staticParkingSlots.map(s => s.id));
    const userSlots = slots.filter(s => !staticIds.has(s.id));
    localStorage.setItem(STORAGE_KEY_PARKING, JSON.stringify(userSlots));
  } catch (error) {
    console.error('Error saving parking slot:', error);
  }
}

export function getAllBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading bookings:', error);
  }
  
  return [];
}

export function saveBooking(booking: Booking): void {
  if (typeof window === 'undefined') return;
  
  try {
    const bookings = getAllBookings();
    const index = bookings.findIndex(b => b.id === booking.id);
    
    if (index >= 0) {
      bookings[index] = booking;
    } else {
      bookings.push(booking);
    }
    
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  } catch (error) {
    console.error('Error saving booking:', error);
  }
}

export function getAllMaintenanceTasks(): MaintenanceTask[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_MAINTENANCE);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading maintenance tasks:', error);
  }
  
  return [];
}

export function saveMaintenanceTask(task: MaintenanceTask): void {
  if (typeof window === 'undefined') return;
  
  try {
    const tasks = getAllMaintenanceTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    
    localStorage.setItem(STORAGE_KEY_MAINTENANCE, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving maintenance task:', error);
  }
}

export function getBookingsByRoom(roomId: string): Booking[] {
  return getAllBookings().filter(b => b.roomId === roomId);
}

export function getBookingsByParkingSlot(slotId: string): Booking[] {
  return getAllBookings().filter(b => b.parkingSlotId === slotId);
}

export function getActiveBookings(): Booking[] {
  return getAllBookings().filter(b => 
    b.status === 'confirmed' || b.status === 'checked-in'
  );
}

export function getUpcomingMaintenanceTasks(days: number = 30): MaintenanceTask[] {
  const today = new Date();
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  
  return getAllMaintenanceTasks().filter(task => {
    if (task.status !== 'scheduled') return false;
    const scheduledDate = new Date(task.scheduledDate);
    return scheduledDate <= futureDate && scheduledDate >= today;
  });
}

export function getOverdueMaintenanceTasks(): MaintenanceTask[] {
  const today = new Date();
  
  return getAllMaintenanceTasks().filter(task => {
    if (task.status !== 'scheduled') return false;
    const scheduledDate = new Date(task.scheduledDate);
    return scheduledDate < today;
  });
}

export function getRoomsByStatus(status: Room['status']): Room[] {
  return getAllRooms().filter(r => r.status === status);
}

export function getParkingSlotsByStatus(status: ParkingSlot['status']): ParkingSlot[] {
  return getAllParkingSlots().filter(s => s.status === status);
}

export function getRoomsByFloor(floor: number): Room[] {
  return getAllRooms().filter(r => r.floor === floor);
}

export function getParkingSlotsByLocation(location: string): ParkingSlot[] {
  return getAllParkingSlots().filter(s => s.location === location);
}

