'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DonationFormModal from '../../components/donations/DonationFormModal';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../components/navigation/navigationData';

interface Donation {
  id: string;
  eventId: string;
  donorName: string;
  amount: number;
  paymentMethod: 'cash' | 'online' | 'cheque' | 'bank_transfer';
  date: string;
  time: string;
  receiptNumber?: string;
  notes?: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  media?: Array<{
    id: string;
    type: 'image' | 'video';
    url: string;
    isPrimary: boolean;
  }>;
}

export default function EventDonationsPage() {
  const searchParams = useSearchParams();
  const module = navigationMenus.projects.find(m => m.id === 'event-donations');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'donations'>('overview');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  // Handle query parameters
  useEffect(() => {
    if (searchParams?.get('action') === 'record') {
      setShowDonationModal(true);
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('action');
      window.history.replaceState({}, '', url.toString());
    }
    if (searchParams?.get('tab') === 'donations') {
      setViewMode('donations');
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('tab');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState<string>('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: 'd1',
      eventId: '1',
      donorName: 'Rajesh Kumar',
      amount: 5000,
      paymentMethod: 'online',
      date: '2024-03-05',
      time: '10:30 AM',
      receiptNumber: 'REC-2024-001',
      status: 'completed',
    },
    {
      id: 'd2',
      eventId: '1',
      donorName: 'Priya Sharma',
      amount: 2000,
      paymentMethod: 'cash',
      date: '2024-03-06',
      time: '02:15 PM',
      receiptNumber: 'REC-2024-002',
      status: 'completed',
    },
    {
      id: 'd3',
      eventId: '3',
      donorName: 'Amit Patel',
      amount: 10000,
      paymentMethod: 'bank_transfer',
      date: '2024-03-08',
      time: '09:00 AM',
      receiptNumber: 'REC-2024-003',
      notes: 'For Annadanam Seva',
      status: 'completed',
    },
  ]);

  // Sample events data
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Maha Shivaratri Celebration',
      description: 'Annual celebration with special puja and prasad distribution.',
      date: '2024-03-08',
      time: '06:00 PM',
      location: 'Main Temple Hall',
      status: 'upcoming',
      category: 'Religious Festival',
      media: [
        {
          id: 'm1',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
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
      category: 'Spiritual Event',
      media: [
        {
          id: 'm4',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&q=80',
          isPrimary: true,
        },
      ],
    },
    {
      id: '3',
      title: 'Annadanam Seva',
      description: 'Free meal service for devotees. Serving with love and devotion.',
      date: '2024-03-10',
      time: '12:00 PM',
      location: 'Dining Hall',
      status: 'ongoing',
      category: 'Service Event',
      media: [
        {
          id: 'm6',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop&q=80',
          isPrimary: true,
        },
      ],
    },
  ]);

  const handleDonationSubmit = (donationData: {
    eventId: string;
    donorName: string;
    amount: number;
    paymentMethod: 'cash' | 'online' | 'cheque' | 'bank_transfer';
    date: string;
    time: string;
    receiptNumber?: string;
    notes?: string;
  }) => {
    const newDonation: Donation = {
      id: `d${Date.now()}`,
      ...donationData,
      status: 'completed',
    };
    setDonations([...donations, newDonation]);
  };

  const getEventDonations = (eventId: string) => {
    return donations.filter(d => d.eventId === eventId);
  };

  const getTotalDonations = (eventId: string) => {
    return getEventDonations(eventId).reduce((sum, d) => sum + d.amount, 0);
  };

  const getAllDonationsTotal = () => {
    return donations.reduce((sum, d) => sum + d.amount, 0);
  };

  // Filter donations based on search and filters
  const getFilteredDonations = () => {
    let filtered = selectedEvent
      ? getEventDonations(selectedEvent.id)
      : donations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          events.find((e) => e.id === d.eventId)?.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Event filter
    if (filterEvent !== 'all') {
      filtered = filtered.filter((d) => d.eventId === filterEvent);
    }

    // Payment method filter
    if (filterPaymentMethod !== 'all') {
      filtered = filtered.filter((d) => d.paymentMethod === filterPaymentMethod);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((d) => d.status === filterStatus);
    }

    return filtered;
  };

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

  const getPaymentMethodColor = (method: Donation['paymentMethod']) => {
    switch (method) {
      case 'online':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cash':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cheque':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'bank_transfer':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const stats = {
    totalDonations: getAllDonationsTotal(),
    totalDonors: new Set(donations.map(d => d.donorName)).size,
    totalEvents: events.length,
    averageDonation: donations.length > 0 ? getAllDonationsTotal() / donations.length : 0,
  };

  return (
    <ModuleLayout
      title="Event Donations"
      description="View and manage donations for temple events"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Projects' },
        { label: 'Event Donations' },
      ]}
      action={
        <button
          onClick={() => {
            setSelectedEvent(null);
            setShowDonationModal(true);
          }}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 group"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="group-hover:rotate-90 transition-transform duration-300">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Record Donation
        </button>
      }
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="event-donations"
        category="projects"
      />

      <div className="space-y-6">

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 bg-white/50 rounded-t-2xl p-1 backdrop-blur-sm">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-6 py-3 font-medium transition-all duration-200 rounded-xl ${
                viewMode === 'overview'
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('donations')}
              className={`px-6 py-3 font-medium transition-all duration-200 rounded-xl ${
                viewMode === 'donations'
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              All Donations
            </button>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-6 shadow-lg border border-amber-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalDonations.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Donors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDonors}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50/50 rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEvents}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg. Donation</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{Math.round(stats.averageDonation).toLocaleString('en-IN')}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {viewMode === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Events with Donations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => {
                  const eventDonations = getEventDonations(event.id);
                  const totalAmount = getTotalDonations(event.id);
                  const primaryMedia = event.media?.find(m => m.isPrimary) || event.media?.[0];

                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                    >
                      {/* Event Image */}
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

                      {/* Event Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{event.description}</p>

                        {/* Donation Stats */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Total Donations</span>
                            <span className="text-lg font-bold text-amber-600">₹{totalAmount.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Donations Count</span>
                            <span className="text-sm font-semibold text-gray-900">{eventDonations.length}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span className="text-gray-400">•</span>
                            <span>{event.time}</span>
                          </div>
                        </div>

                        {eventDonations.length > 0 ? (
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                                setViewMode('donations');
                              }}
                              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                            >
                              View All ({eventDonations.length})
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Show first donation details directly
                                const firstDonation = donations.find(d => d.eventId === event.id);
                                if (firstDonation) {
                                  setSelectedDonation(firstDonation);
                                }
                              }}
                              className="px-4 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                              title="View donation details"
                            >
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                              setShowDonationModal(true);
                            }}
                            className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Record First Donation
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* All Donations Tab */}
        {viewMode === 'donations' && (
          <div className="space-y-6">
            {selectedEvent && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedEvent.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedEvent ? `${selectedEvent.title} - Donations` : 'All Donations'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Showing {getFilteredDonations().length} of {selectedEvent ? getEventDonations(selectedEvent.id).length : donations.length} donations
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const filtered = getFilteredDonations();
                      const csv = [
                        ['Donor', 'Amount', 'Payment Method', 'Date', 'Time', 'Receipt', 'Status', 'Event'].join(','),
                        ...filtered.map((d) => {
                          const event = events.find((e) => e.id === d.eventId);
                          return [
                            d.donorName,
                            d.amount,
                            d.paymentMethod,
                            d.date,
                            d.time,
                            d.receiptNumber || 'N/A',
                            d.status,
                            event?.title || 'N/A',
                          ].join(',');
                        }),
                      ].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `event-donations-${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                    }}
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                </div>

                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search donations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                    />
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <select
                    value={filterEvent}
                    onChange={(e) => setFilterEvent(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  >
                    <option value="all">All Events</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterPaymentMethod}
                    onChange={(e) => setFilterPaymentMethod(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  >
                    <option value="all">All Payment Methods</option>
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                    <option value="cheque">Cheque</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Donor</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Receipt</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getFilteredDonations().map((donation) => {
                      const event = events.find(e => e.id === donation.eventId);
                      return (
                        <tr
                          key={donation.id}
                          className="hover:bg-amber-50/50 transition-colors duration-200 cursor-pointer"
                          onClick={() => setSelectedDonation(donation)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                            {event && (
                              <div className="text-xs text-gray-500 mt-1">{event.title}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-amber-600">₹{donation.amount.toLocaleString('en-IN')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentMethodColor(
                                donation.paymentMethod
                              )}`}
                            >
                              {donation.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(donation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            <div className="text-xs text-gray-500">{donation.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{donation.receiptNumber || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                donation.status === 'completed'
                                  ? 'bg-amber-100 text-amber-700'
                                  : donation.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDonation(donation);
                              }}
                              className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-1.5"
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Donation Detail Modal */}
      {selectedDonation && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fade-in_0.3s_cubic-bezier(0.4,0,0.2,1)] overflow-y-auto"
          onClick={() => setSelectedDonation(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-[scale-in_0.3s_cubic-bezier(0.4,0,0.2,1)] my-8 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-white to-gray-50/50 border-b border-gray-200 px-6 py-5 flex items-center justify-between rounded-t-3xl z-10 backdrop-blur-sm">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 font-serif">Donation Details</h2>
                <p className="text-sm text-gray-600 mt-1">Receipt #{selectedDonation.receiptNumber || 'N/A'}</p>
              </div>
              <button
                onClick={() => setSelectedDonation(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl p-2 transition-all duration-200 hover:scale-110"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200">
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-600 mb-2">₹{selectedDonation.amount.toLocaleString('en-IN')}</div>
                  <div className="text-sm text-gray-600">Donation Amount</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Information */}
                {(() => {
                  const event = events.find(e => e.id === selectedDonation.eventId);
                  return event ? (
                    <div className="md:col-span-2 flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Event</p>
                        <p className="text-gray-900 font-semibold">{event.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                          <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span>•</span>
                          <span>{event.time}</span>
                          <span>•</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Donor Name</p>
                    <p className="text-gray-900 font-medium">{selectedDonation.donorName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border mt-1 ${getPaymentMethodColor(
                        selectedDonation.paymentMethod
                      )}`}
                    >
                      {selectedDonation.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date & Time</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedDonation.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-gray-600 text-sm">{selectedDonation.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Receipt Number</p>
                    <p className="text-gray-900 font-medium">{selectedDonation.receiptNumber || 'Not Generated'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                        selectedDonation.status === 'completed'
                          ? 'bg-amber-100 text-amber-700'
                          : selectedDonation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {selectedDonation.status.charAt(0).toUpperCase() + selectedDonation.status.slice(1)}
                    </span>
                  </div>
                </div>

                {selectedDonation.notes && (
                  <div className="md:col-span-2 flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10m-7 4h7M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
                      <p className="text-gray-600 bg-gray-50 rounded-xl p-4">{selectedDonation.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 hover:scale-105"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Donation Modal */}
      <DonationFormModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onSubmit={handleDonationSubmit}
        events={events}
      />
    </ModuleLayout>
  );
}

