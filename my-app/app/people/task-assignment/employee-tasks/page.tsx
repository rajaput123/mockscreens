'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography, getStatusColor, getPriorityColor, shadows } from '../../../design-system';
import { ModernCard, ElevatedCard } from '../../components';
import UpdateStatusModal from '../../components/UpdateStatusModal';
import { Task } from '../types';

// Extended Task interface with comments for UI
interface TaskWithComments extends Task {
  comments?: Array<{ author: string; text: string; date: string }>;
}

// Mock tasks for current employee (in real app, filter by logged-in user)
const mockTasks: TaskWithComments[] = [
  {
    id: 'task-1',
    title: 'Prepare Morning Prasad',
    description: 'Prepare prasad for morning darshan including rice, dal, and sweets. Ensure all items are fresh and properly prepared.',
    assignedTo: 'emp-1',
    assignedToName: 'You',
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date().toISOString(),
    category: 'Kitchen',
    timeBlock: 'morning',
    estimatedHours: 4,
    actualHours: 2,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [
      { author: 'Manager', text: 'Please ensure quality is maintained', date: '2024-01-24' },
    ],
  },
  {
    id: 'task-2',
    title: 'Clean Main Hall',
    description: 'Deep cleaning of main hall before evening aarti. Focus on floor, walls, and decorations.',
    assignedTo: 'emp-1',
    assignedToName: 'You',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    category: 'Maintenance',
    timeBlock: 'afternoon',
    estimatedHours: 2,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [],
  },
  {
    id: 'task-3',
    title: 'Setup Sound System',
    description: 'Setup and test sound system for evening aarti. Check all speakers and microphones.',
    assignedTo: 'emp-1',
    assignedToName: 'You',
    priority: 'high',
    status: 'pending',
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    category: 'Operations',
    timeBlock: 'evening',
    estimatedHours: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
  },
  {
    id: 'task-4',
    title: 'Review Inventory Stock',
    description: 'Review and update inventory levels for perishable items. Create report for management.',
    assignedTo: 'emp-1',
    assignedToName: 'You',
    priority: 'medium',
    status: 'completed',
    dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: 'Inventory',
    timeBlock: 'morning',
    estimatedHours: 3,
    actualHours: 2.5,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [
      { author: 'You', text: 'Completed inventory check. All items accounted for.', date: '2024-01-24' },
    ],
  },
  {
    id: 'task-5',
    title: 'Night Security Rounds',
    description: 'Conduct security rounds of temple premises. Check all entry points and report any issues.',
    assignedTo: 'emp-1',
    assignedToName: 'You',
    priority: 'high',
    status: 'overdue',
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    category: 'Security',
    timeBlock: 'night',
    estimatedHours: 2,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [],
  },
];

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<TaskWithComments[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<TaskWithComments | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [newComment, setNewComment] = useState('');

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter((t) => t.status === 'overdue').length,
  };

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (taskId: string, newStatus: TaskWithComments['status']) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, status: newStatus });
    }
    setIsStatusModalOpen(false);
    alert(`Task status updated to ${newStatus}!`);
  };

  const handleAddComment = () => {
    if (!selectedTask || !newComment.trim()) return;
    
    const updatedTasks = tasks.map((task) => {
      if (task.id === selectedTask.id) {
        return {
          ...task,
          comments: [
            ...(task.comments || []),
            {
              author: 'You', // In real app, get from auth context
              text: newComment,
              date: new Date().toISOString().split('T')[0],
            },
          ],
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    setSelectedTask({
      ...selectedTask,
      comments: [
        ...(selectedTask.comments || []),
        {
          author: 'You',
          text: newComment,
          date: new Date().toISOString().split('T')[0],
        },
      ],
    });
    setNewComment('');
    alert('Comment added successfully!');
  };

  return (
    <ModuleLayout
      title="My Tasks"
      description="View and manage tasks assigned to you"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <ModernCard elevation="md">
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-1">Total</p>
          </div>
        </ModernCard>
        <ModernCard elevation="md">
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-500 mt-1">Pending</p>
          </div>
        </ModernCard>
        <ModernCard elevation="md">
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-xs text-gray-500 mt-1">In Progress</p>
          </div>
        </ModernCard>
        <ModernCard elevation="md">
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-gray-500 mt-1">Completed</p>
          </div>
        </ModernCard>
        <ModernCard elevation="md">
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            <p className="text-xs text-gray-500 mt-1">Overdue</p>
          </div>
        </ModernCard>
      </div>

      {/* Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Filter by Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm bg-white"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </ModernCard>

      {/* Tasks Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <ElevatedCard
              key={task.id}
              onClick={() => handleCardClick(task)}
              elevation="lg"
              className="cursor-pointer transition-all hover:scale-[1.02]"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2 line-clamp-2">
                    {task.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">{task.timeBlock}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-medium ${
                      task.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : task.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700'
                        : task.status === 'overdue'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
                {task.comments && task.comments.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {task.comments.length} {task.comments.length === 1 ? 'comment' : 'comments'}
                    </span>
                  </div>
                )}
              </div>
            </ElevatedCard>
          ))}
        </div>
      ) : (
        <ModernCard elevation="md" className="text-center p-12">
          <svg
            className="mx-auto mb-4 w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-600">
            {filterStatus !== 'all' || filterPriority !== 'all'
              ? 'No tasks found matching your filters.'
              : 'No tasks assigned to you yet.'}
          </p>
        </ModernCard>
      )}

      {/* Task Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTask?.title}
        size="md"
      >
        {selectedTask && (
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-4">{selectedTask.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Status</p>
                <button
                  onClick={() => setIsStatusModalOpen(true)}
                  className={`w-full px-3 py-2 rounded-xl text-sm font-medium text-left transition-all hover:scale-105 ${
                    selectedTask.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : selectedTask.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-700'
                      : selectedTask.status === 'overdue'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {selectedTask.status.replace('-', ' ')} →
                </button>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Priority</p>
                <span
                  className={`inline-block px-3 py-2 rounded-xl text-sm font-medium ${
                    selectedTask.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : selectedTask.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {selectedTask.priority}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Due Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(selectedTask.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Category</p>
                <p className="text-sm font-medium text-gray-900">{selectedTask.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Time Block</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{selectedTask.timeBlock}</p>
              </div>
              {selectedTask.estimatedHours && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Estimated Hours</p>
                  <p className="text-sm font-medium text-gray-900">{selectedTask.estimatedHours} hrs</p>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Comments</h4>
              {selectedTask.comments && selectedTask.comments.length > 0 ? (
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {selectedTask.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-400">{comment.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-4 text-sm text-gray-500">No comments yet.</p>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-medium transition-all hover:bg-amber-700 hover:scale-105 shadow-md"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      {selectedTask && (
        <UpdateStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          task={selectedTask}
          onUpdate={handleStatusUpdate}
        />
      )}
    </ModuleLayout>
  );
}
