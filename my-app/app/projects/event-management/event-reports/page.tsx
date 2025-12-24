'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import ModuleNavigation from '../../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../../components/navigation/navigationData';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendees: number;
  maxCapacity?: number;
  category: string;
  budget?: number;
}

export default function EventReportsPage() {
  const module = navigationMenus.projects.find(m => m.id === 'event-management');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Maha Shivaratri Celebration',
      date: '2024-03-08',
      time: '06:00 PM',
      location: 'Main Temple Hall',
      status: 'upcoming',
      attendees: 500,
      maxCapacity: 1000,
      category: 'Religious Festival',
      budget: 50000,
    },
    {
      id: '2',
      title: 'Bhajan Sandhya',
      date: '2024-03-15',
      time: '07:00 PM',
      location: 'Prayer Hall',
      status: 'upcoming',
      attendees: 150,
      maxCapacity: 200,
      category: 'Spiritual Event',
      budget: 15000,
    },
    {
      id: '3',
      title: 'Annadanam Seva',
      date: '2024-03-10',
      time: '12:00 PM',
      location: 'Dining Hall',
      status: 'ongoing',
      attendees: 300,
      maxCapacity: 500,
      category: 'Service Event',
      budget: 25000,
    },
    {
      id: '4',
      title: 'Temple Anniversary',
      date: '2024-02-28',
      time: '10:00 AM',
      location: 'Temple Premises',
      status: 'completed',
      attendees: 1000,
      maxCapacity: 1200,
      category: 'Special Event',
      budget: 100000,
    },
  ]);

  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
    totalAttendees: events.reduce((sum, e) => sum + e.attendees, 0),
    totalBudget: events.reduce((sum, e) => sum + (e.budget || 0), 0),
    averageAttendees: events.length > 0 ? Math.round(events.reduce((sum, e) => sum + e.attendees, 0) / events.length) : 0,
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'ongoing':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <ModuleLayout
      title="Event Reports"
      description="Generate and view event reports"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Event Management', href: '/projects/event-management' },
        { label: 'Event Reports' },
      ]}
      action={
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </button>
      }
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="event-management"
        category="projects"
      />

      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-6 shadow-md border border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Events</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.completed} completed, {stats.ongoing} ongoing
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50/50 rounded-2xl p-6 shadow-md border border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Attendees</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAttendees.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">
              Avg: {stats.averageAttendees} per event
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl p-6 shadow-md border border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Budget</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalBudget.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-500 mt-2">
              Across all events
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-6 shadow-md border border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-1">Upcoming Events</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcoming}</p>
            <p className="text-xs text-gray-500 mt-2">
              Scheduled events
            </p>
          </div>
        </div>

        {/* Detailed Report Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Event Details Report</h2>
            <p className="text-sm text-gray-600 mt-1">Comprehensive view of all events</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendees</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-amber-50/50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{event.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-gray-500">{event.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.attendees}</div>
                      {event.maxCapacity && (
                        <div className="text-xs text-gray-500">/ {event.maxCapacity}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {event.budget ? `₹${event.budget.toLocaleString('en-IN')}` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                          event.status
                        )}`}
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Events by Category</h3>
            <div className="space-y-3">
              {Array.from(new Set(events.map(e => e.category))).map((category) => {
                const categoryEvents = events.filter(e => e.category === category);
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{category}</span>
                    <span className="text-sm font-semibold text-gray-900">{categoryEvents.length}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Events by Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Upcoming</span>
                <span className="text-sm font-semibold text-amber-600">{stats.upcoming}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Ongoing</span>
                <span className="text-sm font-semibold text-green-600">{stats.ongoing}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Completed</span>
                <span className="text-sm font-semibold text-gray-600">{stats.completed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
