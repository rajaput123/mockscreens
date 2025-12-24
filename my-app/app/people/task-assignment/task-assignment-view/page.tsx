'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography, getStatusColor, getPriorityColor, shadows, borders } from '../../../design-system';
import { Task } from '../types';
import { timeBlocks, groupTasksByTimeBlock, getTimeBlockConfig } from '../utils/timeBlocks';
import { formatWorkflowLink } from '../utils/operationsLink';
import { TimeBlockCard, ModernCard } from '../../components';
import { mockTasks } from '../mockData';
import EditTaskModal from '../../components/EditTaskModal';
import UpdateStatusModal from '../../components/UpdateStatusModal';
import AssignTaskModal from '../components/AssignTaskModal';

const mockEmployees = [
  { id: '1', name: 'Arjun Rao' },
  { id: '2', name: 'Meera Iyer' },
  { id: '3', name: 'Karthik Sharma' },
  { id: '4', name: 'Rajesh Kumar' },
  { id: '5', name: 'Priya Sharma' },
];

export default function TaskAssignmentViewPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterTimeBlock, setFilterTimeBlock] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'time-blocks' | 'grid' | 'kanban'>('time-blocks');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedToName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesTimeBlock = filterTimeBlock === 'all' || task.timeBlock === filterTimeBlock;
    return matchesSearch && matchesStatus && matchesPriority && matchesTimeBlock;
  });

  const tasksByTimeBlock = groupTasksByTimeBlock(filteredTasks);

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

  const handleAssignTask = (data: any) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      assignedTo: data.employeeId,
      assignedToName: mockEmployees.find(e => e.id === data.employeeId)?.name || 'Unknown',
      priority: data.priority,
      status: 'pending',
      dueDate: new Date(data.dueDate).toISOString(),
      category: data.category,
      timeBlock: data.timeBlock,
      estimatedHours: data.estimatedHours ? parseFloat(data.estimatedHours) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setIsAssignModalOpen(false);
    alert('Task assigned successfully!');
  };

  return (
    <ModuleLayout
      title="Task Assignment View"
      description="View all task assignments"
    >
      {/* Header with Assign Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsAssignModalOpen(true)}
          className="px-6 py-3 rounded-2xl transition-all hover:scale-105"
          style={{
            backgroundColor: colors.primary.base,
            color: '#ffffff',
            fontFamily: typography.body.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: 600,
            boxShadow: shadows.md,
          }}
        >
          + Assign New Task
        </button>
      </div>

      {/* Filters and View Toggle */}
      <ModernCard className="mb-6" elevation="md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                boxShadow: shadows.sm,
              }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
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
            className="px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterTimeBlock}
            onChange={(e) => setFilterTimeBlock(e.target.value)}
            className="px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          >
            <option value="all">All Time Blocks</option>
            {timeBlocks.map((tb) => (
              <option key={tb.id} value={tb.id}>
                {tb.label}
              </option>
            ))}
          </select>
          <div className="flex gap-2 border-2 rounded-2xl p-1" style={{ borderColor: colors.border, boxShadow: shadows.sm }}>
            <button
              onClick={() => setViewMode('time-blocks')}
              className={`px-4 py-1 rounded-xl transition-all ${
                viewMode === 'time-blocks' ? 'bg-amber-600 text-white shadow-md' : ''
              }`}
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              Time Blocks
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-1 rounded-xl transition-all ${
                viewMode === 'grid' ? 'bg-amber-600 text-white shadow-md' : ''
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
                viewMode === 'kanban' ? 'bg-amber-600 text-white shadow-md' : ''
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
      </ModernCard>

      {/* Time Blocks View */}
      {viewMode === 'time-blocks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {timeBlocks.map((timeBlock) => {
            const blockTasks = tasksByTimeBlock[timeBlock.id];
            return (
              <TimeBlockCard
                key={timeBlock.id}
                title={timeBlock.label}
                timeRange={timeBlock.timeRange}
                taskCount={blockTasks.length}
              >
                {blockTasks.length > 0 ? (
                  blockTasks.map((task) => (
                    <ModernCard
                      key={task.id}
                      onClick={() => handleCardClick(task)}
                      elevation="sm"
                      className="mb-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            fontWeight: 600,
                            color: colors.text.primary,
                            flex: 1,
                          }}
                        >
                          {task.title}
                        </h4>
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
                          fontSize: '0.75rem',
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
                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: borders.color.divider }}>
                        <span
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '0.75rem',
                            color: colors.text.muted,
                          }}
                        >
                          {task.assignedToName}
                        </span>
                        <span
                          className="px-2 py-1 rounded-lg text-xs"
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
                      {task.linkedWorkflowName && (
                        <div className="mt-2 pt-2 border-t" style={{ borderColor: borders.color.divider }}>
                          <p
                            style={{
                              fontFamily: typography.body.fontFamily,
                              fontSize: '0.75rem',
                              color: colors.text.muted,
                              fontStyle: 'italic',
                            }}
                          >
                            {formatWorkflowLink(task.linkedWorkflowName)}
                          </p>
                        </div>
                      )}
                    </ModernCard>
                  ))
                ) : (
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '0.875rem',
                      color: colors.text.muted,
                      textAlign: 'center',
                      padding: spacing.md,
                    }}
                  >
                    No tasks for this time block
                  </p>
                )}
              </TimeBlockCard>
            );
          })}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <ModernCard
                  key={task.id}
                  onClick={() => handleCardClick(task)}
                  elevation="md"
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
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: borders.color.divider }}>
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
                  {task.linkedWorkflowName && (
                    <div className="mt-2 pt-2 border-t" style={{ borderColor: borders.color.divider }}>
                      <p
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '0.75rem',
                          color: colors.text.muted,
                          fontStyle: 'italic',
                        }}
                      >
                        {formatWorkflowLink(task.linkedWorkflowName)}
                      </p>
                    </div>
                  )}
                </ModernCard>
              ))}
            </div>
          ) : (
            <ModernCard elevation="sm" className="text-center p-12">
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.muted,
                }}
              >
                No tasks found matching your criteria.
              </p>
            </ModernCard>
          )}
        </>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kanbanColumns.map((column) => (
            <div key={column.id} className="space-y-4">
              <ModernCard elevation="md" className="text-center">
                <h3
                  style={{
                    fontFamily: typography.sectionHeader.fontFamily,
                    fontSize: typography.sectionHeader.fontSize,
                    fontWeight: typography.sectionHeader.fontWeight,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
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
              </ModernCard>
              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <ModernCard
                    key={task.id}
                    onClick={() => handleCardClick(task)}
                    elevation="sm"
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
                    {task.linkedWorkflowName && (
                      <div className="mt-2 pt-2 border-t" style={{ borderColor: borders.color.divider }}>
                        <p
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '0.75rem',
                            color: colors.text.muted,
                            fontStyle: 'italic',
                          }}
                        >
                          {formatWorkflowLink(task.linkedWorkflowName)}
                        </p>
                      </div>
                    )}
                  </ModernCard>
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
                onClick={() => {
                  setIsEditModalOpen(true);
                }}
                className="flex-1 px-4 py-2 rounded-2xl transition-all hover:scale-105"
                style={{
                  backgroundColor: colors.primary.base,
                  color: '#ffffff',
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                  boxShadow: shadows.md,
                }}
              >
                Edit Task
              </button>
              <button
                onClick={() => {
                  setIsStatusModalOpen(true);
                }}
                className="flex-1 px-4 py-2 rounded-2xl border-2 transition-all hover:scale-105"
                style={{
                  borderColor: colors.border,
                  color: colors.text.primary,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                  boxShadow: shadows.sm,
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
        onSave={(updatedTask) => {
          setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
          setSelectedTask(updatedTask);
          setIsEditModalOpen(false);
        }}
      />

      {/* Update Status Modal */}
      <UpdateStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        task={selectedTask}
        onUpdate={(taskId, newStatus) => {
          setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t));
          if (selectedTask?.id === taskId) {
            setSelectedTask({ ...selectedTask, status: newStatus });
          }
          setIsStatusModalOpen(false);
        }}
      />

      {/* Assign Task Modal */}
      <AssignTaskModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignTask}
        employees={mockEmployees}
      />
    </ModuleLayout>
  );
}
