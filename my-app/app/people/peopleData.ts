// People Module Data Types and Mock Data

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  joinDate: string;
  address?: string;
  emergencyContact?: string;
  salary?: number;
}

export interface Freelancer {
  id: string;
  freelancerId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: 'active' | 'inactive' | 'on-contract';
  joinDate: string;
  address?: string;
  hourlyRate?: number;
  totalProjects?: number;
}

export interface Volunteer {
  id: string;
  volunteerId: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  status: 'active' | 'inactive';
  joinDate: string;
  address?: string;
  totalHours?: number;
  assignedDuties?: string[];
}

export interface Devotee {
  id: string;
  devoteeId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  registrationDate: string;
  visitCount?: number;
  lastVisit?: string;
  isVIP?: boolean;
}

export interface VIPDevotee extends Devotee {
  vipLevel: 'gold' | 'silver' | 'platinum';
  vipServices: string[];
  vipSince: string;
  specialNotes?: string;
}

export interface Contract {
  id: string;
  freelancerId: string;
  freelancerName: string;
  contractType: 'hourly' | 'project' | 'retainer';
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'terminated';
  rate: number;
  totalHours?: number;
  description: string;
}

export interface Duty {
  id: string;
  volunteerId: string;
  volunteerName: string;
  dutyType: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Mock Data
export const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'Arjun Rao',
    email: 'arjun.rao@example.com',
    phone: '+91 98765 43210',
    role: 'Operations Manager',
    department: 'Operations',
    status: 'active',
    joinDate: '2022-01-15',
    address: '123 Main Street, City',
    emergencyContact: '+91 98765 43211',
    salary: 50000,
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Meera Iyer',
    email: 'meera.iyer@example.com',
    phone: '+91 98765 43211',
    role: 'HR Executive',
    department: 'Human Resources',
    status: 'active',
    joinDate: '2023-03-01',
    address: '456 Park Avenue, City',
    emergencyContact: '+91 98765 43212',
    salary: 40000,
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Karthik Sharma',
    email: 'karthik.sharma@example.com',
    phone: '+91 98765 43212',
    role: 'Accounts Officer',
    department: 'Finance',
    status: 'inactive',
    joinDate: '2021-08-10',
    address: '789 Oak Street, City',
    emergencyContact: '+91 98765 43213',
    salary: 35000,
  },
];

export const mockFreelancers: Freelancer[] = [
  {
    id: '1',
    freelancerId: 'FRE001',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98765 43220',
    specialization: 'Web Development',
    status: 'active',
    joinDate: '2023-01-10',
    address: '321 Tech Street, City',
    hourlyRate: 1500,
    totalProjects: 5,
  },
  {
    id: '2',
    freelancerId: 'FRE002',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    phone: '+91 98765 43221',
    specialization: 'Graphic Design',
    status: 'on-contract',
    joinDate: '2023-05-15',
    address: '654 Design Avenue, City',
    hourlyRate: 1200,
    totalProjects: 3,
  },
  {
    id: '3',
    freelancerId: 'FRE003',
    name: 'Anjali Desai',
    email: 'anjali.desai@example.com',
    phone: '+91 98765 43222',
    specialization: 'Content Writing',
    status: 'active',
    joinDate: '2023-02-20',
    address: '987 Content Road, City',
    hourlyRate: 800,
    totalProjects: 8,
  },
];

export const mockVolunteers: Volunteer[] = [
  {
    id: '1',
    volunteerId: 'VOL001',
    name: 'Suresh Reddy',
    email: 'suresh.reddy@example.com',
    phone: '+91 98765 43230',
    skills: ['Event Management', 'Crowd Control'],
    status: 'active',
    joinDate: '2022-06-01',
    address: '111 Service Lane, City',
    totalHours: 120,
    assignedDuties: ['Morning Seva', 'Event Coordination'],
  },
  {
    id: '2',
    volunteerId: 'VOL002',
    name: 'Lakshmi Menon',
    email: 'lakshmi.menon@example.com',
    phone: '+91 98765 43231',
    skills: ['Kitchen Assistance', 'Food Distribution'],
    status: 'active',
    joinDate: '2023-01-15',
    address: '222 Devotion Street, City',
    totalHours: 80,
    assignedDuties: ['Prasad Preparation'],
  },
  {
    id: '3',
    volunteerId: 'VOL003',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 98765 43232',
    skills: ['Security', 'Maintenance'],
    status: 'inactive',
    joinDate: '2021-09-10',
    address: '333 Security Road, City',
    totalHours: 200,
    assignedDuties: [],
  },
];

