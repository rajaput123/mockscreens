export interface Seva {
  id: string;
  name: string;
  type: string;
  duration: string;
  price: number;
  status: 'active' | 'inactive';
  description?: string;
}

export interface Temple {
  id: string;
  name: string;
  location: string;
  description: string;
  type: 'parent' | 'child';
  parentTempleId?: string;
  parentTempleName?: string;
  status: 'active' | 'inactive';
  totalSevas: number;
  childTemples?: string[];
  image: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  openingTime?: string;
  closingTime?: string;
  establishedDate?: string;
  deity?: string;
  capacity?: number;
  sevas: Seva[];
}

export const templeData: Temple[] = [
  {
    id: '1',
    name: 'Main Temple Complex',
    location: 'City Center',
    description: 'The main temple complex serving as the headquarters for all temple operations. This grand temple is dedicated to Lord Shiva and has been a center of spiritual activities for over 200 years.',
    type: 'parent',
    status: 'active',
    totalSevas: 15,
    childTemples: ['2', '3', '4'],
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&h=600&fit=crop',
    address: '123 Temple Street, City Center, 560001',
    contactPhone: '+91 80 1234 5678',
    contactEmail: 'main@temple.com',
    openingTime: '05:00',
    closingTime: '22:00',
    establishedDate: '1820-01-15',
    deity: 'Lord Shiva',
    capacity: 5000,
    sevas: [
      {
        id: '1',
        name: 'Morning Aarti',
        type: 'Daily Ritual',
        duration: '60 minutes',
        price: 500,
        status: 'active',
        description: 'Early morning aarti with traditional prayers and offerings',
      },
      {
        id: '2',
        name: 'Abhishekam',
        type: 'Puja',
        duration: '45 minutes',
        price: 1000,
        status: 'active',
        description: 'Sacred bath ceremony for the deity with milk, honey, and water',
      },
      {
        id: '3',
        name: 'Special Puja',
        type: 'Special Service',
        duration: '90 minutes',
        price: 2500,
        status: 'active',
        description: 'Comprehensive puja with all rituals and offerings',
      },
      {
        id: '4',
        name: 'Evening Aarti',
        type: 'Daily Ritual',
        duration: '60 minutes',
        price: 500,
        status: 'active',
        description: 'Evening aarti with lamps and devotional songs',
      },
      {
        id: '5',
        name: 'Rudrabhishekam',
        type: 'Special Puja',
        duration: '120 minutes',
        price: 5000,
        status: 'active',
        description: 'Powerful Vedic ritual for Lord Shiva',
      },
      {
        id: '6',
        name: 'Mahamrityunjaya Jaap',
        type: 'Special Service',
        duration: '180 minutes',
        price: 3500,
        status: 'active',
        description: 'Sacred chanting for health and longevity',
      },
    ],
  },
  {
    id: '2',
    name: 'North Branch Temple',
    location: 'North District',
    description: 'A beautiful branch temple located in the northern part of the city. This temple specializes in daily rituals and community services.',
    type: 'child',
    parentTempleId: '1',
    parentTempleName: 'Main Temple Complex',
    status: 'active',
    totalSevas: 10,
    image: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&h=600&fit=crop',
    address: '456 North Avenue, North District, 560002',
    contactPhone: '+91 80 2345 6789',
    contactEmail: 'north@temple.com',
    openingTime: '06:00',
    closingTime: '21:00',
    establishedDate: '1950-03-20',
    deity: 'Lord Vishnu',
    capacity: 2000,
    sevas: [
      {
        id: '7',
        name: 'Morning Aarti',
        type: 'Daily Ritual',
        duration: '45 minutes',
        price: 300,
        status: 'active',
      },
      {
        id: '8',
        name: 'Lakshmi Puja',
        type: 'Puja',
        duration: '60 minutes',
        price: 800,
        status: 'active',
      },
      {
        id: '9',
        name: 'Evening Aarti',
        type: 'Daily Ritual',
        duration: '45 minutes',
        price: 300,
        status: 'active',
      },
      {
        id: '10',
        name: 'Satyanarayana Puja',
        type: 'Special Service',
        duration: '90 minutes',
        price: 1500,
        status: 'active',
      },
    ],
  },
  {
    id: '3',
    name: 'South Branch Temple',
    location: 'South District',
    description: 'A serene temple in the southern district, known for its peaceful atmosphere and traditional architecture. Popular among devotees for meditation and spiritual practices.',
    type: 'child',
    parentTempleId: '1',
    parentTempleName: 'Main Temple Complex',
    status: 'active',
    totalSevas: 8,
    image: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&h=600&fit=crop',
    address: '789 South Road, South District, 560003',
    contactPhone: '+91 80 3456 7890',
    contactEmail: 'south@temple.com',
    openingTime: '05:30',
    closingTime: '21:30',
    establishedDate: '1965-07-10',
    deity: 'Goddess Durga',
    capacity: 1500,
    sevas: [
      {
        id: '11',
        name: 'Morning Aarti',
        type: 'Daily Ritual',
        duration: '50 minutes',
        price: 400,
        status: 'active',
      },
      {
        id: '12',
        name: 'Durga Puja',
        type: 'Puja',
        duration: '75 minutes',
        price: 1200,
        status: 'active',
      },
      {
        id: '13',
        name: 'Evening Aarti',
        type: 'Daily Ritual',
        duration: '50 minutes',
        price: 400,
        status: 'active',
      },
    ],
  },
  {
    id: '4',
    name: 'East Branch Temple',
    location: 'East District',
    description: 'A modern temple complex in the eastern part of the city, featuring contemporary architecture while maintaining traditional values. Known for its community outreach programs.',
    type: 'child',
    parentTempleId: '1',
    parentTempleName: 'Main Temple Complex',
    status: 'active',
    totalSevas: 12,
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&h=600&fit=crop',
    address: '321 East Boulevard, East District, 560004',
    contactPhone: '+91 80 4567 8901',
    contactEmail: 'east@temple.com',
    openingTime: '06:00',
    closingTime: '22:00',
    establishedDate: '1980-11-25',
    deity: 'Lord Ganesha',
    capacity: 3000,
    sevas: [
      {
        id: '14',
        name: 'Morning Aarti',
        type: 'Daily Ritual',
        duration: '55 minutes',
        price: 450,
        status: 'active',
      },
      {
        id: '15',
        name: 'Ganesh Chaturthi Puja',
        type: 'Special Service',
        duration: '100 minutes',
        price: 2000,
        status: 'active',
      },
      {
        id: '16',
        name: 'Sankashti Chaturthi',
        type: 'Puja',
        duration: '80 minutes',
        price: 1500,
        status: 'active',
      },
      {
        id: '17',
        name: 'Evening Aarti',
        type: 'Daily Ritual',
        duration: '55 minutes',
        price: 450,
        status: 'active',
      },
    ],
  },
];

