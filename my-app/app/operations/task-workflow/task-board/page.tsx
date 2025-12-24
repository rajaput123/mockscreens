'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllTasks,
  saveTask,
  Task,
} from '../taskWorkflowData';
import TaskKanbanBoard from '../components/TaskKanbanBoard';
import TaskCard from '../components/TaskCard';

export default function TaskBoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [swimlanes, setSwimlanes] = useState<'none' | 'priority' | 'assignee' | 'category'>('none');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allTasks = getAllTasks();
    setTasks(allTasks);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    loadData();
  };

  return (
    <ModuleLayout
      title="Task Board"
      description="Kanban board for managing tasks with drag-and-drop"
    >
      {/* Controls */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Swimlanes:</label>
            <select
              value={swimlanes}
              onChange={(e) => setSwimlanes(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="none">None</option>
              <option value="priority">By Priority</option>
              <option value="assignee">By Assignee</option>
              <option value="category">By Category</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {tasks.length} total tasks
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="mb-6">
        <TaskKanbanBoard
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskClick={setSelectedTask}
          swimlanes={swimlanes}
        />
      </div>

      {/* Selected Task Details */}
      {selectedTask && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{selectedTask.title}</h3>
            <button
              onClick={() => setSelectedTask(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Task Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-semibold text-gray-900">{selectedTask.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold capitalize ${
                    selectedTask.status === 'completed' ? 'text-amber-600' :
                    selectedTask.status === 'in-progress' ? 'text-amber-600' :
                    selectedTask.status === 'blocked' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {selectedTask.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className="font-semibold text-gray-900 capitalize">{selectedTask.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-semibold text-gray-900">{selectedTask.progress}%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Assignment & Timing</h4>
              <div className="space-y-2 text-sm">
                {selectedTask.assigneeName ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      {selectedTask.assigneeAvatar || selectedTask.assigneeName.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-900">{selectedTask.assigneeName}</span>
                  </div>
                ) : (
                  <div className="text-gray-500">Unassigned</div>
                )}
                {selectedTask.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(selectedTask.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {(selectedTask.estimatedHours || selectedTask.actualHours) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hours:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedTask.actualHours || 0}h / {selectedTask.estimatedHours || 0}h
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <HelpButton module="task-workflow" />
    </ModuleLayout>
  );
}
