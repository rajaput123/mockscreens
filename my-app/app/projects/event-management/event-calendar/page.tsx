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
  category: string;
}

const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export default function EventCalendarPage() {
  const module = navigationMenus.projects.find(m => m.id === 'event-management');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Maha Shivaratri Celebration',
      date: '2024-03-08',
      time: '06:00 PM',
      location: 'Main Temple Hall',
      status: 'upcoming',
      category: 'Religious Festival',
    },
    {
      id: '2',
      title: 'Bhajan Sandhya',
      date: '2024-03-15',
      time: '07:00 PM',
      location: 'Prayer Hall',
      status: 'upcoming',
      category: 'Spiritual Event',
    },
    {
      id: '3',
      title: 'Annadanam Seva',
      date: '2024-03-10',
      time: '12:00 PM',
      location: 'Dining Hall',
      status: 'ongoing',
      category: 'Service Event',
    },
    {
      id: '4',
      title: 'Temple Anniversary',
      date: '2024-02-28',
      time: '10:00 AM',
      location: 'Temple Premises',
      status: 'completed',
      category: 'Special Event',
    },
    {
      id: '5',
      title: 'Morning Aarti',
      date: '2024-03-12',
      time: '06:00 AM',
      location: 'Main Shrine',
      status: 'upcoming',
      category: 'Daily Ritual',
    },
    {
      id: '6',
      title: 'Yoga & Meditation Session',
      date: '2024-03-14',
      time: '08:00 AM',
      location: 'Meditation Hall',
      status: 'upcoming',
      category: 'Wellness',
    },
  ]);

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
      title="Event Calendar"
      description="View events in calendar format"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Event Management', href: '/projects/event-management' },
        { label: 'Event Calendar' },
      ]}
      action={
        <Link
          href="/projects/event-management"
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          View All Events
        </Link>
      }
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="event-management"
        category="projects"
      />

      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 font-serif">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-sm text-gray-500 mt-1">View and manage your events</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
                }}
                className="p-2.5 hover:bg-amber-50 rounded-xl transition-all duration-200 hover:scale-110 text-gray-600 hover:text-amber-600"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setCurrentDate(new Date());
                }}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-amber-50 rounded-xl transition-all duration-200 hover:text-amber-600 border border-gray-200 hover:border-amber-200"
              >
                Today
              </button>
              <button
                onClick={() => {
                  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
                }}
                className="p-2.5 hover:bg-amber-50 rounded-xl transition-all duration-200 hover:scale-110 text-gray-600 hover:text-amber-600"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700 py-2 text-sm">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square"></div>
            ))}

            {/* Calendar Days */}
            {Array.from({ length: getDaysInMonth(currentDate) }).map((_, index) => {
              const day = index + 1;
              const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
              const dayEvents = events.filter(e => e.date === dateStr);
              const isToday = formatDate(new Date()) === dateStr;
              
              return (
                <div
                  key={day}
                  className={`aspect-square border border-gray-200 rounded-xl p-2 hover:border-amber-500 hover:bg-amber-50 hover:shadow-md transition-all duration-200 cursor-pointer ${
                    isToday ? 'bg-gradient-to-br from-amber-100 to-amber-50 border-amber-500 shadow-sm' : 'bg-white'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-amber-700' : 'text-gray-900'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs px-2 py-0.5 rounded truncate ${getStatusColor(event.status)}`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events for Selected Month */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Events in {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="space-y-3">
            {events
              .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getMonth() === currentDate.getMonth() && 
                       eventDate.getFullYear() === currentDate.getFullYear();
              })
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((event) => (
                <Link
                  key={event.id}
                  href="/projects/event-management"
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-white border border-transparent hover:border-amber-200 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate group-hover:text-amber-700 transition-colors duration-200">{event.title}</h4>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(event.status)}`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{event.time}</span>
                      <span className="text-gray-400">•</span>
                      <span className="flex items-center gap-1">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {event.location}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            {events.filter(event => {
              const eventDate = new Date(event.date);
              return eventDate.getMonth() === currentDate.getMonth() && 
                     eventDate.getFullYear() === currentDate.getFullYear();
            }).length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No events scheduled for this month
              </div>
            )}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