// Helper functions
export function getTempleById(id: string): Temple | undefined {
  return getAllTemples().find(temple => temple.id === id);
}

export function getParentTemples(): Temple[] {
  return getAllTemples().filter(temple => temple.type === 'parent');
}

export function getChildTemples(parentId: string): Temple[] {
  return getAllTemples().filter(temple => temple.parentTempleId === parentId);
}

export function getAllTemples(): Temple[] {
  // Check if we're in the browser and have localStorage
  if (typeof window !== 'undefined') {
    // Check for any temples stored in localStorage
    const storedTemples = localStorage.getItem('temples');
    if (storedTemples) {
      try {
        const parsed = JSON.parse(storedTemples);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with static data, prioritizing localStorage
          const merged = templeData.map(staticTemple => {
            const stored = parsed.find((t: Temple) => t.id === staticTemple.id);
            if (stored) {
              // Check for uploaded image in localStorage
              const imageKey = `temple-image-${staticTemple.id}`;
              const uploadedImage = localStorage.getItem(imageKey);
              return {
                ...staticTemple,
                ...stored,
                image: uploadedImage || stored.image || staticTemple.image,
              };
            }
            // Check for uploaded image even if not in stored temples
            const imageKey = `temple-image-${staticTemple.id}`;
            const uploadedImage = localStorage.getItem(imageKey);
            return {
              ...staticTemple,
              image: uploadedImage || staticTemple.image,
            };
          });
          return merged;
        }
      } catch (e) {
        console.error('Error parsing stored temples:', e);
      }
    }
    
    // Even without stored temples, check for uploaded images
    return templeData.map(temple => {
      const imageKey = `temple-image-${temple.id}`;
      const uploadedImage = localStorage.getItem(imageKey);
      return {
        ...temple,
        image: uploadedImage || temple.image,
      };
    });
  }
  
  // Server-side: return static data
  return templeData;
}

export function getTempleStatistics() {
  const allTemples = getAllTemples();
  const totalTemples = allTemples.length;
  const parentTemples = getParentTemples().length;
  const childTemples = totalTemples - parentTemples;
  const totalSevas = allTemples.reduce((sum, temple) => sum + temple.totalSevas, 0);
  
  return {
    totalTemples,
    parentTemples,
    childTemples,
    totalSevas,
  };
}

