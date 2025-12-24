export type TimeBlock = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  category: string;
  timeBlock: TimeBlock;
  estimatedHours?: number;
  actualHours?: number;
  linkedWorkflowId?: string;
  linkedWorkflowName?: string;
  linkedRitualId?: string;
  linkedFacilityId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeBlockConfig {
  id: TimeBlock;
  label: string;
  timeRange: string;
  startHour: number;
  endHour: number;
}

