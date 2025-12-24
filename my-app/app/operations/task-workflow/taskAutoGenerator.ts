/**
 * TASK AUTO-GENERATION SYSTEM
 * 
 * Automatically generates:
 * - Daily routine tasks (every day)
 * - Ritual/seva-linked tasks (based on seva schedules)
 * 
 * This runs as a background process and should be triggered:
 * - Daily at midnight for routine tasks
 * - When seva schedules are created/updated for ritual tasks
 */

import {
  TempleTask,
  TaskTemplate,
  TaskType,
  TaskStatus,
  TimeBlock,
  TaskFunction,
  TaskPriority,
  UserRole,
  sampleTemplates,
  getAllTasks,
  saveTask,
  addAuditLogEntry,
} from './templeTaskData';

// ============================================================================
// DAILY ROUTINE TASK GENERATOR
// ============================================================================

export interface DailyRoutineConfig {
  templates: TaskTemplate[];
  date: string; // YYYY-MM-DD
  templeId?: string;
}

/**
 * Generate daily routine tasks for a specific date
 */
export function generateDailyRoutineTasks(config: DailyRoutineConfig): TempleTask[] {
  const { templates, date, templeId } = config;
  
  // Filter only daily-routine templates that are active
  const dailyTemplates = templates.filter(
    t => t.type === 'daily-routine' && t.isActive
  );

  const generatedTasks: TempleTask[] = [];
  const existingTasks = getAllTasks();
  const existingTaskKeys = new Set(
    existingTasks
      .filter(t => t.scheduledDate === date && t.type === 'daily-routine')
      .map(t => `${t.type}-${t.title}-${t.timeBlock}`)
  );

  dailyTemplates.forEach(template => {
    const taskKey = `${template.type}-${template.name}-${template.timeBlock}`;
    
    // Skip if task already exists for this date
    if (existingTaskKeys.has(taskKey)) {
      return;
    }

    const task: TempleTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: template.name,
      description: template.description,
      type: 'daily-routine',
      function: template.function,
      timeBlock: template.timeBlock,
      status: 'planned', // Start as planned, needs assignment
      priority: template.priority,
      scheduledDate: date,
      scheduledTime: getDefaultTimeForBlock(template.timeBlock),
      dueTime: calculateDueTime(
        getDefaultTimeForBlock(template.timeBlock),
        template.slaMinutes || template.estimatedDuration || 60
      ),
      dependencies: [], // Will be resolved from template dependencies
      blockedBy: [],
      slaMinutes: template.slaMinutes,
      estimatedDuration: template.estimatedDuration,
      tags: [...template.tags, 'auto-generated', 'daily'],
      category: 'operations',
      createdDate: new Date().toISOString(),
      createdBy: 'system',
      createdByRole: 'system',
      updatedDate: new Date().toISOString(),
      updatedBy: 'system',
      auditLog: [
        {
          id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          action: 'created',
          userId: 'system',
          userName: 'System',
          userRole: 'system',
          details: `Auto-generated daily routine task for ${date}`,
        },
      ],
    };

    generatedTasks.push(task);
  });

  // Resolve dependencies between generated tasks
  generatedTasks.forEach(task => {
    const template = templates.find(t => 
      t.name === task.title && t.type === 'daily-routine'
    );
    
    if (template && template.dependencies.length > 0) {
      // Find dependency tasks that were just generated
      template.dependencies.forEach(depTemplateId => {
        const depTemplate = templates.find(t => t.id === depTemplateId);
        if (depTemplate) {
          const depTask = generatedTasks.find(t => 
            t.title === depTemplate.name && 
            t.timeBlock === depTemplate.timeBlock
          );
          if (depTask) {
            task.dependencies.push(depTask.id);
          }
        }
      });
    }
  });

  // Save all generated tasks
  generatedTasks.forEach(task => {
    saveTask(task);
  });

  return generatedTasks;
}

// ============================================================================
// RITUAL/SEVA TASK GENERATOR
// ============================================================================

export interface RitualTaskConfig {
  sevaId: string;
  sevaName: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  templeId?: string;
  function?: TaskFunction;
  priority?: TaskPriority;
}

/**
 * Generate ritual/seva-linked tasks
 */
