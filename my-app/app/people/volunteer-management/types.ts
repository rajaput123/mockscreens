export interface Volunteer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  volunteerId: string;
  status: 'active' | 'inactive' | 'temporary';
  eventId?: string;
  eventName?: string;
  totalHours?: number;
  createdAt: string;
}

export interface Duty {
  id: string;
  volunteerId: string;
  volunteerName: string;
  eventId: string;
  eventName: string;
  what: string;
  where: string;
  when: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

