'use client';

import { useState, DragEvent } from 'react';
import { Task, saveTask, getTasksByStatus } from '../taskWorkflowData';
import TaskCard from './TaskCard';

interface TaskKanbanBoardProps {
  tasks: Task[];
  onTaskUpdate?: (task: Task) => void;
  onTaskClick?: (task: Task) => void;
  swimlanes?: 'none' | 'priority' | 'assignee' | 'category';
}

const statusColumns: { id: Task['status']; label: string; color: string }[] = [
  { id: 'pending', label: 'Pending', color: 'bg-gray-100' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-amber-100' },
  { id: 'blocked', label: 'Blocked', color: 'bg-red-100' },
  { id: 'review', label: 'Review', color: 'bg-amber-100' },
  { id: 'completed', label: 'Completed', color: 'bg-amber-100' },
];

export default function TaskKanbanBoard({
  tasks,
  onTaskUpdate,
  onTaskClick,
  swimlanes = 'none',
}: TaskKanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleDragOver = (e: DragEvent, status: Task['status']) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredColumn(status);
  };

  const handleDragLeave = () => {
    setHoveredColumn(null);
  };

  const handleDrop = (e: DragEvent, targetStatus: Task['status']) => {
    e.preventDefault();
    setHoveredColumn(null);

    if (!draggedTask || draggedTask.status === targetStatus) {
      setDraggedTask(null);
      return;
    }

    const updatedTask: Task = {
      ...draggedTask,
      status: targetStatus,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin',
    };

    if (targetStatus === 'completed') {
      updatedTask.completedDate = new Date().toISOString();
      updatedTask.progress = 100;
    } else if (targetStatus === 'in-progress' && updatedTask.progress === 0) {
      updatedTask.progress = 10;
    }

    saveTask(updatedTask);
    onTaskUpdate?.(updatedTask);
    setDraggedTask(null);
  };

  const getTasksForColumn = (status: Task['status']) => {
    return tasks.filter(t => t.status === status);
  };

  const groupTasksBySwimlane = (tasks: Task[]) => {
    if (swimlanes === 'priority') {
      const groups: Record<string, Task[]> = {
        critical: [],
        high: [],
        medium: [],
        low: [],
      };
      tasks.forEach(task => {
        groups[task.priority].push(task);
      });
      return groups;
    } else if (swimlanes === 'assignee') {
      const groups: Record<string, Task[]> = {
        assigned: [],
        unassigned: [],
      };
      tasks.forEach(task => {
        if (task.assigneeId) {
          if (!groups[task.assigneeId]) {
            groups[task.assigneeId] = [];
          }
          groups[task.assigneeId].push(task);
        } else {
          groups.unassigned.push(task);
        }
      });
      return groups;
    } else if (swimlanes === 'category') {
      const groups: Record<string, Task[]> = {};
      tasks.forEach(task => {
        if (!groups[task.category]) {
          groups[task.category] = [];
        }
        groups[task.category].push(task);
      });
      return groups;
    }
    return { all: tasks };
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Task Kanban Board</h3>
        <p className="text-sm text-gray-600">Drag and drop tasks between columns to update status</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusColumns.map((column) => {
          const columnTasks = getTasksForColumn(column.id);
          const isHovered = hoveredColumn === column.id;
          const taskGroups = groupTasksBySwimlane(columnTasks);

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`flex-shrink-0 w-80 bg-white rounded-xl border-2 transition-all duration-200 ${
                isHovered
                  ? 'border-blue-500 shadow-lg scale-105'
                  : 'border-gray-200'
              }`}
            >
              {/* Column Header */}
              <div className={`${column.color} px-4 py-3 rounded-t-xl border-b-2 border-gray-200`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">{column.label}</h4>
                  <span className="bg-white text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-3 space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto">
                {swimlanes === 'none' ? (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={onTaskClick}
                      onDragStart={handleDragStart}
                      isDragging={draggedTask?.id === task.id}
                    />
                  ))
                ) : (
                  Object.entries(taskGroups).map(([groupKey, groupTasks]) => (
                    <div key={groupKey} className="mb-4">
                      <div className="text-xs font-semibold text-gray-600 mb-2 px-2 uppercase">
                        {groupKey}
                      </div>
                      {groupTasks.map((task) => (
                        <div key={task.id} className="mb-3">
                          <TaskCard
                            task={task}
                            onClick={onTaskClick}
                            onDragStart={handleDragStart}
                            isDragging={draggedTask?.id === task.id}
                          />
                        </div>
                      ))}
                    </div>
                  ))
                )}

                {columnTasks.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    <p>No tasks</p>
                    {isHovered && draggedTask && (
                      <p className="mt-2 text-amber-600 font-medium">Drop here</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-gray-600">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500"></div>
          <span className="text-gray-600">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500"></div>
          <span className="text-gray-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500"></div>
          <span className="text-gray-600">Low</span>
        </div>
      </div>
    </div>
  );
}

