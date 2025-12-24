'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import ModuleNavigation from '../../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../../components/navigation/navigationData';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendees: number;
  maxCapacity?: number;
  category: string;
  media?: Array<{
    id: string;
    type: 'image' | 'video';
    url: string;
    isPrimary: boolean;
  }>;
}

export default function EventDashboardPage() {
  const module = navigationMenus.projects.find(m => m.id === 'event-management');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Maha Shivaratri Celebration',
      description: 'Annual celebration with special puja and prasad distribution.',
      date: '2024-03-08',
      time: '06:00 PM',
      location: 'Main Temple Hall',
      status: 'upcoming',
      attendees: 500,
      category: 'Religious Festival',
      media: [
        {
          id: 'm1',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop',
          isPrimary: true,
        },
      ],
    },
    {
      id: '2',
      title: 'Bhajan Sandhya',
      description: 'Evening devotional singing session with renowned artists.',
      date: '2024-03-15',
      time: '07:00 PM',
      location: 'Prayer Hall',
      status: 'upcoming',
      attendees: 150,
      category: 'Spiritual Event',
    },
    {
      id: '3',
      title: 'Annadanam Seva',
      description: 'Free meal service for devotees.',
      date: '2024-03-10',
      time: '12:00 PM',
      location: 'Dining Hall',
      status: 'ongoing',
      attendees: 300,
      category: 'Service Event',
    },
    {
      id: '4',
      title: 'Temple Anniversary',
      description: 'Celebrating 25 years of the temple.',
      date: '2024-02-28',
      time: '10:00 AM',
      location: 'Temple Premises',
      status: 'completed',
      attendees: 1000,
      category: 'Special Event',
    },
  ]);

  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
    totalAttendees: events.reduce((sum, e) => sum + e.attendees, 0),
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
      title="Event Dashboard"
      description="Overview of all events and their status"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Event Management', href: '/projects/event-management' },
        { label: 'Event Dashboard' },
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcoming}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50/50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Ongoing</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.ongoing}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Attendees</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAttendees.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Events</h2>
              <p className="text-sm text-gray-600 mt-1">Latest events and their status</p>
            </div>
            <Link
              href="/projects/event-management"
              className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 6).map((event) => {
              const primaryMedia = event.media?.find(m => m.isPrimary) || event.media?.[0];
              
              return (
                <Link
                  key={event.id}
                  href="/projects/event-management"
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
                >
                  {primaryMedia && (
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <img
                        src={primaryMedia.url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute bottom-3 left-3">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm shadow-md ${getStatusColor(
                            event.status
                          )}`}
                        >
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{event.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-gray-400">•</span>
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 mt-3 border-t border-gray-100">
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
