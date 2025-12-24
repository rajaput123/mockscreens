export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
}

export interface ProjectMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  isPrimary: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  startDate: string;
  endDate: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  location: string;
  coordinator: string;
  coordinatorPhone: string;
  milestones: Milestone[];
  media?: ProjectMedia[];
  createdAt: string;
  updatedAt: string;
}

