'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography, getStatusColor, getPriorityColor } from '../../../design-system';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  category: string;
  estimatedHours?: number;
  actualHours?: number;
}

export default function TaskAssignmentViewPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('grid');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedToName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const kanbanColumns = [
    { id: 'pending', label: 'Pending', tasks: filteredTasks.filter((t) => t.status === 'pending') },
    { id: 'in-progress', label: 'In Progress', tasks: filteredTasks.filter((t) => t.status === 'in-progress') },
    { id: 'completed', label: 'Completed', tasks: filteredTasks.filter((t) => t.status === 'completed') },
    { id: 'overdue', label: 'Overdue', tasks: filteredTasks.filter((t) => t.status === 'overdue') },
  ];

  return (
    <ModuleLayout
      title="Task Assignment View"
      description="View all task assignments"
    >
      {/* Filters and View Toggle */}
      <div
        className="rounded-3xl p-6 mb-6 space-y-4"
        style={{
          backgroundColor: colors.background.base,
          border: `1px solid ${colors.border}`,
          padding: spacing.xl,
        }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
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
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <div className="flex gap-2 border-2 rounded-2xl p-1" style={{ borderColor: colors.border }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-1 rounded-xl transition-all ${
                viewMode === 'grid' ? 'bg-amber-600 text-white' : ''
              }`}
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-1 rounded-xl transition-all ${
                viewMode === 'kanban' ? 'bg-amber-600 text-white' : ''
              }`}
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              Kanban
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
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
                      {task.assignedToName}
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
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.muted,
                }}
              >
                No tasks found matching your criteria.
              </p>
            </div>
          )}
        </>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kanbanColumns.map((column) => (
            <div key={column.id} className="space-y-4">
              <div
                className="rounded-2xl p-4 text-center"
                style={{
                  backgroundColor: colors.background.subtle,
                }}
              >
                <h3
                  style={{
                    fontFamily: typography.sectionHeader.fontFamily,
                    fontSize: typography.sectionHeader.fontSize,
                    fontWeight: typography.sectionHeader.fontWeight,
                    color: colors.text.primary,
                  }}
                >
                  {column.label}
                </h3>
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    color: colors.text.muted,
                  }}
                >
                  {column.tasks.length} {column.tasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleCardClick(task)}
                    className="rounded-2xl p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: colors.background.base,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <h4
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        fontWeight: 600,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {task.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: typography.body.fontFamily,
                        fontSize: '12px',
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
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          color: colors.text.light,
                        }}
                      >
                        {task.assignedToName}
                      </span>
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
                  </div>
                ))}
              </div>
            </div>
          ))}
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
                  Assigned To
                </p>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {selectedTask.assignedToName}
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
                  Status
                </p>
                <span
                  className="inline-block px-3 py-1 rounded-xl text-xs"
                  style={{
                    backgroundColor: getStatusColor(selectedTask.status) + '20',
                    color: getStatusColor(selectedTask.status),
                    fontFamily: typography.body.fontFamily,
                    fontWeight: 500,
                  }}
                >
                  {selectedTask.status}
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
              {selectedTask.estimatedHours && (
                <div>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      color: colors.text.muted,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Estimated Hours
                  </p>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    {selectedTask.estimatedHours} hrs
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
              <button
                className="flex-1 px-4 py-2 rounded-2xl transition-all hover:scale-105"
                style={{
                  backgroundColor: colors.primary.base,
                  color: '#ffffff',
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                }}
              >
                Edit Task
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-2xl border-2 transition-all hover:scale-105"
                style={{
                  borderColor: colors.border,
                  color: colors.text.primary,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}
