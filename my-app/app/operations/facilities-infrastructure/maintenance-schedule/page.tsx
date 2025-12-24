'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllMaintenanceTasks,
  getAllRooms,
  getAllParkingSlots,
  saveMaintenanceTask,
  getUpcomingMaintenanceTasks,
  getOverdueMaintenanceTasks,
  MaintenanceTask,
  Room,
  ParkingSlot,
} from '../facilitiesData';
import MaintenanceTimeline from '../components/MaintenanceTimeline';

export default function MaintenanceSchedulePage() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    facilityId: '',
    facilityType: 'room' as 'room' | 'parking' | 'building' | 'other',
    type: 'preventive' as 'preventive' | 'corrective' | 'emergency',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    scheduledDate: new Date().toISOString().split('T')[0],
    assignedTo: '',
    estimatedCost: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allTasks = getAllMaintenanceTasks();
    const allRooms = getAllRooms();
    const allParkingSlots = getAllParkingSlots();
    setTasks(allTasks);
    setRooms(allRooms);
    setParkingSlots(allParkingSlots);
  };

  const upcomingTasks = getUpcomingMaintenanceTasks(30);
  const overdueTasks = getOverdueMaintenanceTasks();
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const getFacilityName = (task: MaintenanceTask) => {
    if (task.facilityType === 'room') {
      const room = rooms.find(r => r.id === task.facilityId);
      return room?.name || task.facilityId;
    } else if (task.facilityType === 'parking') {
      const slot = parkingSlots.find(s => s.id === task.facilityId);
      return slot?.slotNumber || task.facilityId;
    }
    return task.facilityId;
  };

  const handleOpenModal = (task?: MaintenanceTask) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        facilityId: task.facilityId,
        facilityType: task.facilityType,
        type: task.type,
        priority: task.priority,
        scheduledDate: task.scheduledDate.split('T')[0],
        assignedTo: task.assignedTo || '',
        estimatedCost: task.estimatedCost?.toString() || '',
        notes: task.notes || '',
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        facilityId: '',
        facilityType: 'room',
        type: 'preventive',
        priority: 'medium',
        scheduledDate: new Date().toISOString().split('T')[0],
        assignedTo: '',
        estimatedCost: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    loadData();
  };

  const handleSave = () => {
    if (!formData.title || !formData.facilityId) {
      alert('Please fill in all required fields');
      return;
    }

    const task: MaintenanceTask = {
      id: editingTask?.id || `task-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      facilityId: formData.facilityId,
      facilityType: formData.facilityType,
      type: formData.type,
      priority: formData.priority,
      status: editingTask?.status || 'scheduled',
      scheduledDate: formData.scheduledDate,
      assignedTo: formData.assignedTo || undefined,
      estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
      notes: formData.notes || undefined,
      createdAt: editingTask?.createdAt || new Date().toISOString(),
      createdBy: 'Admin',
    };

    saveMaintenanceTask(task);
    alert('Maintenance task saved successfully!');
    handleCloseModal();
  };

  const handleStatusChange = (taskId: string, status: MaintenanceTask['status']) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask: MaintenanceTask = {
      ...task,
      status,
      completedDate: status === 'completed' ? new Date().toISOString() : task.completedDate,
    };

    saveMaintenanceTask(updatedTask);
    loadData();
  };

  const facilities = [
    ...rooms.map(r => ({ id: r.id, name: r.name, type: 'room' as const })),
    ...parkingSlots.map(s => ({ id: s.id, name: s.slotNumber, type: 'parking' as const })),
  ];

  return (
    <ModuleLayout
      title="Maintenance Schedule"
      description="Schedule and track preventive and corrective maintenance tasks"
    >
      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-amber-600 text-white rounded-2xl font-sans text-base font-medium hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          + Schedule Maintenance
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Overdue</div>
          <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-amber-600">{inProgressTasks.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Upcoming</div>
          <div className="text-2xl font-bold text-amber-600">{upcomingTasks.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Completed</div>
          <div className="text-2xl font-bold text-amber-600">{completedTasks.length}</div>
        </div>
      </div>

      {/* Overdue Alerts */}
      {overdueTasks.length > 0 && (
        <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-sm font-semibold text-red-900">Overdue Maintenance Tasks</h3>
            </div>
          </div>
          <div className="space-y-2">
            {overdueTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="p-3 bg-white border border-red-200 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-red-900">{task.title}</div>
                    <div className="text-xs text-red-700">
                      {getFacilityName(task)} • Scheduled: {new Date(task.scheduledDate).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleStatusChange(task.id, 'in-progress')}
                    className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-medium hover:bg-amber-700"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Timeline */}
      <div className="mb-6">
        <MaintenanceTimeline
          tasks={tasks}
          daysRange={30}
          onTaskClick={(task) => handleOpenModal(task)}
        />
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Maintenance Tasks</h2>
          <p className="text-sm text-gray-600 mt-1">{tasks.length} total tasks</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No maintenance tasks scheduled</p>
              </div>
            ) : (
              tasks.map((task) => {
                const priorityColors = {
                  critical: 'bg-red-100 text-red-700 border-red-300',
                  high: 'bg-amber-100 text-amber-700 border-amber-300',
                  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                  low: 'bg-amber-100 text-amber-700 border-green-300',
                };

                const statusColors = {
                  scheduled: 'bg-amber-100 text-amber-700',
                  'in-progress': 'bg-amber-100 text-amber-700',
                  completed: 'bg-amber-100 text-amber-700',
                  cancelled: 'bg-gray-100 text-gray-700',
                };

                const daysUntil = Math.ceil(
                  (new Date(task.scheduledDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={task.id}
                    className="p-4 border-2 rounded-xl hover:shadow-md transition-all duration-200"
                    style={{
                      borderColor: task.priority === 'critical' ? '#dc2626' :
                                   task.priority === 'high' ? '#f59e0b' :
                                   task.priority === 'medium' ? '#eab308' : '#a87738',
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>Facility: {getFacilityName(task)}</span>
                          <span>•</span>
                          <span>Type: {task.type}</span>
                          <span>•</span>
                          <span>
                            Scheduled: {new Date(task.scheduledDate).toLocaleDateString()}
                            {daysUntil >= 0 ? ` (${daysUntil} days)` : ` (${Math.abs(daysUntil)} days overdue)`}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(task)}
                          className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        {task.status === 'scheduled' && (
                          <button
                            onClick={() => handleStatusChange(task.id, 'in-progress')}
                            className="px-3 py-1 text-sm font-medium text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors"
                          >
                            Start
                          </button>
                        )}
                        {task.status === 'in-progress' && (
                          <button
                            onClick={() => handleStatusChange(task.id, 'completed')}
                            className="px-3 py-1 text-sm font-medium text-amber-700 bg-amber-100 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                    {task.assignedTo && (
                      <div className="text-xs text-gray-600">
                        Assigned to: {task.assignedTo}
                      </div>
                    )}
                    {task.estimatedCost && (
                      <div className="text-xs text-gray-600">
                        Estimated Cost: ₹{task.estimatedCost.toLocaleString()}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTask ? 'Edit Maintenance Task' : 'Schedule Maintenance Task'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facility Type *
                  </label>
                  <select
                    value={formData.facilityType}
                    onChange={(e) => setFormData(prev => ({ ...prev, facilityType: e.target.value as any, facilityId: '' }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="room">Room</option>
                    <option value="parking">Parking</option>
                    <option value="building">Building</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facility *
                  </label>
                  <select
                    value={formData.facilityId}
                    onChange={(e) => setFormData(prev => ({ ...prev, facilityId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select facility</option>
                    {facilities
                      .filter(f => f.type === formData.facilityType || formData.facilityType === 'building' || formData.facilityType === 'other')
                      .map((facility) => (
                        <option key={facility.id} value={facility.id}>
                          {facility.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="preventive">Preventive</option>
                    <option value="corrective">Corrective</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Staff name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Cost
                </label>
                <input
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: e.target.value }))}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium"
                >
                  {editingTask ? 'Update Task' : 'Schedule Task'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <HelpButton module="facilities-infrastructure" />
    </ModuleLayout>
  );
}

