'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography, getStatusColor, getPriorityColor } from '../../../design-system';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  category: string;
  estimatedHours?: number;
  actualHours?: number;
  comments?: Array<{ author: string; text: string; date: string }>;
}

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newComment, setNewComment] = useState('');

  const filteredTasks = tasks.filter(
    (task) => filterStatus === 'all' || task.status === filterStatus
  );

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (taskId: string, newStatus: Task['status']) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  };

  const handleAddComment = () => {
    if (!selectedTask || !newComment.trim()) return;
    // API call would go here
    setNewComment('');
    alert('Comment added successfully!');
  };

  return (
    <ModuleLayout
      title="My Tasks"
      description="View tasks assigned to you"
    >
      {/* Filter */}
      <div
        className="rounded-3xl p-6 mb-6"
        style={{
          backgroundColor: colors.background.base,
          border: `1px solid ${colors.border}`,
          padding: spacing.xl,
        }}
      >
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-auto px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
          style={{
            borderColor: colors.border,
            fontFamily: typography.body.fontFamily,
            fontSize: typography.body.fontSize,
          }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleCardClick(task)}
              className="rounded-3xl p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: colors.background.base,
                border: `1px solid ${colors.border}`,
                padding: spacing.xl,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3
                  style={{
                    fontFamily: typography.sectionHeader.fontFamily,
                    fontSize: typography.sectionHeader.fontSize,
                    fontWeight: typography.sectionHeader.fontWeight,
                    color: colors.text.primary,
                    flex: 1,
                  }}
                >
                  {task.title}
                </h3>
                <span
                  className="px-2 py-1 rounded-lg text-xs"
                  style={{
                    backgroundColor: getPriorityColor(task.priority) + '20',
                    color: getPriorityColor(task.priority),
                    fontFamily: typography.body.fontFamily,
                    fontWeight: 500,
                  }}
                >
                  {task.priority}
                </span>
              </div>
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.muted,
                  marginBottom: spacing.sm,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {task.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: colors.border }}>
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                  }}
                >
                  Due: {task.dueDate}
                </span>
                <span
                  className="px-3 py-1 rounded-xl text-xs"
                  style={{
                    backgroundColor: getStatusColor(task.status) + '20',
                    color: getStatusColor(task.status),
                    fontFamily: typography.body.fontFamily,
                    fontWeight: 500,
                  }}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="rounded-3xl p-12 text-center"
          style={{
            backgroundColor: colors.background.base,
            border: `1px solid ${colors.border}`,
            padding: spacing.xl,
          }}
        >
          <svg
            className="mx-auto mb-4"
            width="64"
            height="64"
            fill="none"
            stroke={colors.text.muted}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.muted,
            }}
          >
            {filterStatus === 'all'
              ? 'No tasks assigned to you yet.'
              : `No ${filterStatus} tasks found.`}
          </p>
        </div>
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
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.muted,
                  marginBottom: spacing.sm,
                }}
              >
                {selectedTask.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                    marginBottom: spacing.xs,
                  }}
                >
                  Status
                </p>
                <select
                  value={selectedTask.status}
                  onChange={(e) =>
                    handleStatusUpdate(selectedTask.id, e.target.value as Task['status'])
                  }
                  className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.border,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                    marginBottom: spacing.xs,
                  }}
                >
                  Priority
                </p>
                <span
                  className="inline-block px-3 py-1 rounded-xl text-xs"
                  style={{
                    backgroundColor: getPriorityColor(selectedTask.priority) + '20',
                    color: getPriorityColor(selectedTask.priority),
                    fontFamily: typography.body.fontFamily,
                    fontWeight: 500,
                  }}
                >
                  {selectedTask.priority}
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                    marginBottom: spacing.xs,
                  }}
                >
                  Due Date
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedTask.dueDate}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                    marginBottom: spacing.xs,
                  }}
                >
                  Category
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedTask.category}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t pt-4" style={{ borderColor: colors.border }}>
              <h4
                style={{
                  fontFamily: typography.sectionHeader.fontFamily,
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: spacing.md,
                  color: colors.text.primary,
                }}
              >
                Comments
              </h4>
              {selectedTask.comments && selectedTask.comments.length > 0 ? (
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {selectedTask.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl"
                      style={{
                        backgroundColor: colors.background.subtle,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: colors.text.primary,
                          }}
                        >
                          {comment.author}
                        </span>
                        <span
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '11px',
                            color: colors.text.light,
                          }}
                        >
                          {comment.date}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.muted,
                        }}
                      >
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className="mb-4"
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.muted,
                  }}
                >
                  No comments yet.
                </p>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.border,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 rounded-xl transition-all hover:scale-105"
                  style={{
                    backgroundColor: colors.primary.base,
                    color: '#ffffff',
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 500,
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}
