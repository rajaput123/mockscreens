'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import TempleTaskBoard from '../components/TempleTaskBoard';
import {
  TempleTask,
  getAllTasks,
  saveTask,
  getTaskTypeLabel,
  getStatusLabel,
  getTimeBlockLabel,
  getFunctionLabel,
  ROLE_PERMISSIONS,
} from '../templeTaskData';
import { colors, spacing, typography } from '../../../design-system';

export default function TempleTaskBoardPage() {
  const [selectedTask, setSelectedTask] = useState<TempleTask | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [currentUserRole, setCurrentUserRole] = useState<string>('operations-manager');

  const handleTaskUpdate = (updatedTask: TempleTask) => {
    saveTask(updatedTask);
    setSelectedTask(updatedTask);
  };

  const handleTaskClick = (task: TempleTask) => {
    setSelectedTask(task);
  };

  const permissions = ROLE_PERMISSIONS[currentUserRole as keyof typeof ROLE_PERMISSIONS] || 
    ROLE_PERMISSIONS['operations-manager'];

  return (
    <ModuleLayout
      title="Temple Task Board"
      description="Operational readiness dashboard - View tasks grouped by time block and function"
      breadcrumbs={[
        { label: 'Operations', href: '/operations' },
        { label: 'Task & Workflow', href: '/operations/task-workflow' },
        { label: 'Task Board' },
      ]}
    >
      {/* Date Selector */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <div className="ml-auto flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Role:</label>
            <select
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="temple-administrator">Temple Administrator</option>
              <option value="operations-manager">Operations Manager</option>
              <option value="ops-staff">Ops Staff</option>
              <option value="priest-gurugal">Priest / Gurugal</option>
              <option value="kitchen-manager">Kitchen Manager</option>
              <option value="kitchen-staff">Kitchen Staff</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Board */}
      <div className="mb-6">
        <TempleTaskBoard
          selectedDate={selectedDate}
          onTaskClick={handleTaskClick}
          onTaskUpdate={handleTaskUpdate}
          currentUserRole={currentUserRole}
        />
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedTask.title}</h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <div className="mt-1">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: getTaskTypeColor(selectedTask.type) }}
                      >
                        {getTaskTypeLabel(selectedTask.type)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Function</label>
                    <div className="mt-1 text-sm text-gray-900">{getFunctionLabel(selectedTask.function)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Time Block</label>
                    <div className="mt-1 text-sm text-gray-900">{getTimeBlockLabel(selectedTask.timeBlock)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: getStatusColor(selectedTask.status) }}
                      >
                        {getStatusLabel(selectedTask.status)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priority</label>
                    <div className="mt-1 text-sm text-gray-900 capitalize">{selectedTask.priority}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Scheduled Date</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {new Date(selectedTask.scheduledDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTask.description}</p>
              </div>

              {/* Timing */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timing</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedTask.scheduledTime && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Scheduled Time</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedTask.scheduledTime}</div>
                    </div>
                  )}
                  {selectedTask.dueTime && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Due Time</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedTask.dueTime}</div>
                    </div>
                  )}
                  {selectedTask.completedTime && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Completed Time</label>
                      <div className="mt-1 text-sm text-amber-600 font-medium">{selectedTask.completedTime}</div>
                    </div>
                  )}
                  {selectedTask.slaMinutes && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">SLA</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedTask.slaMinutes} minutes</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Assignment */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h3>
                {selectedTask.assigneeName ? (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: getTaskTypeColor(selectedTask.type) }}
                    >
                      {selectedTask.assigneeAvatar || selectedTask.assigneeName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{selectedTask.assigneeName}</div>
                      <div className="text-sm text-gray-600">{selectedTask.assigneeRole}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">Unassigned</div>
                )}
              </div>

              {/* Duration */}
              {(selectedTask.estimatedDuration || selectedTask.actualDuration) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Duration</h3>
                  <div className="text-sm text-gray-900">
                    {selectedTask.actualDuration ? (
                      <span>
                        Actual: {selectedTask.actualDuration} minutes
                        {selectedTask.estimatedDuration && ` / Estimated: ${selectedTask.estimatedDuration} minutes`}
                      </span>
                    ) : (
                      <span>Estimated: {selectedTask.estimatedDuration} minutes</span>
                    )}
                  </div>
                </div>
              )}

              {/* Escalation */}
              {selectedTask.status === 'escalated' && selectedTask.escalationReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Escalation</h3>
                  <p className="text-sm text-red-700">{selectedTask.escalationReason}</p>
                  {selectedTask.escalatedAt && (
                    <p className="text-xs text-red-600 mt-2">
                      Escalated at: {new Date(selectedTask.escalatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Dependencies */}
              {selectedTask.dependencies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dependencies</h3>
                  <div className="text-sm text-gray-600">
                    This task depends on {selectedTask.dependencies.length} other task(s)
                  </div>
                </div>
              )}

              {/* Blockers */}
              {selectedTask.blockedBy.length > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">Blockers</h3>
                  <div className="text-sm text-orange-700">
                    This task is blocked by {selectedTask.blockedBy.length} other task(s)
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedTask.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Audit Log (if user has permission) */}
              {permissions.canViewAuditLogs && selectedTask.auditLog.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
                  <div className="space-y-2">
                    {selectedTask.auditLog.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{entry.action}</span>
                          <span className="text-gray-500 text-xs">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          {entry.userName} ({entry.userRole})
                        </div>
                        {entry.details && (
                          <div className="text-gray-500 text-xs mt-1">{entry.details}</div>
                        )}
                        {entry.previousValue && entry.newValue && (
                          <div className="text-gray-500 text-xs mt-1">
                            {entry.previousValue} → {entry.newValue}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <HelpButton module="task-workflow" />
    </ModuleLayout>
  );
}

