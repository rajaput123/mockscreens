'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import CreateEventModal from '../../components/events/CreateEventModal';
import ModuleLayout from '../../components/layout/ModuleLayout';
import { navigationMenus } from '../../components/navigation/navigationData';
import { colors } from '../../design-system/colors';

// Calendar helper functions
const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

interface EventMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  isPrimary: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendees: number;
  maxCapacity?: number;
  category: string;
  eventType?: string;
  priestAssigned?: string;
  pujaItems?: string;
  budget?: number;
  registrationRequired?: boolean;
  contactPerson?: string;
  contactPhone?: string;
  specialInstructions?: string;
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  media?: EventMedia[];
}

export default function EventManagement() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const module = navigationMenus.projects.find(m => m.id === 'event-management');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar'>('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Check for query parameter to open create modal
  useEffect(() => {
    if (searchParams?.get('action') === 'create') {
      setShowCreateModal(true);
      // Remove the query parameter from URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete('action');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const videoUploadRef = useRef<HTMLInputElement>(null);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Maha Shivaratri Celebration',
      description: 'Annual celebration with special puja and prasad distribution. Join us for this auspicious occasion.',
      date: '2024-03-08',
      time: '06:00 PM',
      location: 'Main Temple Hall',
      status: 'upcoming',
      attendees: 500,
      category: 'Religious Festival',
      media: [
        {
          id: 'm1',
          type: 'video',
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
          isPrimary: true,
        },
        {
          id: 'm2',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&q=80',
          isPrimary: false,
        },
        {
          id: 'm3',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop&q=80',
          isPrimary: false,
        },
      ],
    },
    {
      id: '2',
      title: 'Bhajan Sandhya',
      description: 'Evening devotional singing session with renowned artists. Experience divine melodies.',
      date: '2024-03-15',
      time: '07:00 PM',
      location: 'Prayer Hall',
      status: 'upcoming',
      attendees: 150,
      category: 'Spiritual Event',
      media: [
        {
          id: 'm4',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
          isPrimary: true,
        },
        {
          id: 'm5',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop&q=80',
          isPrimary: false,
        },
      ],
    },
    {
      id: '3',
      title: 'Annadanam Seva',
      description: 'Free meal service for devotees. Serving with love and devotion to all.',
      date: '2024-03-10',
      time: '12:00 PM',
      location: 'Dining Hall',
      status: 'ongoing',
      attendees: 300,
      category: 'Service Event',
      media: [
        {
          id: 'm6',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&q=80',
          isPrimary: true,
        },
        {
          id: 'm7',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
          isPrimary: false,
        },
        {
          id: 'm8',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop&q=80',
          isPrimary: false,
        },
      ],
    },
    {
      id: '4',
      title: 'Temple Anniversary',
      description: 'Celebrating 25 years of the temple. Special ceremonies and cultural programs.',
      date: '2024-02-28',
      time: '10:00 AM',
      location: 'Temple Premises',
      status: 'completed',
      attendees: 1000,
      category: 'Special Event',
      media: [
        {
          id: 'm9',
          type: 'video',
          url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop&q=80',
          isPrimary: true,
        },
        {
          id: 'm10',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&q=80',
          isPrimary: false,
        },
      ],
    },
    {
      id: '5',
      title: 'Morning Aarti',
      description: 'Daily morning prayer ceremony with traditional rituals and offerings.',
      date: '2024-03-12',
      time: '06:00 AM',
      location: 'Main Shrine',
      status: 'upcoming',
      attendees: 200,
      category: 'Daily Ritual',
      media: [
        {
          id: 'm11',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
          isPrimary: true,
        },
      ],
    },
    {
      id: '6',
      title: 'Yoga & Meditation Session',
      description: 'Weekly yoga and meditation classes for spiritual wellness.',
      date: '2024-03-14',
      time: '08:00 AM',
      location: 'Meditation Hall',
      status: 'upcoming',
      attendees: 80,
      category: 'Wellness',
      media: [
        {
          id: 'm12',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&q=80',
          isPrimary: true,
        },
        {
          id: 'm13',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop&q=80',
          isPrimary: false,
        },
      ],
    },
  ]);


  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'ongoing':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleCreateEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
    // Show success message or notification
    console.log('Event created successfully:', newEvent.title);
    // Switch to dashboard tab after creating event
    setActiveTab('dashboard');
  };

  const handleExecuteEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, status: 'ongoing' as const }
        : event
    ));
  };

  const handleCompleteEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, status: 'completed' as const }
        : event
    ));
  };

  const handleCancelEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, status: 'cancelled' as const }
        : event
    ));
  };

  const handleAddMediaToEvent = (eventId: string, files: File[], type: 'image' | 'video') => {
    const newMedia = files.map((file, index) => {
      const id = Date.now().toString() + index + Math.random().toString(36).substr(2, 9);
      let url: string;
      
      try {
        // Create blob URL for immediate preview
        url = URL.createObjectURL(file);
      } catch (error) {
        console.error('Error creating blob URL:', error);
        url = '';
      }
      
      return {
        id,
        type,
        url,
        isPrimary: false,
      };
    });

    // Update events array
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const existingMedia = event.media || [];
        // If video is added, set it as primary and unset other primary flags
        if (type === 'video') {
          const updatedMedia = existingMedia.map(m => ({ ...m, isPrimary: false }));
          if (newMedia.length > 0) {
            newMedia[0].isPrimary = true;
          }
          return { ...event, media: [...updatedMedia, ...newMedia] };
        } else {
          // If no video exists and no primary image, set first new image as primary
          const hasVideo = existingMedia.some(m => m.type === 'video');
          const hasPrimary = existingMedia.some(m => m.isPrimary);
          if (!hasVideo && !hasPrimary && newMedia.length > 0) {
            newMedia[0].isPrimary = true;
          }
          return { ...event, media: [...existingMedia, ...newMedia] };
        }
      }
      return event;
    });

    setEvents(updatedEvents);

    // Update selectedEvent if it's the same event
    if (selectedEvent && selectedEvent.id === eventId) {
      const existingMedia = selectedEvent.media || [];
      let updatedMedia;
      
      if (type === 'video') {
        updatedMedia = existingMedia.map(m => ({ ...m, isPrimary: false }));
        if (newMedia.length > 0) {
          newMedia[0].isPrimary = true;
        }
        updatedMedia = [...updatedMedia, ...newMedia];
      } else {
        const hasVideo = existingMedia.some(m => m.type === 'video');
        const hasPrimary = existingMedia.some(m => m.isPrimary);
        if (!hasVideo && !hasPrimary && newMedia.length > 0) {
          newMedia[0].isPrimary = true;
        }
        updatedMedia = [...existingMedia, ...newMedia];
      }
      
      setSelectedEvent({ ...selectedEvent, media: updatedMedia });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (!selectedEvent) {
      alert('Please select an event first.');
      return;
    }
    
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) {
      return;
    }
    
    try {
      handleAddMediaToEvent(selectedEvent.id, files, type);
    } catch (error) {
      console.error('Error adding media:', error);
      alert('Error uploading files. Please try again.');
    }
    
    // Reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
  };

  return (
    <ModuleLayout
      title="Event Management"
      description="Manage and organize temple events"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Event Management' },
      ]}
      action={
        <div className="flex items-center gap-3">
          <Link
            href="/projects/event-management/execute-event"
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 group"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Execute Event
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 group"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="group-hover:rotate-90 transition-transform duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </button>
        </div>
      }
    >
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 mt-2">
          {subServices.map((item) => {
            if (item.id === 'create-event') {
              return (
                <button
                  key={item.id}
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center rounded-xl transition-all duration-200 py-2.5 px-5 font-medium text-sm no-underline shadow-sm bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 hover:shadow-md"
                >
                  {item.label}
                </button>
              );
            }
            const route = `/projects/event-management/${item.id}`;
            const isActive = pathname === route || pathname?.startsWith(route + '/');
            return (
              <Link
                key={item.id}
                href={route}
                className={`inline-flex items-center rounded-xl transition-all duration-200 py-2.5 px-5 font-medium text-sm no-underline shadow-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border border-amber-600 shadow-md scale-105'
                    : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 hover:shadow-md'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {functions.map((item) => {
            const route = `/projects/event-management/${item.id}`;
            const isActive = pathname === route || pathname?.startsWith(route + '/');
            return (
              <Link
                key={item.id}
                href={route}
                className={`inline-flex items-center rounded-xl transition-all duration-200 py-2.5 px-5 font-medium text-sm no-underline shadow-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border border-amber-600 shadow-md scale-105'
                    : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 hover:shadow-md'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 bg-gray-50/50 rounded-t-2xl p-1">
            <button
              onClick={() => {
                setActiveTab('dashboard');
              }}
              className={`px-6 py-3 font-medium transition-all duration-200 rounded-xl ${
                activeTab === 'dashboard'
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('calendar');
              }}
              className={`px-6 py-3 font-medium transition-all duration-200 rounded-xl ${
                activeTab === 'calendar'
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Calendar
            </button>
          </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            </div>

            {/* Events Grid */}
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">All Events</h2>
                <p className="text-sm text-gray-600 mt-1">Browse through upcoming and past events</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => {
                  const primaryMedia = event.media?.find(m => m.isPrimary) || event.media?.[0];
                  const otherMedia = event.media?.filter(m => m.id !== primaryMedia?.id) || [];
                  
                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
                    >
                      {/* Media Section */}
                      {primaryMedia && (
                        <div className="relative h-48 overflow-hidden bg-gray-200" onClick={(e) => e.stopPropagation()}>
                          {primaryMedia.type === 'video' ? (
                            <div className="relative w-full h-full">
                              {playingVideoId === primaryMedia.id ? (
                                <video
                                  src={primaryMedia.url}
                                  controls
                                  autoPlay
                                  className="w-full h-full object-cover"
                                  onEnded={() => setPlayingVideoId(null)}
                                />
                              ) : (
                                <>
                                  <img
                                    src={primaryMedia.url}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div 
                                    className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer hover:bg-opacity-40 transition-opacity duration-200"
                                    onClick={() => setPlayingVideoId(primaryMedia.id)}
                                  >
                                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 hover:scale-110">
                                      <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24" className="text-amber-600 ml-1">
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    </div>
                                  </div>
                                </>
                              )}
                              {event.media && event.media.length > 1 && (
                                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {event.media.length}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="relative w-full h-full group/image">
                              <img
                                src={primaryMedia.url}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              {event.media && event.media.length > 1 && (
                                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {event.media.length}
                                </div>
                              )}
                            </div>
                          )}
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
                      
                      {/* Content Section */}
                      <div className="p-5">
                        <div className="mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{event.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span className="text-gray-400">•</span>
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{event.attendees} attendees</span>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                              {event.category}
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                              }}
                              className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors duration-200"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
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
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-white border border-transparent hover:border-amber-200 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                        {event.media && event.media[0] && (
                          <img
                            src={event.media[0].url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
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
                    </div>
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
        )}
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateEvent={handleCreateEvent}
      />

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fade-in_0.3s_cubic-bezier(0.4,0,0.2,1)] overflow-y-auto"
          onClick={() => {
            setSelectedEvent(null);
            setPlayingVideoId(null);
          }}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-[scale-in_0.3s_cubic-bezier(0.4,0,0.2,1)] my-8 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hidden file inputs */}
            <input
              ref={imageUploadRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelect(e, 'image')}
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'none' }}
              id="image-upload-input"
            />
            <input
              ref={videoUploadRef}
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleFileSelect(e, 'video')}
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'none' }}
              id="video-upload-input"
            />
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-white to-gray-50/50 border-b border-gray-200 px-6 py-5 flex items-center justify-between rounded-t-3xl z-10 backdrop-blur-sm">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 font-serif">{selectedEvent.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedEvent.category}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setPlayingVideoId(null);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl p-2 transition-all duration-200 hover:scale-110"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Primary Media */}
              {selectedEvent.media && selectedEvent.media.length > 0 && (
                <div className="mb-6">
                  {(() => {
                    const primaryMedia = selectedEvent.media.find(m => m.isPrimary) || selectedEvent.media[0];
                    return primaryMedia.type === 'video' ? (
                      <div className="relative w-full h-96 rounded-xl overflow-hidden bg-black">
                        {playingVideoId === primaryMedia.id ? (
                          <video
                            src={primaryMedia.url}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                            onEnded={() => setPlayingVideoId(null)}
                          />
                        ) : (
                          <div className="relative w-full h-full bg-gray-100">
                            <img
                              src={primaryMedia.url}
                              alt={selectedEvent.title}
                              className="w-full h-full object-cover"
                            />
                            <div 
                              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer hover:bg-opacity-50 transition-opacity duration-200"
                              onClick={() => setPlayingVideoId(primaryMedia.id)}
                            >
                              <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 hover:scale-110">
                                <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24" className="text-amber-600 ml-1">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative group/image-detail">
                        <img
                          src={primaryMedia.url}
                          alt={selectedEvent.title}
                          className="w-full h-96 object-cover rounded-xl bg-gray-100"
                        />
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Event Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date & Time</p>
                      <p className="text-gray-900 font-medium">
                        {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-gray-600">
                        {selectedEvent.time}
                        {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-gray-900 font-medium">{selectedEvent.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Expected Attendees</p>
                      <p className="text-gray-900 font-medium">
                        {selectedEvent.attendees} people
                        {selectedEvent.maxCapacity && ` / Max: ${selectedEvent.maxCapacity}`}
                      </p>
                    </div>
                  </div>

                  {selectedEvent.eventType && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Event Type / Seva Type</p>
                        <p className="text-gray-900 font-medium">{selectedEvent.eventType}</p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.priestAssigned && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Priest / Pandit Assigned</p>
                        <p className="text-gray-900 font-medium">{selectedEvent.priestAssigned}</p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.budget && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Budget / Estimated Cost</p>
                        <p className="text-gray-900 font-medium">₹{selectedEvent.budget.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  )}

                  {(selectedEvent.contactPerson || selectedEvent.contactPhone) && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact Person</p>
                        <p className="text-gray-900 font-medium">
                          {selectedEvent.contactPerson}
                          {selectedEvent.contactPhone && (
                            <span className="text-gray-600 ml-2">• {selectedEvent.contactPhone}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          selectedEvent.status
                        )}`}
                      >
                        {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                      </span>
                      {selectedEvent.registrationRequired && (
                        <span className="ml-2 inline-block px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 border border-amber-200">
                          Registration Required
                        </span>
                      )}
                      {selectedEvent.isRecurring && selectedEvent.recurringPattern && (
                        <span className="ml-2 inline-block px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 border border-amber-200">
                          Recurring ({selectedEvent.recurringPattern})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Details Section */}
                {(selectedEvent.pujaItems || selectedEvent.specialInstructions) && (
                  <div className="mt-6 space-y-4">
                    {selectedEvent.pujaItems && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Rituals / Puja Items Required
                        </h4>
                        <p className="text-gray-600 bg-gray-50 rounded-xl p-4">{selectedEvent.pujaItems}</p>
                      </div>
                    )}

                    {selectedEvent.specialInstructions && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Special Instructions
                        </h4>
                        <p className="text-gray-600 bg-gray-50 rounded-xl p-4">{selectedEvent.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* All Media Gallery */}
                {selectedEvent.media && selectedEvent.media.length > 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Gallery ({selectedEvent.media.length} items)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedEvent.media.map((media) => (
                        <div key={media.id} className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100 border border-gray-200">
                          {media.type === 'video' ? (
                            <div className="relative w-full h-full">
                              {playingVideoId === media.id ? (
                                <video
                                  src={media.url}
                                  controls
                                  autoPlay
                                  className="w-full h-full object-cover"
                                  onEnded={() => setPlayingVideoId(null)}
                                />
                              ) : (
                                <>
                                  <img
                                    src={media.url}
                                    alt="Event media"
                                    className="w-full h-full object-cover"
                                  />
                                  <div 
                                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer hover:bg-opacity-50 transition-opacity duration-200"
                                    onClick={() => setPlayingVideoId(media.id)}
                                  >
                                    <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 hover:scale-110">
                                      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="text-amber-600 ml-0.5">
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="relative w-full h-full group/image-gallery bg-gray-100">
                              {media.url ? (
                                <img
                                  src={media.url}
                                  alt="Event media"
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
                                  No image URL
                                </div>
                              )}
                            </div>
                          )}
                          {media.isPrimary && (
                            <div className="absolute top-2 left-2 bg-amber-600 text-white text-xs font-medium px-2 py-1 rounded-full z-10">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                      {/* Add More Media Card */}
                      <div 
                        className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100 border-2 border-dashed border-gray-300 hover:border-amber-500 hover:bg-amber-50 transition-all duration-200 cursor-pointer flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (imageUploadRef.current) {
                            imageUploadRef.current.click();
                          }
                        }}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors duration-200">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-600 group-hover:text-amber-600">Upload</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    {selectedEvent.status === 'upcoming' && (
                      <button
                        onClick={() => {
                          handleExecuteEvent(selectedEvent.id);
                          setSelectedEvent({ ...selectedEvent, status: 'ongoing' });
                        }}
                        className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Execute Event
                      </button>
                    )}
                    {selectedEvent.status === 'ongoing' && (
                      <button
                        onClick={() => {
                          handleCompleteEvent(selectedEvent.id);
                          setSelectedEvent({ ...selectedEvent, status: 'completed' });
                        }}
                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Mark as Completed
                      </button>
                    )}
                    {(selectedEvent.status === 'upcoming' || selectedEvent.status === 'ongoing') && (
                      <button
                        onClick={() => {
                          handleCancelEvent(selectedEvent.id);
                          setSelectedEvent({ ...selectedEvent, status: 'cancelled' });
                        }}
                        className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Event
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedEvent(null);
                        setPlayingVideoId(null);
                      }}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 hover:scale-105 flex items-center gap-2"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}