export function generateRitualTasks(config: RitualTaskConfig): TempleTask[] {
  const { sevaId, sevaName, scheduledDate, scheduledTime, templeId, function: taskFunction, priority } = config;

  const generatedTasks: TempleTask[] = [];
  const existingTasks = getAllTasks();
  
  // Check if tasks already exist for this seva on this date/time
  const existingSevaTasks = existingTasks.filter(
    t => t.linkedSevaId === sevaId && t.scheduledDate === scheduledDate
  );

  if (existingSevaTasks.length > 0) {
    return existingSevaTasks; // Tasks already generated
  }

  // Generate standard ritual tasks
  const ritualTasks = [
    {
      title: 'Prepare Pooja Items',
      description: `Arrange flowers, fruits, and pooja materials for ${sevaName}`,
      function: 'ritual' as TaskFunction,
      timeBlock: getTimeBlockFromTime(scheduledTime),
      priority: (priority || 'high') as TaskPriority,
      estimatedDuration: 45,
      slaMinutes: 60,
      scheduledTimeOffset: -60, // 1 hour before seva
    },
    {
      title: 'Arrange Seva Prasad',
      description: `Prepare and arrange prasad for ${sevaName}`,
      function: 'kitchen' as TaskFunction,
      timeBlock: getTimeBlockFromTime(scheduledTime),
      priority: (priority || 'high') as TaskPriority,
      estimatedDuration: 30,
      slaMinutes: 45,
      scheduledTimeOffset: -45, // 45 minutes before seva
    },
  ];

  ritualTasks.forEach((taskConfig, index) => {
    const taskScheduledTime = calculateTimeWithOffset(scheduledTime, taskConfig.scheduledTimeOffset);
    
    const task: TempleTask = {
      id: `task-ritual-${sevaId}-${Date.now()}-${index}`,
      title: taskConfig.title,
      description: taskConfig.description,
      type: 'ritual-seva',
      function: taskConfig.function,
      timeBlock: taskConfig.timeBlock,
      status: 'planned',
      priority: taskConfig.priority,
      linkedSevaId: sevaId,
      scheduledDate: scheduledDate,
      scheduledTime: taskScheduledTime,
      dueTime: calculateDueTime(taskScheduledTime, taskConfig.slaMinutes),
      dependencies: [],
      blockedBy: [],
      slaMinutes: taskConfig.slaMinutes,
      estimatedDuration: taskConfig.estimatedDuration,
      tags: ['ritual', 'seva', 'auto-generated', sevaName.toLowerCase().replace(/\s+/g, '-')],
      category: 'ritual',
      createdDate: new Date().toISOString(),
      createdBy: 'system',
      createdByRole: 'system',
      updatedDate: new Date().toISOString(),
      updatedBy: 'system',
      auditLog: [
        {
          id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          action: 'created',
          userId: 'system',
          userName: 'System',
          userRole: 'system',
          details: `Auto-generated ritual task for seva: ${sevaName}`,
        },
      ],
    };

    generatedTasks.push(task);
  });

  // Save all generated tasks
  generatedTasks.forEach(task => {
    saveTask(task);
  });

  return generatedTasks;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDefaultTimeForBlock(block: TimeBlock): string {
  const defaults: Record<TimeBlock, string> = {
    'morning': '06:00',
    'afternoon': '13:00',
    'evening': '17:00',
    'night': '22:00',
  };
  return defaults[block];
}

function getTimeBlockFromTime(time: string): TimeBlock {
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

function calculateDueTime(scheduledTime: string, durationMinutes: number): string {
  const [hours, minutes] = scheduledTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const dueHours = Math.floor(totalMinutes / 60) % 24;
  const dueMins = totalMinutes % 60;
  return `${String(dueHours).padStart(2, '0')}:${String(dueMins).padStart(2, '0')}`;
}

function calculateTimeWithOffset(time: string, offsetMinutes: number): string {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + offsetMinutes;
  
  // Handle negative offsets (before scheduled time)
  let adjustedMinutes = totalMinutes;
  if (adjustedMinutes < 0) {
    adjustedMinutes += 24 * 60; // Add a day
  }
  
  const adjustedHours = Math.floor(adjustedMinutes / 60) % 24;
  const adjustedMins = adjustedMinutes % 60;
  return `${String(adjustedHours).padStart(2, '0')}:${String(adjustedMins).padStart(2, '0')}`;
}

// ============================================================================
// BATCH GENERATION
// ============================================================================

/**
 * Generate all daily routine tasks for a date range
 */
export function generateDailyRoutineTasksForRange(
  startDate: string,
  endDate: string,
  templates: TaskTemplate[] = sampleTemplates
): TempleTask[] {
  const allTasks: TempleTask[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    const tasks = generateDailyRoutineTasks({
      templates,
      date: dateStr,
    });
    allTasks.push(...tasks);
  }
  
  return allTasks;
}

/**
 * Initialize daily tasks for today (call this on app startup or daily cron)
 */
export function initializeDailyTasks(): TempleTask[] {
  const today = new Date().toISOString().split('T')[0];
  return generateDailyRoutineTasks({
    templates: sampleTemplates,
    date: today,
  });
}

