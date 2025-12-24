"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import DonationFormModal from '../../components/donations/DonationFormModal';
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

export default function EventDonationsClient() {
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
    try {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('action') === 'record') {
        setShowDonationModal(true);
        sp.delete('action');
        const url = new URL(window.location.href);
        url.search = sp.toString();
        window.history.replaceState({}, '', url.toString());
      }
      if (sp.get('tab') === 'donations') {
        setViewMode('donations');
        sp.delete('tab');
        const url = new URL(window.location.href);
        url.search = sp.toString();
        window.history.replaceState({}, '', url.toString());
      }
    } catch (e) {
      // ignore in non-browser environments
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState<string>('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [donations, setDonations] = useState<Donation[]>([]);

  const [events] = useState<Event[]>([]);

  const handleDonationSubmit = (donationData: any) => {
    const newDonation: Donation = {
      id: `d${Date.now()}`,
      ...donationData,
      status: 'completed',
    };
    setDonations(prev => [...prev, newDonation]);
  };

  const getEventDonations = (eventId: string) => donations.filter(d => d.eventId === eventId);
  const getTotalDonations = (eventId: string) => getEventDonations(eventId).reduce((sum, d) => sum + d.amount, 0);
  const getAllDonationsTotal = () => donations.reduce((sum, d) => sum + d.amount, 0);

  const getFilteredDonations = () => {
    let filtered = selectedEvent ? getEventDonations(selectedEvent.id) : donations;

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          events.find((e) => e.id === d.eventId)?.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterEvent !== 'all') filtered = filtered.filter((d) => d.eventId === filterEvent);
    if (filterPaymentMethod !== 'all') filtered = filtered.filter((d) => d.paymentMethod === filterPaymentMethod);
    if (filterStatus !== 'all') filtered = filtered.filter((d) => d.status === filterStatus);

    return filtered;
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
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Projects' }, { label: 'Event Donations' }]}
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
      <ModuleNavigation subServices={subServices} functions={functions} moduleId="event-donations" category="projects" />

      <div className="space-y-6">
        {/* simplified client UI - original detailed UI kept in repo; this component focuses on client-only hooks */}
        <div className="p-4">Event Donations client area (interactive)</div>
      </div>

      {showDonationModal && (
        <DonationFormModal
          isOpen={showDonationModal}
          onClose={() => setShowDonationModal(false)}
          onSubmit={handleDonationSubmit}
          events={events}
        />
      )}
    </ModuleLayout>
  );
}
