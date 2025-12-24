'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { ModernCard, ElevatedCard, DutyCard } from '../../components';
import { Duty } from '../types';
import { mockDuties } from '../mockData';
import { Modal } from '../../../components';

export default function DutySchedulePage() {
  const [duties, setDuties] = useState<Duty[]>(mockDuties);
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDuty, setSelectedDuty] = useState<Duty | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const events = Array.from(new Set(duties.map(d => d.eventName))).filter(Boolean);

  const filteredDuties = duties.filter((duty) => {
    const matchesEvent = selectedEvent === 'all' || duty.eventName === selectedEvent;
    const dutyDate = new Date(duty.when).toISOString().split('T')[0];
    const matchesDate = selectedDate === '' || dutyDate === selectedDate;
    return matchesEvent && matchesDate;
  });

  const dutiesByEvent = filteredDuties.reduce((acc, duty) => {
    const eventName = duty.eventName || 'Unassigned';
    if (!acc[eventName]) {
      acc[eventName] = [];
    }
    acc[eventName].push(duty);
    return acc;
  }, {} as Record<string, Duty[]>);

  const handleDutyClick = (duty: Duty) => {
    setSelectedDuty(duty);
    setIsDetailModalOpen(true);
  };

  const stats = {
    total: duties.length,
    scheduled: duties.filter(d => d.status === 'scheduled').length,
    completed: duties.filter(d => d.status === 'completed').length,
    cancelled: duties.filter(d => d.status === 'cancelled').length,
  };

  return (
    <ModuleLayout
      title="Duty Schedule"
      description="View and manage volunteer duty schedules by event"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <ModernCard elevation="md" className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Total Duties</p>
        </ModernCard>
        <ModernCard elevation="md" className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
          <p className="text-xs text-gray-500 mt-1">Scheduled</p>
        </ModernCard>
        <ModernCard elevation="md" className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-xs text-gray-500 mt-1">Completed</p>
        </ModernCard>
        <ModernCard elevation="md" className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          <p className="text-xs text-gray-500 mt-1">Cancelled</p>
        </ModernCard>
      </div>

      {/* Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Event</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm bg-white"
            >
              <option value="all">All Events</option>
              {events.map((event) => (
                <option key={event} value={event}>
                  {event}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>
      </ModernCard>

      {/* Duties by Event */}
      {Object.keys(dutiesByEvent).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(dutiesByEvent).map(([eventName, eventDuties]) => (
            <div key={eventName}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{eventName}</h2>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
                  {eventDuties.length} {eventDuties.length === 1 ? 'duty' : 'duties'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventDuties.map((duty) => (
                  <div
                    key={duty.id}
                    onClick={() => handleDutyClick(duty)}
                    className="cursor-pointer"
                  >
                    <DutyCard
                      what={duty.what}
                      where={duty.where}
                      when={duty.when}
                      volunteerName={duty.volunteerName}
                      eventName={duty.eventName}
                      status={duty.status}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ModernCard elevation="sm" className="text-center p-12">
          <svg
            className="mx-auto mb-4 w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="text-gray-600">
            No duties scheduled. Assign duties to volunteers to see them here.
          </p>
        </ModernCard>
      )}

      {/* Duty Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Duty Details"
        size="md"
      >
        {selectedDuty && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">What</p>
                <p className="text-sm font-semibold text-gray-900">{selectedDuty.what}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Where</p>
                <p className="text-sm font-semibold text-gray-900">{selectedDuty.where}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">When</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(selectedDuty.when).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium ${
                  selectedDuty.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : selectedDuty.status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {selectedDuty.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Volunteer</p>
                <p className="text-sm font-semibold text-gray-900">{selectedDuty.volunteerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Event</p>
                <p className="text-sm font-semibold text-gray-900">{selectedDuty.eventName}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}