export const mockDevotees: Devotee[] = [
  {
    id: '1',
    devoteeId: 'DEV001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43240',
    address: '444 Devotee Avenue, City',
    status: 'active',
    registrationDate: '2022-01-10',
    visitCount: 45,
    lastVisit: '2024-01-15',
    isVIP: false,
  },
  {
    id: '2',
    devoteeId: 'DEV002',
    name: 'Sunita Sharma',
    email: 'sunita.sharma@example.com',
    phone: '+91 98765 43241',
    address: '555 Faith Street, City',
    status: 'active',
    registrationDate: '2021-05-20',
    visitCount: 120,
    lastVisit: '2024-01-20',
    isVIP: true,
  },
  {
    id: '3',
    devoteeId: 'DEV003',
    name: 'Amit Verma',
    email: 'amit.verma@example.com',
    phone: '+91 98765 43242',
    address: '666 Blessing Road, City',
    status: 'inactive',
    registrationDate: '2023-03-15',
    visitCount: 8,
    lastVisit: '2023-12-10',
    isVIP: false,
  },
];

export const mockVIPDevotees: VIPDevotee[] = [
  {
    id: '2',
    devoteeId: 'DEV002',
    name: 'Sunita Sharma',
    email: 'sunita.sharma@example.com',
    phone: '+91 98765 43241',
    address: '555 Faith Street, City',
    status: 'active',
    registrationDate: '2021-05-20',
    visitCount: 120,
    lastVisit: '2024-01-20',
    isVIP: true,
    vipLevel: 'platinum',
    vipServices: ['Priority Darshan', 'Special Seva Booking', 'VIP Lounge Access'],
    vipSince: '2022-01-01',
    specialNotes: 'Regular donor, very active in temple activities',
  },
];

export const mockContracts: Contract[] = [
  {
    id: '1',
    freelancerId: 'FRE001',
    freelancerName: 'Priya Patel',
    contractType: 'hourly',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    rate: 1500,
    totalHours: 40,
    description: 'Website development and maintenance',
  },
  {
    id: '2',
    freelancerId: 'FRE002',
    freelancerName: 'Rahul Kumar',
    contractType: 'project',
    startDate: '2024-02-01',
    endDate: '2024-05-31',
    status: 'active',
    rate: 50000,
    description: 'Temple brochure design project',
  },
];

export const mockDuties: Duty[] = [
  {
    id: '1',
    volunteerId: 'VOL001',
    volunteerName: 'Suresh Reddy',
    dutyType: 'Morning Seva',
    date: '2024-01-25',
    startTime: '06:00',
    endTime: '10:00',
    location: 'Main Temple',
    status: 'scheduled',
  },
  {
    id: '2',
    volunteerId: 'VOL002',
    volunteerName: 'Lakshmi Menon',
    dutyType: 'Prasad Preparation',
    date: '2024-01-25',
    startTime: '08:00',
    endTime: '12:00',
    location: 'Kitchen',
    status: 'scheduled',
  },
];

// Helper functions
export function getAllEmployees(): Employee[] {
  return mockEmployees;
}

export function getAllFreelancers(): Freelancer[] {
  return mockFreelancers;
}

export function getAllVolunteers(): Volunteer[] {
  return mockVolunteers;
}

export function getAllDevotees(): Devotee[] {
  return mockDevotees;
}

export function getAllVIPDevotees(): VIPDevotee[] {
  return mockVIPDevotees;
}

export function getAllContracts(): Contract[] {
  return mockContracts;
}

export function getAllDuties(): Duty[] {
  return mockDuties;
}

export function getActiveEmployees(): Employee[] {
  return mockEmployees.filter(emp => emp.status === 'active');
}

export function getActiveFreelancers(): Freelancer[] {
  return mockFreelancers.filter(f => f.status === 'active' || f.status === 'on-contract');
}

export function getActiveVolunteers(): Volunteer[] {
  return mockVolunteers.filter(v => v.status === 'active');
}

export function getActiveDevotees(): Devotee[] {
  return mockDevotees.filter(d => d.status === 'active');
}

