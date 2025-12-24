import { TimeBlock, TimeBlockConfig } from '../types';

export const timeBlocks: TimeBlockConfig[] = [
  {
    id: 'morning',
    label: 'Morning',
    timeRange: '6:00 AM - 12:00 PM',
    startHour: 6,
    endHour: 12,
  },
  {
    id: 'afternoon',
    label: 'Afternoon',
    timeRange: '12:00 PM - 6:00 PM',
    startHour: 12,
    endHour: 18,
  },
  {
    id: 'evening',
    label: 'Evening',
    timeRange: '6:00 PM - 10:00 PM',
    startHour: 18,
    endHour: 22,
  },
  {
    id: 'night',
    label: 'Night',
    timeRange: '10:00 PM - 6:00 AM',
    startHour: 22,
    endHour: 6,
  },
];

export function getTimeBlockByHour(hour: number): TimeBlock {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

export function getTimeBlockConfig(block: TimeBlock): TimeBlockConfig {
  return timeBlocks.find((tb) => tb.id === block) || timeBlocks[0];
}

export function groupTasksByTimeBlock<T extends { timeBlock: TimeBlock }>(
  tasks: T[]
): Record<TimeBlock, T[]> {
  const grouped: Record<TimeBlock, T[]> = {
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  };

  tasks.forEach((task) => {
    if (grouped[task.timeBlock]) {
      grouped[task.timeBlock].push(task);
    }
  });

  return grouped;
}

