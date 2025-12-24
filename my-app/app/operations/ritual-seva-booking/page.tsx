'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ModuleLayout from '../../components/layout/ModuleLayout';
import { getAllSevas } from './sevaData';

export default function RitualSevaBookingPage() {
  const [stats, setStats] = useState({
    totalSevas: 0,
    activeSevas: 0,
    draftSevas: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    const allSevas = getAllSevas();
    const activeSevas = allSevas.filter((s: any) => s.status === 'active');
    const draftSevas = allSevas.filter((s: any) => s.status === 'draft');
    const totalBookings = allSevas.reduce((sum: number, s: any) => sum + (s.bookingSlots || 0), 0);

    setStats({
      totalSevas: allSevas.length,
      activeSevas: activeSevas.length,
      draftSevas: draftSevas.length,
      totalBookings: totalBookings,
    });
  }, []);

  return (
    <ModuleLayout
      title="Seva and Darshan Management"
      description="Comprehensive management of sevas, bookings, and darshan services"
    >
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/operations/ritual-seva-booking/define-seva"
            className="group bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-1 no-underline"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Manage Sevas</h3>
            </div>
            <p className="text-sm text-gray-600">Create and edit sevas</p>
          </Link>

          <Link
            href="/operations/ritual-seva-booking/slot-management"
            className="group bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 no-underline"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Slot Management</h3>
            </div>
            <p className="text-sm text-gray-600">Monitor slot availability</p>
          </Link>

          <Link
            href="/operations/ritual-seva-booking/pricing-management"
            className="group bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-1 no-underline"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Pricing Management</h3>
            </div>
            <p className="text-sm text-gray-600">Manage seva pricing</p>
          </Link>

          <Link
            href="/operations/ritual-seva-booking/seva-details"
            className="group bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-1 no-underline"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">View Sevas</h3>
            </div>
            <p className="text-sm text-gray-600">Browse all sevas</p>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Sevas</h3>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-5xl font-bold text-gray-900 mb-2">{stats.totalSevas}</p>
          <p className="text-sm text-gray-600">All sevas in system</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Active Sevas</h3>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-5xl font-bold text-gray-900 mb-2">{stats.activeSevas}</p>
          <p className="text-sm text-gray-600">Currently active</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Draft Sevas</h3>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
          <p className="text-5xl font-bold text-gray-900 mb-2">{stats.draftSevas}</p>
          <p className="text-sm text-gray-600">In draft status</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Bookings</h3>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-5xl font-bold text-gray-900 mb-2">{stats.totalBookings}</p>
          <p className="text-sm text-gray-600">Booked slots</p>
        </div>
      </div>
    </ModuleLayout>
  );
}
